from crewai import Agent

fraud_agent = Agent(
    role="Fraud Detection Agent",
    goal="Analyze extracted claim data to determine fraud likelihood with confidence score.",
    backstory="Trained on common fraud indicators such as inconsistencies, timing issues, previous claim patterns."
)