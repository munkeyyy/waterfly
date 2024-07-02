

import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"
const generateInvoice =async (invoiceData, filePath) => {
  console.log("invData", invoiceData)
  const doc = new PDFDocument();
  const bgImagePath = path.join(__dirname, 'pdfbg.png');
  console.log('Resolved Path:', bgImagePath); // Log the resolved path

  const formattedSuppliesDates = invoiceData.items
  .map((supply) => new Date(supply.date).toISOString().split('T')[0])
  .sort();
const fromDate = formattedSuppliesDates[0];
const toDate = formattedSuppliesDates[formattedSuppliesDates.length - 1];

  // Check if the file exists
  if (!fs.existsSync(bgImagePath)) {
    console.error('Background image not found:', bgImagePath);
    return;
  }
  
  // Function to add the background image
  const addBackground = () => {
    doc.image(bgImagePath, 0, 0, { width: doc.page.width, height: doc.page.height });
    // doc.rect(0, 0, doc.page.width, doc.page.height).fillOpacity(0.5).fill('white');
  };

  // Add the background image to the first page
  addBackground();

  // Add event listener to add background to each new page
  doc.on('pageAdded', () => {
    addBackground();
  });
  doc.pipe(fs.createWriteStream(filePath));

  // Add title
  doc.font('Times-Roman').fontSize(25).text('Waterfly', { align: 'center' });
  doc.moveDown();

  // Add client and date details
  doc.fontSize(16).text(`Client: ${invoiceData.clientName}`,{align:'center'});
  doc.text(`Date: ${fromDate} - ${toDate}`,{align:'center'});
  // doc.text(`Total Amount: ${invoiceData.totalAmount}`,{align:'center'});
  doc.moveDown();

  // Add table headers
  doc.text('Date', 50, 200, { width: 100, align: 'left' });
  
  doc.fontSize(12).text('Category', 150, 200, { width: 100, align: 'left' });
  doc.text('Quantity', 165, 200, { width: 100, align: 'right' });
  doc.text('Price per Unit', 250, 200, { width: 100, align: 'right' });
  doc.text('Total Amount', 350, 200, { width: 100, align: 'right' });

  // Add a horizontal line
  doc.moveTo(50, 220).lineTo(550, 220).stroke();

  // Add table rows
  let yPosition = 240;
  invoiceData.items.forEach(item => {
    doc.text(item.date.toISOString().split('T')[0], 50, yPosition, { width: 100, align: 'left' });
    doc.text(item.description, 150, yPosition, { width: 100, align: 'left' });
    doc.text(item.quantity, 160, yPosition, { width: 100, align: 'right' });
    doc.text(item.price, 250, yPosition, { width: 100, align: 'right' });
    doc.text(item.total, 350, yPosition, { width: 100, align: 'right' });
    yPosition += 20;
  });
  doc.moveDown().moveTo(50, yPosition + 10).lineTo(550, yPosition + 10).stroke();
  yPosition += 30;
  doc.fontSize(16).text(`Grand Total: ${invoiceData.totalAmount}`, 50, yPosition, { align: 'right' });
  doc.end();
};

module.exports = generateInvoice;
