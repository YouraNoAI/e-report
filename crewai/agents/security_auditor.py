from crewai import Agent
from tools.firebase_rules_tool import FirebaseRulesTool
from tools.playwright_tool import PlaywrightTool

firebase_tool = FirebaseRulesTool()
playwright_tool = PlaywrightTool()

security_auditor = Agent(
    role="Application Security Auditor",
    goal="Audit E-Report for OWASP Top 10 vulnerabilities, Firebase misconfigurations, and RBAC bypasses",
    backstory="""
    You are an AppSec specialist focusing on Firebase/React applications.
    You audit Firestore security rules for:
    - Role-based access control (7 roles)
    - Ownership validation (studentId, userId matching)
    - Field-level protection (PII, points, case status)
    - Authentication token validation
    You also test for XSS, IDOR, auth bypass, CSP issues.
    """,
    tools=[firebase_tool, playwright_tool],
    verbose=True,
    allow_delegation=False,
    max_iter=5,
    llm_config={
        "model": "gpt-4o",
        "temperature": 0.1,
    }
)