import os
import sys
from crewai import Agent, Task, Crew, Process, LLM

docs_dir = "/workspaces/e-report"

def read_doc(filename):
    path = os.path.join(docs_dir, filename)
    if os.path.exists(path):
        with open(path, "r") as f:
            return f.read()
    return ""

PRD = read_doc("PRD.md")
WIREFRAME = read_doc("Wireframe.md")
DESCRIPT = read_doc("Descript.md")
CLAUDE_MD = read_doc("CLAUDE.md")

print("=" * 80)
print("VIRTUAL SOFTWARE COMPANY - E-REPORT SMK TEXMACO SUBANG")
print("=" * 80)
print(f"\nDocuments loaded: PRD.md ({len(PRD)} chars), Wireframe.md ({len(WIREFRAME)} chars), Descript.md ({len(DESCRIPT)} chars), CLAUDE.md ({len(CLAUDE_MD)} chars)")
print("\nInitializing 17 agents...\n")

api_key = os.getenv("OPENROUTER_API_KEY", "")
if api_key:
    llm = LLM(
        model=os.getenv("CREWAI_MODEL", "openrouter/deepseek/deepseek-v4-flash"),
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
    )
else:
    llm = None

agent_kwargs = {}
if llm:
    agent_kwargs["llm"] = llm

