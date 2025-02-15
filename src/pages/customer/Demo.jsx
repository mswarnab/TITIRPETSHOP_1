import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';

const DownloadPDF = () => {
  const contentRef = useRef(); // Reference to the content to be converted

  const handleDownload = () => {
    const doc = new jsPDF();

    // You can use the `html` method to capture an HTML element and convert it to PDF.
    // jsPDF will convert the content into PDF and automatically scale it.
    doc.html(contentRef.current, {
      callback: (doc) => {
        // When the conversion is done, save the PDF with a filename
        doc.save('downloaded-page.pdf');
      },
      x: 10, // Starting X position of the content in the PDF
      y: 10, // Starting Y position of the content in the PDF
      width: 1000 // Width of the content in the PDF
    });
  };

  return (
    <div>
      <div ref={contentRef} style={{ padding: '20px', background: '#f0f0f0' }}>
        <h1>My Webpage Content</h1>
        <p>This is some sample content that will be converted into a PDF.</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
        <p>More content can go here...</p>
      </div>
      <button onClick={handleDownload}>Download as PDF</button>
    </div>
  );
};

export default DownloadPDF;
