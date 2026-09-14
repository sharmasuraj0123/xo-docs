#!/usr/bin/env python3
"""Serve actual Space assets with fictional APIs, bound only to localhost."""

import argparse
import ast
import hashlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import parse_qs, unquote, urlsplit

import fixtures

UI_ROOT = None
SOURCE_META = {}
QUIRQ_CONTRACTS = []


def read_quirq_contracts(source):
    """Read only literal catalog definitions; never import the live service."""
    class Tiers(ast.NodeTransformer):
        def visit_Name(self, node):
            values = {"_TIER_SYNCED": "synced", "_TIER_RUNTIME": "runtime"}
            return ast.Constant(values[node.id]) if node.id in values else node

    syntax = ast.parse((source / "services/cowork_agent/quirq_catalog.py").read_text())
    definitions = {node.targets[0].id: ast.literal_eval(Tiers().visit(node.value))
                   for node in syntax.body if isinstance(node, ast.Assign)
                   and isinstance(node.targets[0], ast.Name)
                   and node.targets[0].id in ("_PROJECT_OUTPUT_CONTRACT", "_WORKSPACE_OUTPUT_CONTRACT")}
    result = []
    for name, prefixes, count in [
        ("_PROJECT_OUTPUT_CONTRACT", {"synced": "<project>/.xo", "runtime": "<quirq state>/projects/<pid>"}, 10),
        ("_WORKSPACE_OUTPUT_CONTRACT", {"synced": "<XO root>/.xo", "runtime": "<quirq state>/workspace"}, 1),
    ]:
        result.append([{**row, "location": f"{prefixes[row['tier']]}/{row['path']}",
                        "present_count": count, "bytes": 2048, "updated_at": fixtures.stamp(2)}
                       for row in definitions[name]])
    return result


