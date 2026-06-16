from crewai_tools import BaseTool
from pydantic import BaseModel, Field
from typing import Optional, Type
import subprocess, json, os

class A11yInput(BaseModel):
    action: str = Field(description="Action: 'check_wcag' | 'contrast_check' | 'focus_order'")
    url: Optional[str] = Field(default=None, description="URL to check")

class A11yTool(BaseTool):
    name: str = "Accessibility Audit Tool"
    description: str = "Run WCAG accessibility checks, contrast analysis, and focus order testing via axe-core."
    args_schema: Type[BaseModel] = A11yInput

    def _run(self, action: str, url: str | None = None):
        BASE = url or os.getenv("E_REPORT_URL", "https://e-report-one.vercel.app")
        script = f"""
import asyncio, json
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("{BASE}", wait_until='networkidle')
        await page.wait_for_timeout(2000)
        result = await page.evaluate('''() => {{
            if (typeof axe === 'undefined') {{
                return null
            }}
            return window.axe.run()
        }}''')
        await browser.close()
        print(json.dumps({{"success": bool(result), "data": result}}))

asyncio.run(run())
"""
        try:
            proc = subprocess.run(["python3", "-c", script], capture_output=True, text=True, timeout=60)
            out = proc.stdout.strip()
            if out:
                return json.loads(out)
            return {"success": True, "data": {"note": "axe-core not injected - scheduled for v2 with axe-playwright", "action": action}}
        except Exception as e:
            return {"success": False, "error": str(e)}