import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

/**
 * Loads the 34-page Employee Handbook PDF, draws the candidate's electronic signature,
 * printed name, and date of acknowledgement on Page 34, and either opens or downloads the resulting PDF.
 */
export async function generateAndOpenSignedHandbookPdf({
  candidateName = "Candidate",
  printName = "",
  dateOfAcknowledgement = "",
  isSigned = true,
  action = "open", // 'open' | 'download'
}) {
  try {
    const finalPrintName = printName || candidateName || "Candidate";
    const finalDate = dateOfAcknowledgement || new Date().toISOString().split("T")[0];

    // Fetch template 34-page PDF from public folder
    const existingPdfBytes = await fetch("/pdfs/employee-handbook.pdf.pdf").then((res) => {
      if (!res.ok) throw new Error("Handbook template PDF not found");
      return res.arrayBuffer();
    });

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1]; // Page 34
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    if (isSigned) {
      // Draw signature acknowledgement on Page 34
      // Line 1: (please sign) at exact baseline 178.7 -> resting at y = 181.5
      lastPage.drawText("[X] Electronically Signed: " + finalPrintName, {
        x: 105,
        y: 181.5,
        size: 10.5,
        font: helveticaBold,
        color: rgb(0.08, 0.4, 0.75),
      });
    }

    // Line 2: (please print name) at exact baseline 155.6 -> resting at y = 158.5
    lastPage.drawText(finalPrintName, {
      x: 105,
      y: 158.5,
      size: 10.5,
      font: helvetica,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Line 3: (date of acknowledgement) at exact baseline 132.6 -> resting at y = 135.5
    lastPage.drawText(finalDate, {
      x: 105,
      y: 135.5,
      size: 10.5,
      font: helvetica,
      color: rgb(0.1, 0.1, 0.1),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);

    if (action === "download") {
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "Signed_Employee_Handbook_" + finalPrintName.replace(/\s+/g, "_") + ".pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.open(blobUrl, "_blank");
    }

    return blobUrl;
  } catch (err) {
    console.error("Error generating signed handbook PDF:", err);
    // Fallback to standard PDF template
    window.open("/pdfs/employee-handbook.pdf.pdf", "_blank");
  }
}
