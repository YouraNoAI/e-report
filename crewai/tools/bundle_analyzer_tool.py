from crewai_tools import BaseTool
from pydantic import BaseModel, Field
from typing import Optional, Type
import subprocess, json, os

class BundleInput(BaseModel):
    action: str = Field(description="Action: 'analyze_bundle' | 'check_chunks'")

class BundleAnalyzerTool(BaseTool):
    name: str = "Bundle Analyzer"
    description: str = "Analyze Vite production bundle chunk sizes, code splitting, and lazy loading effectiveness."
    args_schema: Type[BaseModel] = BundleInput

    def _run(self, action: str):
        dist = "/workspaces/e-report/dist/assets"
        if not os.path.exists(dist):
            return {"success": False, "error": "Run `npm run build` first"}
        files = []
        for f in os.listdir(dist):
            path = os.path.join(dist, f)
            size = os.path.getsize(path)
            files.append({"file": f, "size_kb": round(size / 1024, 2)})
        files.sort(key=lambda x: x["size_kb"], reverse=True)
        total = round(sum(f["size_kb"] for f in files), 2)
        return {"success": True, "data": {"files": files, "total_kb": total, "count": len(files)}}