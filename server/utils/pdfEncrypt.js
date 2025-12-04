import fs from "fs";
import { PDFDocument, StandardFonts } from "pdf-lib";

export const createEncryptedPDF = async (summary, password) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  let y = 780;

  page.drawText("Insurance Claim Summary", { x: 50, y, size: 16 });
  y -= 40;

  for (const key of Object.keys(summary)) {
    page.drawText(`${key}: ${summary[key]}`, { x: 50, y, size: fontSize });
    y -= 20;
  }

  pdfDoc.encrypt({ userPassword: password, ownerPassword: password });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync("./output/claim_summary_encrypted.pdf", pdfBytes);

  return "./output/claim_summary_encrypted.pdf";
};
