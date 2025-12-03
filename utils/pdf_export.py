from fpdf import FPDF
from PyPDF2 import PdfReader, PdfWriter
import datetime
import os

def generate_claim_pdf(summary_data, output_path="output/claim_summary.pdf"):
    os.makedirs("output", exist_ok=True)

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    pdf.cell(0, 10, "Insurance Claim Summary", ln=True)
    pdf.ln(4)
    pdf.set_font("Arial", size=10)

    for key, value in summary_data.items():
        pdf.multi_cell(0, 8, f"{key}: {value}")

    pdf.ln(10)
    pdf.set_font("Arial", "I", 8)
    pdf.cell(0, 5, f"Generated on: {datetime.datetime.now()}", ln=True)

    pdf.output(output_path)
    return output_path


def encrypt_pdf(input_pdf, password, output_encrypted="output/claim_summary_encrypted.pdf"):
    reader = PdfReader(input_pdf)
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    writer.encrypt(password)

    with open(output_encrypted, "wb") as f:
        writer.write(f)

    return output_encrypted