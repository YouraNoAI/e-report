from crewai import Flow
from crewai.flow import start, listen
import yaml, os

class TestFlow(Flow):
    """Sequential testing flow: QA -> Security -> Performance -> UX"""

    description = "Execute all testing phases in sequence"

    @start()
    def phase1_regression(self):
        self.state["phase1_result"] = None
        self.state["phase2_result"] = None
        self.state["phase3_result"] = None
        self.state["phase4_result"] = None
        return "Starting Phase 1: Automated Regression Testing"

    @listen(phase1_regression)
    def phase2_security(self):
        return "Starting Phase 2: Security Deep-Dive"

    @listen(phase2_security)
    def phase3_performance(self):
        return "Starting Phase 3: Performance & Cost Analysis"

    @listen(phase3_performance)
    def phase4_ux(self):
        return "Starting Phase 4: UX & Accessibility Review"

    @listen(phase4_ux)
    def generate_report(self):
        return "All phases complete. Generating consolidated report..."