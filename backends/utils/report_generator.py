from reportlab.lib.pagesizes import letter
from reportlab.platypus import Table, TableStyle, SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import json
import os

def create_report(elevenlabs_response, surgery_details):
    firstName = surgery_details['firstName']
    lastName = surgery_details['lastName']
    procedure = surgery_details['procedure']
    patientId = surgery_details['patientId']

    summary = elevenlabs_response['analysis']['transcript_summary']
    duration_sec = elevenlabs_response['metadata']['call_duration_secs']
    transcript = elevenlabs_response['transcript']
    
    # Załaduj logo
    logo_path = "public/logo.png"
    if os.path.exists(logo_path):
        logo = Image(logo_path, width=1.5*inch, height=1.5*inch)  # Ustawienie rozmiaru logo
    else:
        logo = None  # Jeśli logo nie istnieje, pomijamy je

    # Kolekcjonowanie eventów
    events = []
    for element in transcript:
        try:
            if not element['tool_calls']:
                continue
            for tool_call in element['tool_calls']:
                tool_name = tool_call.get('tool_name')
                if tool_name != 'displayEvent':
                    continue
                    
                params = tool_call.get('params_as_json', '{}')
                if isinstance(params, dict):
                    params_dict = params
                else:
                    params_dict = json.loads(params)
                
                if 'eventType' in params_dict and 'eventValue' in params_dict:
                    event_type = Paragraph(params_dict['eventType'], ParagraphStyle('CellStyle'))
                    event_value = Paragraph(params_dict['eventValue'], ParagraphStyle('CellStyle'))
                    events.append([event_type, event_value])
        except Exception as e:
            print(f"Error processing event: {str(e)}")
            continue
    
    # Tworzenie pliku PDF
    output_filename = f"{firstName}_{lastName}_{procedure}_{patientId}.pdf"
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # Style
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    heading_style = styles['Heading2']
    normal_style = styles['Normal']
    
    wrapped_style = ParagraphStyle(
        'WrappedStyle',
        parent=styles['Normal'],
        spaceBefore=10,
        spaceAfter=10,
        leading=12
    )
    
    cell_style = ParagraphStyle(
        'CellStyle',
        parent=styles['Normal'],
        fontSize=10,
        leading=12,
        spaceBefore=3,
        spaceAfter=3
    )

    # **Budowanie treści raportu**
    content = []

    # **Dodanie przestrzeni przed tytułem, aby logo było niżej**
    content.append(Spacer(1, 30))  # Odstęp przed tytułem i logo

    # **Dodanie sekcji tytułowej i logo po prawej stronie**
    # Tworzymy tabelę z tytułem po lewej i logo po prawej
    header_data = [
        [Paragraph("Surgery Report", title_style), logo if logo else ""]
    ]

    # Przypiszemy odpowiednią szerokość kolumn w tabeli
    header_table = Table(header_data, colWidths=[None, 1.5*inch])  # Pierwsza kolumna dla tekstu, druga dla logo

    # Zastosowanie stylu dla tabeli nagłówka
    header_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),  # Ustawienie wyrównania tekstu
        ('ALIGN', (1, 0), (1, 0), 'CENTER'),  # Zmieniamy wyrównanie logo na CENTER
    ]))

    content.append(header_table)

    content.append(Spacer(1, 12))  # Dodatkowy odstęp dla lepszego wyglądu

    # **Informacje o pacjencie**
    content.append(Paragraph(f"Patient First Name: {firstName}", normal_style))
    content.append(Paragraph(f"Patient Last Name: {lastName}", normal_style))
    content.append(Paragraph(f"Procedure: {procedure}", normal_style))
    content.append(Paragraph(f"Patient ID: {patientId}", normal_style))
    content.append(Spacer(1, 12))
    
    # **Czas trwania rozmowy**
    content.append(Paragraph(f"Duration: {duration_sec} seconds", normal_style))
    content.append(Spacer(1, 12))
    
    # **Podsumowanie**
    content.append(Paragraph("Summary:", heading_style))
    content.append(Paragraph(summary, wrapped_style))
    content.append(Spacer(1, 12))
    
    # **Sekcja z eventami**
    content.append(Paragraph("Events:", heading_style))
    content.append(Spacer(1, 12))
    
    # **Tworzenie tabeli eventów**
    header = [Paragraph("Event Type", cell_style), Paragraph("Event Value", cell_style)]
    table_data = [header] + events
    
    table = Table(table_data, colWidths=[2.5*inch, 4*inch], repeatRows=1)
    
    # Style tabeli
    header_color = colors.Color(0.3, 0.3, 0.3)
    row1_color = colors.Color(0.95, 0.95, 0.95)
    row2_color = colors.Color(1, 1, 1)
    
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_color),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('BOX', (0, 0), (-1, -1), 2, colors.black),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ])
    
    for i in range(1, len(table_data)):  
        if i % 2 == 0:
            style.add('BACKGROUND', (0, i), (-1, i), row1_color)
        else:
            style.add('BACKGROUND', (0, i), (-1, i), row2_color)
    
    table.setStyle(style)
    content.append(table)
    
    # **Generowanie raportu**
    doc.build(content)
    print(f"PDF report saved as {output_filename}")
    
    return events
