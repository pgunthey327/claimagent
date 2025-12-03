from crewai import Agent

summary_agent = Agent(
    role="Final Summarizer Agent",
    goal="Create structured JSON of the claim summary for adjusters and system ingestion.",
    backstory="Produces final audit-ready claim packets."
)