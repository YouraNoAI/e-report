from crewai import Flow
from crewai.flow import start, listen

class DebateFlow(Flow):
    """Moderated debate flow: Product Owner chairs 7 debates, each followed by resolution"""

    description = "Multi-agent structured debate on 7 key E-Report architecture decisions"

    @start()
    def open_debate(self):
        self.state["decisions"] = []
        return "Opening debate session. Chair: Product Owner"

    @listen(open_debate)
    def debate_data_architecture(self):
        return self._hold_debate("DEB-01", "Data Architecture: Mock vs Real Firestore")

    @listen(debate_data_architecture)
    def debate_rbac(self):
        return self._hold_debate("DEB-02", "RBAC Granularity")

    @listen(debate_rbac)
    def debate_whatsapp(self):
        return self._hold_debate("DEB-03", "WhatsApp Integration")

    @listen(debate_whatsapp)
    def debate_ai(self):
        return self._hold_debate("DEB-04", "AI Features via OpenRouter")

    @listen(debate_ai)
    def debate_offline(self):
        return self._hold_debate("DEB-05", "Offline Strategy")

    @listen(debate_offline)
    def debate_export(self):
        return self._hold_debate("DEB-06", "Export & Reporting")

    @listen(debate_export)
    def debate_cicd(self):
        return self._hold_debate("DEB-07", "CI/CD Pipeline")

    @listen(debate_cicd)
    def close_debate(self):
        return f"Debate concluded. {len(self.state['decisions'])} decisions documented."

    def _hold_debate(self, topic_id: str, title: str):
        self.state["decisions"].append({"topic_id": topic_id, "title": title, "status": "debated"})
        return f"'{title}' debated. Resolution documented."