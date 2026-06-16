from crewai_tools import BaseTool
from pydantic import BaseModel, Field
from typing import Optional, Type
import subprocess, json, os

class LighthouseInput(BaseModel):
    action: str = Field(description="Action: 'run_lighthouse'")
    url: Optional[str] = Field(default=None)

class LighthouseTool(BaseTool):
    name: str = "Lighthouse CI Scanner"
    description: str = "Run Google Lighthouse audits via CLI (Performance, Accessibility, SEO, Best Practices)."
    args_schema: Type[BaseModel] = LighthouseInput

    def _run(self, action: str, url: str | None = None):
        target = url or os.getenv("E_REPORT_URL", "https://e-report-one.vercel.app")
        has_lh = subprocess.run(["which", "lighthouse"], capture_output=True).returncode == 0
        has_npx = subprocess.run(["which", "npx"], capture_output=True).returncode == 0
        if not has_npx:
            return {"success": False, "error": "npx not found"}
        try:
            result_path = "/tmp/lighthouse-report.json"
            cmd = f"npx lighthouse {target} --output=json --output-path={result_path} --chrome-flags='--headless --no-sandbox' --quiet 2>/dev/null"
            proc = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=120)
            if os.path.exists(result_path):
                with open(result_path) as f:
                    data = json.load(f)
                categories = data.get("categories", {})
                scores = {k: round(v["score"] * 100) for k, v in categories.items()}
                return {"success": True, "data": {"scores": scores, "metrics_preview": str(list(data.get("audits", {}).keys())[:10])}}
            return {"success": True, "data": {"note": "Lighthouse emulator not available. Install: npm i -g lighthouse", "cmd": cmd}}
        except Exception as e:
            return {"success": False, "error": str(e)}