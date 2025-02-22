from reportlab.lib.pagesizes import letter
from reportlab.platypus import Table, TableStyle, SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import json

def create_report(elevenlabs_response, surgery_details):
    firstName = surgery_details['firstName']
    lastName = surgery_details['lastName']
    procedure = surgery_details['procedure']
    patientId = surgery_details['patientId']

    summary = elevenlabs_response['analysis']['transcript_summary']
    duration_sec = elevenlabs_response['metadata']['call_duration_secs']
    transcript = elevenlabs_response['transcript']
    
    # Collect all events
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
                    # Create Paragraph objects for cell content to enable wrapping
                    event_type = Paragraph(params_dict['eventType'], ParagraphStyle('CellStyle'))
                    event_value = Paragraph(params_dict['eventValue'], ParagraphStyle('CellStyle'))
                    events.append([event_type, event_value])
        except Exception as e:
            print(f"Error processing event: {str(e)}")
            continue
    
    # Setup the document
    output_filename = f"{firstName}_{lastName}_{procedure}_{patientId}.pdf"
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # Styles
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    heading_style = styles['Heading2']
    normal_style = styles['Normal']
    
    # Custom style for wrapped text
    wrapped_style = ParagraphStyle(
        'WrappedStyle',
        parent=styles['Normal'],
        spaceBefore=10,
        spaceAfter=10,
        leading=12
    )
    
    # Custom style for table cells
    cell_style = ParagraphStyle(
        'CellStyle',
        parent=styles['Normal'],
        fontSize=10,
        leading=12,
        spaceBefore=3,
        spaceAfter=3
    )
    
    # Build the document content
    content = []
    
    # Title
    content.append(Paragraph("Surgery Report", title_style))
    content.append(Spacer(1, 12))
    
    # Patient Info
    content.append(Paragraph(f"Patient First Name: {firstName}", normal_style))
    content.append(Paragraph(f"Patient Last Name: {lastName}", normal_style))
    content.append(Paragraph(f"Procedure: {procedure}", normal_style))
    content.append(Paragraph(f"Patient ID: {patientId}", normal_style))
    content.append(Spacer(1, 12))
    
    # Duration
    content.append(Paragraph(f"Duration: {duration_sec} seconds", normal_style))
    content.append(Spacer(1, 12))
    
    # Summary Section
    content.append(Paragraph("Summary:", heading_style))
    content.append(Paragraph(summary, wrapped_style))
    content.append(Spacer(1, 12))
    
    # Events Table
    content.append(Paragraph("Events:", heading_style))
    content.append(Spacer(1, 12))
    
    # Table with all events
    # Create header with Paragraph objects
    header = [Paragraph("Event Type", cell_style), Paragraph("Event Value", cell_style)]
    table_data = [header] + events
    
    # Create table with specified column widths
    table = Table(table_data, colWidths=[2.5*inch, 4*inch], repeatRows=1)
    
    # Define colors for alternating rows
    header_color = colors.Color(0.3, 0.3, 0.3)  # Dark gray
    row1_color = colors.Color(0.95, 0.95, 0.95)  # Very light gray
    row2_color = colors.Color(1, 1, 1)  # White
    
    # Create table style with alternating row colors
    style = TableStyle([
        # Header styling
        ('BACKGROUND', (0, 0), (-1, 0), header_color),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        
        # Grid
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('BOX', (0, 0), (-1, -1), 2, colors.black),
        
        # Padding
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        
        # Alignment
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ])
    
    # Add alternating row colors
    for i in range(1, len(table_data)):  # Start from 1 to skip header
        if i % 2 == 0:
            style.add('BACKGROUND', (0, i), (-1, i), row1_color)
        else:
            style.add('BACKGROUND', (0, i), (-1, i), row2_color)
    
    table.setStyle(style)
    content.append(table)
    
    # Build the PDF
    doc.build(content)
    print(f"PDF report saved as {output_filename}")
    
    return events