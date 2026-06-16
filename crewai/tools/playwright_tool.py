from crewai_tools import BaseTool
from pydantic import BaseModel, Field
from typing import Optional, Type
import subprocess, json, os, time

BASE_URL = os.getenv("E_REPORT_URL", "https://e-report-one.vercel.app")

class PlaywrightInput(BaseModel):
    action: str = Field(description="Action: 'navigate' | 'click' | 'type' | 'screenshot' | 'assert_text' | 'assert_url' | 'get_text' | 'run_e2e'")
    url: Optional[str] = Field(default=None, description="URL to navigate to")
    selector: Optional[str] = Field(default=None, description="CSS selector to interact with")
    text: Optional[str] = Field(default=None, description="Text to type or assert")
    role: Optional[str] = Field(default=None, description="Login role: admin|guru_bk|stp2k|wali_kelas|kesiswaan|orang_tua|siswa")
    timeout: Optional[int] = Field(default=10000)

class PlaywrightTool(BaseTool):
    name: str = "Playwright Browser Automation"
    description: str = "Interact with the E-Report web app via Playwright. Supports navigation, clicking, typing, screenshots, assertions, and E2E test suites."
    args_schema: Type[BaseModel] = PlaywrightInput

    def _run(self, action: str, url: str | None = None, selector: str | None = None, text: str | None = None, role: str | None = None, timeout: int = 10000):
        script = f"""
import asyncio, json, os
from playwright.async_api import async_playwright

BASE_URL = os.getenv("E_REPORT_URL", "https://e-report-one.vercel.app")

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={{'width': 1280, 'height': 720}})
        page = await context.new_page()
        result = {{'success': False, 'data': None, 'error': None}}
        try:
            action = {json.dumps(action)}
            url_param = {json.dumps(url)}
            sel = {json.dumps(selector)}
            txt = {json.dumps(text)}
            role_param = {json.dumps(role)}

            if action == 'navigate':
                await page.goto(url_param or BASE_URL, wait_until='networkidle', timeout={timeout})
                result = {{'success': True, 'data': {{'url': page.url, 'title': await page.title()}}}}

            elif action == 'click':
                await page.wait_for_selector(sel, timeout={timeout})
                await page.click(sel)
                await page.wait_for_timeout(500)
                result = {{'success': True, 'data': {{'url': page.url}}}}

            elif action == 'type':
                await page.wait_for_selector(sel, timeout={timeout})
                await page.fill(sel, txt or '')
                result = {{'success': True, 'data': {{'filled': True}}}}

            elif action == 'screenshot':
                await page.wait_for_timeout(1000)
                path = '/workspaces/e-report/crewai/output/screenshots/' + (txt or 'screenshot') + '.png'
                os.makedirs(os.path.dirname(path), exist_ok=True)
                await page.screenshot(path=path, full_page=True)
                result = {{'success': True, 'data': {{'path': path}}}}

            elif action == 'assert_text':
                content = await page.content()
                result = {{'success': txt in content, 'data': {{'found': txt in content, 'text_len': len(content)}}}}

            elif action == 'assert_url':
                result = {{'success': url_param in page.url, 'data': {{'current_url': page.url, 'expected': url_param}}}}

            elif action == 'get_text':
                if sel:
                    el = await page.wait_for_selector(sel, timeout={timeout})
                    result = {{'success': True, 'data': {{'text': await el.inner_text()}}}}
                else:
                    result = {{'success': True, 'data': {{'text': await page.content()[:5000]}}}}

            elif action == 'run_e2e':
                scenarios = []
                # Violation flow
                await page.goto(f"{{BASE_URL}}/violations", wait_until='networkidle')
                scenarios.append({{'page': 'violations', 'status': 'ok' if 'Pelanggaran' in await page.title() else 'fail'}})
                # Coaching flow
                await page.goto(f"{{BASE_URL}}/coaching", wait_until='networkidle')
                scenarios.append({{'page': 'coaching', 'status': 'ok' if 'Pembinaan' in await page.content() else 'fail'}})
                # Cases flow
                await page.goto(f"{{BASE_URL}}/cases", wait_until='networkidle')
                scenarios.append({{'page': 'cases', 'status': 'ok' if 'Kasus' in await page.content() else 'fail'}})
                # Letters flow
                await page.goto(f"{{BASE_URL}}/letters", wait_until='networkidle')
                scenarios.append({{'page': 'letters', 'status': 'ok' if 'Surat' in await page.content() else 'fail'}})
                # Reports
                await page.goto(f"{{BASE_URL}}/reports", wait_until='networkidle')
                scenarios.append({{'page': 'reports', 'status': 'ok' if 'Laporan' in await page.content() else 'fail'}})
                # Students
                await page.goto(f"{{BASE_URL}}/students", wait_until='networkidle')
                scenarios.append({{'page': 'students', 'status': 'ok' if 'Siswa' in await page.content() else 'fail'}})
                result = {{'success': True, 'data': {{'scenarios': scenarios}}}}

        except Exception as e:
            result = {{'success': False, 'error': str(e)}}
        finally:
            await browser.close()
        print(json.dumps(result))

asyncio.run(run())
"""
        os.makedirs("/workspaces/e-report/crewai/output/screenshots", exist_ok=True)
        env = os.environ.copy()
        env["E_REPORT_URL"] = BASE_URL
        proc = subprocess.run(["python3", "-c", script], capture_output=True, text=True, env=env, timeout=60)
        try:
            return json.loads(proc.stdout.strip())
        except json.JSONDecodeError:
            return {"success": False, "error": proc.stderr or proc.stdout}