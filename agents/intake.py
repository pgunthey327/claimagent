from crewai import Agent
from tools.file_reader import pdf_tool, image_tool

claim_intake_agent = Agent(
    role="Claim Intake & Extraction Agent",
    goal="Extract all structured information from claim documents and images.",
    backstory="Expert at reading insurance claims, extracting fields like claimant name, policy number, date of incident, damage description, etc.",
    tools=[pdf_tool, image_tool],
    allow_delegation=False
)