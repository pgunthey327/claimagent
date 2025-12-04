import { readPDF } from "../tools/pdfReader.js";
import { readImage } from "../tools/imageReader.js";

export const intakeAgent = async ({ pdfPath, imagePaths }) => {
  const pdfText = await readPDF(pdfPath);
console.log(pdfText)
  let imagesText = "";
  if (imagePaths) {
    for (const img of imagePaths) {
      imagesText += await readImage(img);
    }
  }

  return {
    pdfText,
    imagesText
  };
};
