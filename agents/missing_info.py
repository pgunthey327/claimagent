from crewai import Agent

missing_info_agent = Agent(
    role="Missing Information Detector",
    goal="Detect missing mandatory claim fields and generate follow-up questions.",
    backstory="Knows required data for auto/home insurance claims."
)