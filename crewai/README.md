# CrewAI — E-Report SMK Texmaco Testing & Debate

## Structure

```
crewai/
├── agents/                   # 7 agent definitions
│   ├── qa_lead.py
│   ├── security_auditor.py
│   ├── perf_engineer.py
│   ├── ux_reviewer.py
│   ├── product_owner.py
│   ├── tech_lead.py
│   └── end_user.py
├── tasks/                    # Task YAML manifests
│   ├── testing_tasks.yaml    # 11 regression scenarios
│   ├── security_tasks.yaml   # 6 security scenarios
│   ├── perf_tasks.yaml       # 4 performance scenarios
│   ├── ux_tasks.yaml         # 6 UX scenarios
│   └── debate_topics.yaml    # 7 debate topics w/ positions
├── tools/                    # Custom tools
│   ├── playwright_tool.py    # Browser automation
│   ├── firebase_rules_tool.py
│   ├── lighthouse_tool.py
│   ├── bundle_analyzer_tool.py
│   └── a11y_tool.py
├── flows/
│   ├── test_flow.py          # Sequential QA pipeline
│   └── debate_flow.py        # Moderated debate pipeline
├── output/                   # Results
├── main.py                   # CLI entry point
└── requirements.txt
```

## Usage

```bash
# Simulated run (tests YAML parsing + flow):
python3 crewai/main.py test

# Simulated debate:
python3 crewai/main.py debate

# All + final report:
python3 crewai/main.py all

# Generate report from saved results:
python3 crewai/main.py report
```

## Agents (7)

| Agent | Fokus |
|-------|-------|
| QA Lead | E2E regression, RBAC testing |
| Security Auditor | Firestore rules, XSS, IDOR, auth |
| Perf Engineer | Lighthouse, bundle, query cost |
| UX Reviewer | WCAG a11y, dark mode, mobile |
| Product Owner | Business logic, requirements |
| Tech Lead | Code quality, architecture |
| End User Simulator | 5 persona scenarios |
