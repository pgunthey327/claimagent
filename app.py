import os
from dotenv import load_dotenv
from crewai import Crew, Process
from agents.intake import claim_intake_agent
from agents.missing_info import missing_info_agent
from agents.fraud import fraud_agent
from agents.routing import routing_agent
from agents.summary import summary_agent
from utils.pdf_export import generate_claim_pdf, encrypt_pdf

load_dotenv()

tasks = [
    {"agent": claim_intake_agent, "task": "Extract all information from input_files/claim.pdf"},
    {"agent": missing_info_agent, "task": "Identify missing mandatory claim fields."},
    {"agent": fraud_agent, "task": "Perform fraud risk analysis."},
    {"agent": routing_agent, "task": "Assign claim to the correct queue."},
    {"agent": summary_agent, "task": "Prepare final JSON summary."}
]

crew = Crew(
    agents=[t["agent"] for t in tasks],
    tasks=[t["task"] for t in tasks],
    process=Process.sequential,
    verbose=True
)

if __name__ == "__main__":
    result = crew.run()
    print("\nFINAL CLAIM SUMMARY:\n")
    print(result)

    pdf_path = generate_claim_pdf(result)
    encrypted_pdf = encrypt_pdf(pdf_path, password="CLAIM-SECURE-2025")

    print(f"\nEncrypted PDF saved at: {encrypted_pdf}")