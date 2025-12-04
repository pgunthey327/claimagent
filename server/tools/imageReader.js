import Tesseract from "tesseract.js";
import fs from "fs";

export const readImage = async (path) => {
  const result = await Tesseract.recognize(path, "eng");
  return result.data.text;
};
