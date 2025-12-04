import fs from "fs";
import pdf from "pdf-extraction";

export const readPDF = async (path) => {
  const buffer = fs.readFileSync(path);
  const data = await pdf(buffer);

  return data.text; // already extracted text
};
