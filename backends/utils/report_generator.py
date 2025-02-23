from reportlab.lib.pagesizes import letter
from reportlab.platypus import Table, TableStyle, SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import json
import os
from io import BytesIO
import database
from datetime import datetime
import pytz

def create_report(elevenlabs_response, surgery_details, operation_id):
    firstName = surgery_details['patient_first_name']
    lastName = surgery_details['patient_last_name']
    procedure = surgery_details['operation_type']
    patientId = surgery_details['patient_id']

    summary = elevenlabs_response['analysis']['transcript_summary']
    duration_sec = elevenlabs_response['metadata']['call_duration_secs']
    transcript = elevenlabs_response['transcript']
    
    # Załaduj logo
    logo_path = "utils/public/logo.png"
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
                    event_with_timestamp = database.get_events_for_operation_id_and_value(operation_id, params_dict['eventValue'])
                    if event_with_timestamp:
                        print(f"Event {params_dict['eventValue']} with timestamp: {event_with_timestamp[0]}")
                        # Convert string to datetime object in UTC
                        utc_timezone = pytz.utc
                        utc_time = datetime.strptime(event_with_timestamp[0], "%Y-%m-%d %H:%M:%S")
                        utc_time = utc_timezone.localize(utc_time)
                        print("UTC time: ", utc_time)

                        # Convert to Warsaw time
                        warsaw_timezone = pytz.timezone("Europe/Warsaw")
                        warsaw_time = utc_time.astimezone(warsaw_timezone)
                        print("Warsaw time: ", warsaw_time)
                        warsaw_time = warsaw_time.strftime("%Y-%m-%d %H:%M:%S")
                        print("Warsaw time string: ", warsaw_time)
                        event_timestamps = Paragraph(warsaw_time, ParagraphStyle('CellStyle'))
                    else:
                        event_timestamps = Paragraph(" ", ParagraphStyle('CellStyle'))
                    event_value = Paragraph(params_dict['eventValue'], ParagraphStyle('CellStyle'))
                    events.append([event_timestamps, event_value])
        except Exception as e:
            print(f"Error processing event: {str(e)}")
            continue
    
    # Tworzenie pliku PDF
    output_filename = f"surgery_report_{patientId}.pdf"
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
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
    # Define the custom style for "MediceusAI" branding
    mediceus_style = ParagraphStyle(
        'MediceusStyle',
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=colors.HexColor("#1E3A8A"),  # Equivalent to text-blue-900
        alignment=1,  # Center align inside its cell
        spaceBefore=6
    )

    # Create the "MediceusAI" text
    mediceus_text = Paragraph("MediceusAI", mediceus_style)

    # Stack logo and text in a vertical table (single-column)
    logo_and_text = Table([[logo], [mediceus_text]], colWidths=[1.5*inch])

    # Align content inside the rightmost column
    logo_and_text.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),  # Center align inside the column
        ('VALIGN', (0, 0), (-1, -1), 'TOP')  # Align to the top
    ]))

    # Create a header table with two columns (left empty, right contains logo+text)
    header_table = Table([["", logo_and_text]], colWidths=[None, 1.5*inch])

    # Apply alignment to ensure logo & text are in the top-right corner
    header_table.setStyle(TableStyle([
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),  # Right align the entire cell
        ('VALIGN', (1, 0), (1, 0), 'TOP'),  # Align to the top of the page
    ]))

    # Add the header table to the document content
    content.append(header_table)
    content.append(Spacer(1, 12))  # Add spacing

    # Add the "Surgery Report" title below
    content.append(Paragraph("Surgery Report", title_style))
    content.append(Spacer(1, 12))  # Additional spacing before patient details



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
    header = [Paragraph("Timestamp", cell_style), Paragraph("Event Value", cell_style)]
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
    
    buffer.seek(0)  # Ensure the buffer is positioned at the beginning
    print(f"PDF report saved as {output_filename}")
    
    return buffer, output_filename
