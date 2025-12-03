from crewai import Agent

routing_agent = Agent(
    role="Claim Routing Agent",
    goal="Assign claim to correct queue (Express, Moderate, Major Loss).",
    backstory="Understands insurance claim workflows."
)