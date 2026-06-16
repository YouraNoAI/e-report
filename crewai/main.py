#!/usr/bin/env python3
"""
E-Report SMK Texmaco — CrewAI Testing & Debate Suite

Usage:
    python crewai/main.py test       # Run all testing phases
    python crewai/main.py debate     # Run all debate topics
    python crewai/main.py all        # Run test then debate
    python crewai/main.py report     # Generate final summary
"""

import sys, os, json, yaml
from datetime import datetime
from pathlib import Path

sys.path.insert(0, os.path.dirname(__file__))

OUTPUT_DIR = Path(__file__).parent / "output"
SCREENSHOT_DIR = OUTPUT_DIR / "screenshots"
REPORT_FILE = OUTPUT_DIR / "final_report.json"

def load_tasks(path: str) -> list:
    with open(path) as f:
        data = yaml.safe_load(f)
    return data.get("scenarios", [])

def run_phase(name: str, task_file: str, agent_name: str):
    print(f"\n{'='*60}")
    print(f"  PHASE: {name}")
    print(f"  Agent: {agent_name}")
    print(f"  Tasks: {task_file}")
    print(f"{'='*60}")
    scenarios = load_tasks(task_file)
    results = []
    for s in scenarios:
        sid = s.get("id", "???")
        sname = s.get("name", "???")
        print(f"  [{sid}] {sname}... ", end="", flush=True)
        results.append({
            "id": sid,
            "name": sname,
            "status": "simulated",
            "agent": agent_name,
            "timestamp": datetime.now().isoformat(),
        })
        print("SIMULATED")
    return results

def run_test():
    print("\n>>> E-REPORT CREWAI TEST SUITE <<<\n")
    all_results = []

    all_results += run_phase("Automated Regression Testing", "tasks/testing_tasks.yaml", "qa_lead")
    all_results += run_phase("Security Deep-Dive", "tasks/security_tasks.yaml", "security_auditor")
    all_results += run_phase("Performance & Cost Analysis", "tasks/perf_tasks.yaml", "perf_engineer")
    all_results += run_phase("UX & Accessibility Review", "tasks/ux_tasks.yaml", "ux_reviewer")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    report = {
        "type": "test",
        "timestamp": datetime.now().isoformat(),
        "total": len(all_results),
        "results": all_results,
    }
    with open(OUTPUT_DIR / "test_results.json", "w") as f:
        json.dump(report, f, indent=2)

    print(f"\n>>> Test results saved: {OUTPUT_DIR / 'test_results.json'}")
    return report

def run_debate():
    print("\n>>> E-REPORT CREWAI DEBATE SESSION <<<\n")
    with open("tasks/debate_topics.yaml") as f:
        topics = yaml.safe_load(f)["debate_topics"]

    decisions = []
    for topic in topics:
        tid = topic["id"]
        title = topic["title"]
        print(f"\n{'─'*50}")
        print(f"  DEBATE: [{tid}] {title}")
        print(f"{'─'*50}")
        for pos in topic["positions"]:
            print(f"    {pos['role']}: {pos['stance'][:80]}...")
        print(f"    Goal: {topic['resolution_goal'][:80]}...")
        decisions.append({
            "topic_id": tid,
            "title": title,
            "status": "debated",
            "resolution_goal": topic["resolution_goal"],
            "timestamp": datetime.now().isoformat(),
        })

    report = {
        "type": "debate",
        "timestamp": datetime.now().isoformat(),
        "total_topics": len(topics),
        "decisions": decisions,
    }
    with open(OUTPUT_DIR / "debate_results.json", "w") as f:
        json.dump(report, f, indent=2)

    print(f"\n>>> Debate results saved: {OUTPUT_DIR / 'debate_results.json'}")
    return report

def generate_report():
    test_file = OUTPUT_DIR / "test_results.json"
    debate_file = OUTPUT_DIR / "debate_results.json"

    test_data = {}
    debate_data = {}

    if test_file.exists():
        with open(test_file) as f:
            test_data = json.load(f)
    if debate_file.exists():
        with open(debate_file) as f:
            debate_data = json.load(f)

    report = {
        "report_title": "E-Report SMK Texmaco — CrewAI Final Assessment",
        "generated_at": datetime.now().isoformat(),
        "test_results": test_data,
        "debate_results": debate_data,
        "summary": {
            "total_tests": len(test_data.get("results", [])),
            "total_debates": len(debate_data.get("decisions", [])),
        }
    }

    with open(REPORT_FILE, "w") as f:
        json.dump(report, f, indent=2)

    print(f"\n>>> FINAL REPORT: {REPORT_FILE}")
    print(f"    Tests: {report['summary']['total_tests']} scenarios")
    print(f"    Debates: {report['summary']['total_debates']} topics")
    print(f"\n    Status: SIMULATED (requires Playwright + CrewAI to run live)")

if __name__ == "__main__":
    os.chdir(os.path.dirname(__file__))
    cmd = sys.argv[1] if len(sys.argv) > 1 else "report"

    if cmd == "test":
        run_test()
    elif cmd == "debate":
        run_debate()
    elif cmd == "all":
        run_test()
        run_debate()
        generate_report()
    elif cmd == "report":
        generate_report()
    else:
        print(f"Usage: python {sys.argv[0]} [test|debate|all|report]")