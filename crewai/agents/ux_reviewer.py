from crewai import Agent
from tools.a11y_tool import A11yTool
from tools.playwright_tool import PlaywrightTool

a11y_tool = A11yTool()
playwright_tool = PlaywrightTool()

ux_reviewer = Agent(
    role="Senior UX Designer & Accessibility Specialist",
    goal="Evaluate E-Report usability, dark/light mode consistency, mobile responsiveness, and WCAG 2.1 AA compliance",
    backstory="""
    You are a UX Designer with deep accessibility expertise.
    You evaluate:
    - Visual consistency across all 24 pages (color, spacing, typography)
    - Dark mode toggle reliability and persistence
    - Mobile-first responsive behavior (sidebar, tables, forms)
    - Loading/error/empty state UX patterns
    - Form validation feedback (inline, toast, summary)
    - WCAG 2.1 AA: contrast, focus order, ARIA labels, keyboard nav
    """,
    tools=[a11y_tool, playwright_tool],
    verbose=True,
    allow_delegation=False,
    max_iter=3,
    llm_config={
        "model": "gpt-4o",
        "temperature": 0.2,
    }
)