class Handler(SimpleHTTPRequestHandler):
    def json_response(self, data, status=200):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        url = urlsplit(self.path)
        path = unquote(url.path)
        query = parse_qs(url.query)
        route = {
            "/__fixture__/meta": lambda: SOURCE_META,
            "/xo/space.json": fixtures.graph,
            "/xo/dashboard.json": fixtures.dashboard,
            "/api/xo-projects": fixtures.catalog,
            "/api/xo-projects/activity": fixtures.activity,
            "/api/xo-projects/timeline": fixtures.timeline,
            "/api/project-sharing/status": fixtures.sharing,
            "/space/server/status": lambda: {"running": True, "restart_mode": "native", "instance_id": "fictional-space-instance"},
            "/api/inbox": lambda: fixtures.inbox(query.get("status", ["open"])[0], int(query.get("limit", [200])[0])),
            "/api/connections": fixtures.connections,
            "/xo/sessions.json": fixtures.session_telemetry,
            "/space/data/session_prompts.json": fixtures.prompts,
            "/api/secrets": lambda: {"items": []},
            "/api/runtime-config": fixtures.runtime_config,
            "/api/quirq": lambda: fixtures.quirq(*QUIRQ_CONTRACTS),
            "/api/schedules": lambda: {"jobs": fixtures.commands()},
            "/space/update/status": lambda: {"supported": False, "message": "Fictional review server; updates are unavailable."},
            "/xo-auth/session/self": lambda: {"session_id": "fictional-review-session"},
            "/api/connectors/composio/toolkits": fixtures.toolkits,
            "/api/connectors/composio/gmail/tools": fixtures.gmail_tools,
        }.get(path)
        if route:
            self.json_response(route())
            return
        command_match = re.fullmatch(r"/api/schedules/([^/]+)(/runs)?", path)
        if command_match:
            job = next((job for job in fixtures.commands() if job["id"] == command_match[1]), None)
            if job:
                self.json_response({"job_id": job["id"], "runs": [job["last_result"]] if job["last_result"] else [],
                                    "log_path": "/demo/.quirq/scheduler/logs/" + job["id"] + ".log"}
                                   if command_match[2] else job)
                return
        if path.startswith("/api/connections/"):
            toolkit = path.rsplit("/", 1)[-1]
            entry = next((c for c in fixtures.connections()["connections"] if c["toolkit"] == toolkit), None)
            if entry:
                self.json_response(entry)
                return
        match = re.fullmatch(r"/api/xo-projects/([^/]+)/(tree|todos|activity|timeline|file|file-history|commits|members|github/issues)", path)
        if match and match[1] in {p[0] for p in fixtures.PROJECTS}:
            pid, operation = match.groups()
            relative = query.get("relative_path", [""])[0]
            payload = {
                "tree": lambda: fixtures.tree(pid, relative),
                "todos": lambda: fixtures.todos(pid),
                "activity": lambda: fixtures.activity(pid),
                "timeline": lambda: fixtures.timeline(pid),
                "file": lambda: fixtures.file_payload(pid, relative, query.get("commit")),
                "file-history": lambda: {"project_id": pid, "relative_path": relative, "is_repo": True, "items": fixtures.commits(pid)["commits"]},
                "commits": lambda: fixtures.commits(pid),
                "members": lambda: {"own_workspace_id": fixtures.WORKSPACE_ID, "members": [
                    {"workspace_id": fixtures.WORKSPACE_ID, "role": "owner", "status": "active", "bound": True},
                    {"workspace_id": "demo-workspace-summit", "role": "member", "status": "active", "bound": True},
                    {"workspace_id": "demo-workspace-river", "role": "member", "status": "active", "bound": True}]},
                "github/issues": lambda: fixtures.github_issues(pid),
            }[operation]()
            self.json_response(payload)
            return
        if path == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
            return
        if path.startswith("/space/"):
            asset = (UI_ROOT / path.removeprefix("/space/")).resolve()
            if asset == UI_ROOT:
                asset = UI_ROOT / "index.html"
            if asset.is_relative_to(UI_ROOT) and asset.is_file():
                self.path = "/" + asset.relative_to(UI_ROOT).as_posix()
                return super().do_GET()
        self.json_response({"error": f"No fictional fixture for {path}"}, 404)

    def do_POST(self):
        # Account refresh is a read-like lookup in the real API. Unsupported
        # providers return no identity; this fixture never calls a provider.
        match = re.fullmatch(r"/api/connections/(slack|notion)/account", urlsplit(self.path).path)
        if match:
            self.json_response({"toolkit": match[1], "account_label": None,
                                "account_checked_at": fixtures.stamp(), "error": None, "cached": True})
            return
        self.json_response({"error": "The documentation preview does not support writes."}, 405)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=5101)
    parser.add_argument("--source", type=Path, required=True, help="Path to an xo-space checkout (served without modification)")
    args = parser.parse_args()
    UI_ROOT = (args.source / "space_ui").resolve()
    if not (UI_ROOT / "index.html").is_file():
        parser.error("--source must contain space_ui/index.html")
    QUIRQ_CONTRACTS = read_quirq_contracts(args.source)
    revision = subprocess.run(["git", "-C", str(args.source), "rev-parse", "HEAD"],
                              capture_output=True, text=True, check=True).stdout.strip()
    dirty = subprocess.run(["git", "-C", str(args.source), "status", "--porcelain", "--", "space_ui"],
                           capture_output=True, text=True, check=True).stdout.strip()
    asset_hashes = {p.relative_to(UI_ROOT).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
                    for p in sorted(UI_ROOT.rglob("*")) if p.is_file()}
    SOURCE_META = {"repository": "https://github.com/quirq-ai/xo-space", "revision": revision,
                   "assets_modified": bool(dirty), "asset_sha256": asset_hashes,
                   "fixture_data": "All projects, sessions, activity, accounts and paths are fictional.",
                   "fixture_time": fixtures.stamp()}
    handler = lambda *a, **kw: Handler(*a, directory=str(UI_ROOT), **kw)
    with ThreadingHTTPServer(("127.0.0.1", args.port), handler) as server:
        print(f"Fictional Space review workspace: http://127.0.0.1:{args.port}/space/", flush=True)
        server.serve_forever()
