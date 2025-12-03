import streamlit as st
import os
import tempfile
from dotenv import load_dotenv
from crewai import Crew, Process
from agents.intake import claim_intake_agent
from agents.missing_info import missing_info_agent
from agents.fraud import fraud_agent
from agents.routing import routing_agent
from agents.summary import summary_agent
from utils.pdf_export import generate_claim_pdf, encrypt_pdf
from openai import OpenAI

load_dotenv()
client = OpenAI()

st.set_page_config(page_title="Insurance Claim AI", layout="wide")
st.title("🛡️ Insurance Claim Agentic AI")

uploaded_pdf = st.file_uploader("Upload Claim PDF", type=["pdf"])
uploaded_images = st.file_uploader("Upload Accident Images", type=["jpg", "png"], accept_multiple_files=True)

if uploaded_pdf:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(uploaded_pdf.read())
        claim_path = tmp.name

    image_paths = []
    if uploaded_images:
        for img in uploaded_images:
            t = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
            t.write(img.read())
            image_paths.append(t.name)

    if st.button("🚀 Run Claim AI Pipeline"):
        st.info("Running agents…")

        tasks = [
            {"agent": claim_intake_agent, "task": f"Extract data from {claim_path} and images {image_paths}"},
            {"agent": missing_info_agent, "task": "Detect missing info."},
            {"agent": fraud_agent, "task": "Score fraud risk."},
            {"agent": routing_agent, "task": "Route claim."},
            {"agent": summary_agent, "task": "Generate final JSON summary."}
        ]

        crew = Crew(
            agents=[t["agent"] for t in tasks],
            tasks=[t["task"] for t in tasks],
            process=Process.sequential
        )

        result = crew.run()
        st.subheader("📄 Claim Summary")
        st.json(result)

        pdf = generate_claim_pdf(result)
        enc_pdf = encrypt_pdf(pdf, "CLAIM-SECURE-2025")

        with open(enc_pdf, "rb") as f:
            st.download_button(
                "🔐 Download Encrypted PDF",
                f,
                file_name="claim_summary_secure.pdf",
                mime="application/pdf"
            )

# Chatbot
st.header("💬 Adjuster Chatbot")
user_msg = st.chat_input("Ask about claim processing, fraud patterns, etc…")

if "chat" not in st.session_state:
    st.session_state.chat = []

if user_msg:
    st.session_state.chat.append(("user", user_msg))
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": user_msg}]
    )
    answer = response.choices[0].message["content"]
    st.session_state.chat.append(("assistant", answer))

for role, msg in st.session_state.chat:
    st.chat_message(role).markdown(msg)
