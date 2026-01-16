import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Registration } from './types';
import { EVENT_INFO } from './constants';

export async function generateTicketPDF(registration: Registration): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5',
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, width, height, 'F');

  // Gold border
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(2);
  doc.rect(5, 5, width - 10, height - 10, 'S');

  // Inner decorative border
  doc.setLineWidth(0.5);
  doc.rect(8, 8, width - 16, height - 16, 'S');

  // Header section with gold gradient effect (simulated)
  doc.setFillColor(27, 38, 59);
  doc.rect(10, 10, width - 20, 35, 'F');

  // Event name
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(EVENT_INFO.name, width / 2, 28, { align: 'center' });

  // Tagline
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(244, 228, 166);
  doc.text(EVENT_INFO.tagline, width / 2, 38, { align: 'center' });

  // ENTRY PASS text
  doc.setFontSize(14);
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.text('✦ ENTRY PASS ✦', width / 2, 55, { align: 'center' });

  // Decorative line
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.3);
  doc.line(30, 60, width - 30, 60);

  // Participant details section
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');

  let yPos = 72;
  const leftMargin = 15;

  // Name
  doc.text('PARTICIPANT NAME', leftMargin, yPos);
  doc.setTextColor(250, 250, 250);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(registration.name.toUpperCase(), leftMargin, yPos + 7);

  yPos += 20;

  // Registration ID
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('REGISTRATION ID', leftMargin, yPos);
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(registration.id.substring(0, 8).toUpperCase(), leftMargin, yPos + 7);

  // College/Roll
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('COLLEGE / ROLL NO', leftMargin + 55, yPos);
  doc.setTextColor(250, 250, 250);
  doc.setFontSize(10);
  doc.text(registration.roll_college, leftMargin + 55, yPos + 7);

  yPos += 25;

  // Event details
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('DATE', leftMargin, yPos);
  doc.setTextColor(250, 250, 250);
  doc.setFontSize(10);
  doc.text(EVENT_INFO.date, leftMargin, yPos + 7);

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.text('TIME', leftMargin + 55, yPos);
  doc.setTextColor(250, 250, 250);
  doc.setFontSize(10);
  doc.text(EVENT_INFO.time, leftMargin + 55, yPos + 7);

  yPos += 20;

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.text('VENUE', leftMargin, yPos);
  doc.setTextColor(250, 250, 250);
  doc.setFontSize(10);
  doc.text(EVENT_INFO.venue, leftMargin, yPos + 7);

  // QR Code section
  yPos += 25;
  
  // QR code background box
  doc.setFillColor(27, 38, 59);
  doc.roundedRect(width / 2 - 25, yPos - 5, 50, 55, 3, 3, 'F');

  // Generate QR code
  const qrContent = `COALESCE:${registration.id}`;
  const qrDataUrl = await QRCode.toDataURL(qrContent, {
    width: 150,
    margin: 1,
    color: {
      dark: '#d4af37',
      light: '#1b263b',
    },
  });

  doc.addImage(qrDataUrl, 'PNG', width / 2 - 20, yPos, 40, 40);

  // QR instruction
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('Scan for verification', width / 2, yPos + 47, { align: 'center' });

  // Footer
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.3);
  doc.line(30, height - 25, width - 30, height - 25);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('This pass is non-transferable. Please carry a valid ID.', width / 2, height - 18, { align: 'center' });
  
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(9);
  doc.text(EVENT_INFO.location, width / 2, height - 12, { align: 'center' });

  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}