ceo = Agent(
    role="Chief Executive Officer",
    goal="Oversee the entire project, make final decisions, ensure vision alignment",
    backstory="You are the CEO of a software company. You ensure all teams work together toward the product vision. You have final say on all decisions.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

pm = Agent(
    role="Product Manager",
    goal="Define product requirements, prioritize features, ensure stakeholder needs are met",
    backstory="You are an experienced Product Manager who translates stakeholder needs into clear requirements.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

project_manager = Agent(
    role="Project Manager",
    goal="Plan project timeline, track milestones, manage resources and risks",
    backstory="You are a certified Project Manager who ensures projects are delivered on time and within budget.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

ba = Agent(
    role="Business Analyst",
    goal="Analyze business processes, identify requirements, document workflows",
    backstory="You are a Business Analyst who bridges the gap between business needs and technical solutions.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

sa = Agent(
    role="System Analyst",
    goal="Analyze system requirements, design system architecture, define technical specifications",
    backstory="You are a System Analyst who designs comprehensive system solutions.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

architect = Agent(
    role="Software Architect",
    goal="Design the overall software architecture, ensure scalability and maintainability",
    backstory="You are a seasoned Software Architect who builds robust, scalable systems.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

firebase_architect = Agent(
    role="Firebase Architect",
    goal="Design optimal Firestore database structure, security rules, and Firebase services integration",
    backstory="You are a Firebase expert who designs secure, scalable, cost-effective Firestore databases.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

security_architect = Agent(
    role="Security Architect",
    goal="Identify security risks, design security controls, ensure compliance",
    backstory="You are a Security Architect who protects systems from threats and ensures data security.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

db_architect = Agent(
    role="Database Architect",
    goal="Design data models, indexes, migration plans, and data dictionaries",
    backstory="You are a Database Architect who designs efficient, well-structured data storage solutions.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

ux_researcher = Agent(
    role="UI UX Researcher",
    goal="Research user needs, analyze user behavior, define user personas and journeys",
    backstory="You are a UX Researcher who understands user needs through research and data.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

ux_designer = Agent(
    role="UI UX Designer",
    goal="Design intuitive interfaces, create wireframes, ensure accessibility",
    backstory="You are a UI/UX Designer who creates beautiful, accessible, user-friendly interfaces.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

frontend_architect = Agent(
    role="Frontend Architect",
    goal="Design component architecture, state management, routing strategy",
    backstory="You are a Frontend Architect who builds scalable, performant React applications.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

qa = Agent(
    role="QA Engineer",
    goal="Design test strategies, ensure quality standards, identify edge cases",
    backstory="You are a QA Engineer who ensures every feature meets quality standards.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

tester = Agent(
    role="Software Tester",
    goal="Execute test cases, report bugs, verify fixes",
    backstory="You are a Software Tester who finds bugs before users do.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

tech_writer = Agent(
    role="Technical Writer",
    goal="Create comprehensive documentation, user manuals, technical reports",
    backstory="You are a Technical Writer who makes complex systems understandable.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

devops = Agent(
    role="DevOps Engineer",
    goal="Set up CI/CD, manage deployment, ensure system reliability",
    backstory="You are a DevOps Engineer who automates deployments and keeps systems running.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

ai_engineer = Agent(
    role="AI Engineer",
    goal="Design and implement AI features, integrate LLM APIs, build intelligent features",
    backstory="You are an AI Engineer who integrates machine learning and LLM capabilities into applications.",
    verbose=True,
    allow_delegation=True,
    **agent_kwargs,
)

agents = [ceo, pm, project_manager, ba, sa, architect, firebase_architect,
          security_architect, db_architect, ux_researcher, ux_designer,
          frontend_architect, qa, tester, tech_writer, devops, ai_engineer]

print(f"All {len(agents)} agents initialized.\n")

analysis_task = Task(
    description=f"""
    Analyze the following project documents for E-Report SMK Texmaco Subang:

    1. PRD.md (Product Requirements Document):
    {PRD[:5000]}

    2. Wireframe.md:
    {WIREFRAME[:3000]}

    3. Descript.md:
    {DESCRIPT[:3000]}

    4. CLAUDE.md:
    {CLAUDE_MD[:2000]}

    Your task: Thoroughly analyze ALL documents. Identify:
    - Missing requirements
    - Inconsistencies between documents
    - Technical risks
    - Security vulnerabilities
    - Ambiguities that need clarification
    - Gaps in user stories
    - Missing edge cases
    - Performance concerns

    Each agent must contribute from their expertise perspective.
    Be critical. Do NOT accept documents at face value.
    """,
    expected_output="A comprehensive analysis document identifying all issues, gaps, risks, and recommendations.",
    agent=ba,
)

debate_round1 = Task(
    description="""
    ROUND 1 DEBATE:
    
    Each agent must now critique the analysis produced by the BA.
    
    CEO: Evaluate strategic alignment
    PM: Evaluate feature completeness and priority
    Project Manager: Evaluate timeline and resource feasibility
    BA: Present your findings
    SA: Evaluate technical feasibility
    Software Architect: Evaluate architecture decisions
    Firebase Architect: Evaluate Firebase-specific concerns
    Security Architect: Identify all security gaps
    Database Architect: Evaluate data model decisions
    UX Researcher: Evaluate user research needs
    UX Designer: Evaluate UI/UX decisions
    Frontend Architect: Evaluate frontend architecture
    QA Engineer: Evaluate testability
    Tester: Identify edge cases
    Technical Writer: Evaluate documentation needs
    DevOps: Evaluate deployment strategy
    AI Engineer: Evaluate AI feature feasibility
    
    Be critical. Challenge assumptions. Find weaknesses.
    """,
    expected_output="Round 1 debate results with critiques from each agent perspective.",
    agent=ceo,
)

debate_round2 = Task(
    description="""
    ROUND 2 DEBATE:
    
    Based on Round 1 critiques, each agent must respond to criticisms and propose solutions.
    
    Focus on resolving conflicts between:
    - Business needs vs technical constraints
    - Security vs usability
    - Scope vs timeline
    - Quality vs speed
    
    Propose concrete solutions for each identified issue.
    """,
    expected_output="Round 2 debate with proposed solutions for all identified issues.",
    agent=pm,
)

debate_round3 = Task(
    description="""
    ROUND 3 DEBATE - FINAL RESOLUTION:
    
    This is the final debate round. All agents must:
    1. Vote on remaining open issues
    2. Reach consensus on all design decisions
    3. Finalize the revised requirements
    4. Create a clear action plan
    
    CEO: Make final decisions on any unresolved issues
    PM: Confirm final scope and prioritization
    All agents: Confirm their acceptance of the final plan
    """,
    expected_output="Final consensus with voted decisions and a clear action plan.",
    agent=ceo,
)

revision_task = Task(
    description="""
    Based on all three debate rounds, create a FINAL REVISED document that includes:
    
    1. Final functional requirements (all modules A-J)
    2. Final RBAC matrix
    3. Final database design
    4. Final UI/UX decisions
    5. Final security requirements
    6. Final testing strategy
    7. Final deployment plan
    8. Final AI feature plan
    
    This document will be the SINGLE SOURCE OF TRUTH for implementation.
    """,
    expected_output="A comprehensive, finalized requirements document ready for implementation.",
    agent=tech_writer,
)

crew = Crew(
    agents=agents,
    tasks=[analysis_task, debate_round1, debate_round2, debate_round3, revision_task],
    process=Process.sequential,
    verbose=True,
)

print("Starting CrewAI execution...")
print("Phase: ANALYSIS -> DEBATE R1 -> DEBATE R2 -> DEBATE R3 -> REVISION")
print("=" * 80)

result = crew.kickoff()

print("\n" + "=" * 80)
print("CREWAI EXECUTION COMPLETE")
print("=" * 80)
print("\nFinal Output:")
print(result)

output_path = os.path.join(docs_dir, "FINAL_REVISED_REQUIREMENTS.md")
with open(output_path, "w") as f:
    f.write(str(result))

print(f"\nFinal revised requirements saved to: {output_path}")
