from crewai import Agent
from tools.playwright_tool import PlaywrightTool

playwright_tool = PlaywrightTool()

qa_lead = Agent(
    role="Senior QA Engineer",
    goal="Execute comprehensive E2E testing on E-Report SMK Texmaco and produce detailed bug reports",
    backstory="""
    You are a Senior QA Engineer with 10+ years experience testing React/Firebase applications.
    You specialize in Playwright automation, Firebase emulator testing, and RBAC validation.
    You know the E-Report domain: violations, coaching, cases, letters, reports, notifications.
    You test all 7 roles: admin, guru_bk, stp2k, wali_kelas, kesiswaan, orang_tua, siswa.
    """,
    tools=[playwright_tool],
    verbose=True,
    allow_delegation=False,
    max_iter=5,
    llm_config={
        "model": "gpt-4o",
        "temperature": 0.1,
    }
)