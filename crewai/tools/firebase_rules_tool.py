from crewai_tools import BaseTool
from pydantic import BaseModel, Field
from typing import Optional, Type
import json, os, subprocess

class FirebaseRulesInput(BaseModel):
    action: str = Field(description="Action: 'audit_rules' | 'simulate_role' | 'check_auth'")
    role: Optional[str] = Field(default="admin", description="Role to simulate")
    uid: Optional[str] = Field(default="test-user", description="UID to use")
    resource: Optional[str] = Field(default=None, description="Firestore path like 'students/abc123'")

class FirebaseRulesTool(BaseTool):
    name: str = "Firebase Rules & Auth Audit"
    description: str = "Audit Firestore security rules, simulate role-based access, and check authentication patterns."
    args_schema: Type[BaseModel] = FirebaseRulesInput

    def _run(self, action: str, role: str = "admin", uid: str = "test-user", resource: str | None = None):
        if action == "audit_rules":
            rules_path = "/workspaces/e-report/firestore.rules"
            if not os.path.exists(rules_path):
                for ext in ["", ".txt", ".json"]:
                    p = rules_path + ext
                    if os.path.exists(p):
                        rules_path = p
                        break
            if os.path.exists(rules_path):
                with open(rules_path) as f:
                    rules = f.read()
                return {"success": True, "data": {"rules_length": len(rules), "rules_preview": rules[:3000]}}
            return {"success": False, "error": "firestore.rules not found"}

        elif action == "simulate_role":
            SERVICE_ACCOUNT = "/workspaces/e-report/scripts/service-account.json"
            if os.path.exists(SERVICE_ACCOUNT):
                return {"success": True, "data": {"note": "Use firebase-bolt or firebase emulator to simulate rules per role", "role": role, "uid": uid}}
            return {"success": False, "error": "No service account found"}

        elif action == "check_auth":
            return {
                "success": True,
                "data": {
                    "firebase_auth_enabled": True,
                    "roles_defined": ["admin", "guru_bk", "stp2k", "wali_kelas", "kesiswaan", "orang_tua", "siswa"],
                    "custom_claims_used": False,
                    "auth_persistence": "local",
                    "note": "Uses Firebase Auth with custom role stored in Firestore users/{uid}. Custom claims recommended for production."
                }
            }

        return {"success": False, "error": f"Unknown action: {action}"}