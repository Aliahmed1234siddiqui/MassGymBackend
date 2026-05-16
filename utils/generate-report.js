const PDFDocument = require('pdfkit');

const generatePaymentReport = (payments, res) => {
  const doc = new PDFDocument({ margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=payment-report.pdf');
  doc.pipe(res);

  // Header
  doc.fontSize(20).font('Helvetica-Bold').text('Mass Gym', { align: 'center' });
  doc.fontSize(13).font('Helvetica').text('Payment Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString('en-PK')}`);
  doc.moveDown();

  // Table header
  doc.font('Helvetica-Bold').fontSize(10);
  doc.text('Invoice',  40,  doc.y, { continued: true, width: 100 });
  doc.text('Member',  140,  doc.y, { continued: true, width: 140 });
  doc.text('Amount',  280,  doc.y, { continued: true, width: 80  });
  doc.text('Method',  360,  doc.y, { continued: true, width: 80  });
  doc.text('Status',  440,  doc.y, { width: 80 });
  doc.moveDown(0.5);
  doc.moveTo(40, doc.y).lineTo(520, doc.y).stroke();
  doc.moveDown(0.5);

  // Rows
  doc.font('Helvetica').fontSize(9);
  payments.forEach(p => {
    const y = doc.y;
    doc.text(p.invoiceNumber || '-', 40,  y, { continued: true, width: 100 });
    doc.text(p.member?.name  || '-', 140, y, { continued: true, width: 140 });
    doc.text(`Rs ${p.amount}`,       280, y, { continued: true, width: 80  });
    doc.text(p.method,               360, y, { continued: true, width: 80  });
    doc.text(p.status,               440, y, { width: 80 });
    doc.moveDown(0.4);
  });

  doc.end();
};

module.exports = { generatePaymentReport };