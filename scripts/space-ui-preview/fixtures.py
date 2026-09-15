"""Synthetic, deterministic API payloads for reviewing the real Space UI.

All projects, people, paths and activity below are fictional. This module
never imports the application, reads a workspace, or connects to a service.
Shapes follow categorized_graph.py, space_index.py and the project BFFs.
"""

from datetime import datetime, timedelta, timezone
import math
import json

NOW = datetime(2026, 9, 14, 10, tzinfo=timezone.utc)
WORKSPACE = "/demo/xo-projects"
WORKSPACE_ID = "demo-workspace-aurora"
CATEGORIES = {
    "engineering": {"name": "Engineering", "color": "#6fb7e0"},
    "ops": {"name": "Ops", "color": "#e8a15c"},
    "documentation": {"name": "Documentation", "color": "#c792ea"},
    "research": {"name": "Research", "color": "#7fd0a8"},
    "marketing": {"name": "Marketing", "color": "#e0708a"},
}
PROJECTS = [
    ("aurora-console", "Aurora Console", "A calm control room for releases, services, and customer signals.", "engineering", "disc", "App"),
    ("orbit-api", "Orbit API", "Typed service contracts and a reliable event delivery pipeline.", "engineering", "disc", "App"),
    ("field-notes", "Field Notes", "An offline notebook for teams working beyond the office.", "engineering", "disc", "App"),
    ("harbor-infra", "Harbor Infrastructure", "Repeatable environments, deployment recipes, and recovery plans.", "ops", "diamond", "Unknown"),
    ("signal-watch", "Signal Watch", "Useful alerts and runbooks for the systems people depend on.", "ops", "disc", "App"),
    ("atlas-handbook", "Atlas Handbook", "The team's working agreements, onboarding guide, and decisions.", "documentation", "stack", "Docs"),
    ("developer-guide", "Developer Guide", "Practical examples that turn a first API call into a shipped feature.", "documentation", "stack", "Docs"),
    ("retrieval-lab", "Retrieval Lab", "Small, reproducible studies of search quality and citation accuracy.", "research", "diamond", "Unknown"),
    ("latency-study", "Latency Study", "Measure where requests wait and test the changes that help.", "research", "ring", "One-pager"),
    ("launch-studio", "Launch Studio", "Product stories, release notes, and the next launch presentation.", "marketing", "slab", "Slides"),
]


def stamp(minutes=0):
    return (NOW - timedelta(minutes=minutes)).isoformat().replace("+00:00", "Z")


def catalog():
    return {"items": [
        {"id": pid, "display_name": name, "description": description,
         "path": f"{WORKSPACE}/{pid}", "created_at": stamp(1440 * (65 - i * 4)),
         "unscaffolded": False}
        for i, (pid, name, description, *_rest) in enumerate(PROJECTS)
    ]}


def paths_for(project):
    kind = project[3]
    common = ["README.md", "PLAN.md", "AGENTS.md"]
    content = {
        "engineering": ["src/main.ts", "src/client.ts", "src/config.ts", "tests/client.test.ts", "docs/architecture.md", "package.json"],
        "ops": ["infra/main.tf", "infra/variables.tf", "runbooks/deploy.md", "runbooks/recovery.md", "scripts/check.sh"],
        "documentation": ["guides/getting-started.md", "guides/conventions.md", "decisions/001-layout.md", "reference/api.md", "reference/glossary.md"],
        "research": ["notebooks/baseline.ipynb", "notebooks/evaluation.ipynb", "notes/method.md", "notes/findings.md", "results/summary.csv"],
        "marketing": ["slides/launch.pptx", "copy/announcement.md", "copy/release-notes.md", "brand/palette.svg", "briefs/audience.md"],
    }
    return common + content[kind]


def graph():
    hubs, groups, leaves, ties = [], [], [], []
    categories, history = {}, {}
    for i, project in enumerate(PROJECTS):
        pid, name, description, purpose, *_ = project
        cat = "p_" + pid
        categories[cat] = {"name": name, "color": CATEGORIES[purpose]["color"]}
        hubs.append({"id": cat, "cat": cat, "label": name, "blurb": description})
        folders = dict.fromkeys(path.split("/")[0] if "/" in path else "root" for path in paths_for(project))
        for folder in folders:
            groups.append({"id": f"g_{pid}_{folder}", "cat": cat,
                           "label": pid if folder == "root" else folder, "blurb": f"{name} / {folder}"})
        for j, path in enumerate(paths_for(project)):
            folder = path.split("/")[0] if "/" in path else "root"
            ext = path.rsplit(".", 1)[-1]
            shape = "ring" if ext == "md" else "disc" if ext in ("ts", "sh") else "diamond"
            leaves.append({"id": f"f_{pid}_{j}", "group": f"g_{pid}_{folder}", "shape": shape,
                           "tag": "Document" if ext == "md" else "Code" if shape == "disc" else "File",
                           "label": path.rsplit("/", 1)[-1], "date": f"2026-09-{2 + (i + j) % 12:02}",
                           "blurb": f"{name}: {path}", "path": f"{pid}/{path}"})
        ties.append({"s": f"f_{pid}_0", "t": f"f_{pid}_1", "label": "references"})
        history[cat] = [{"d": f"2026-09-{d:02}", "n": 1 + (d + i) % 5,
                         "s": ["Clarify the next milestone", "Improve the project guide"]} for d in (3, 7, 10, 13)]
    return {"meta": {"title": "XO Space", "tagline": "A fictional review workspace",
                     "mappedOn": "14 September 2026", "generated_at": stamp(), "workspace": WORKSPACE,
                     "hubLabel": "Project", "rootEdgeLabel": "a project in this workspace"},
            "categories": categories,
            "hubAngles": {cat: -math.pi / 2 + i * math.tau / len(categories) for i, cat in enumerate(categories)},
            "timeline": {"start": "2026-09-01", "end": "2026-09-15"},
            "root": {"id": "xo", "label": "XO", "blurb": "Ten fictional projects for reviewing Space UI"},
            "hubs": hubs, "groups": groups, "leaves": leaves, "ties": ties,
            "milestones": [{"d": "2026-09-03", "t": "First workspace milestone"}], "gitHistory": history}


def dashboard():
    leaves = [{"id": pid, "group": f"g_{cat}", "shape": shape, "tag": tag,
               "label": name, "date": "2026-09-13", "blurb": description,
               "path": pid, "clusters": [cat], "xotype": "output"}
              for pid, name, description, cat, shape, tag in PROJECTS]
    return {"meta": {"title": "Dashboard", "tagline": "projects gathered into purpose environments",
                     "mappedOn": "14 September 2026", "generated_at": stamp(), "workspace": WORKSPACE,
                     "noun": "projects", "collectionLabel": "environments", "hubLabel": "Environment",
                     "rootEdgeLabel": "an environment of this workspace", "enclose": True,
                     "tieSpring": {"d": 80, "k": 0.07},
                     "shapeLegend": [{"shape": s, "label": label} for s, label in
                                     [("disc", "App"), ("ring", "One-pager"), ("stack", "Docs"), ("slab", "Slides"), ("diamond", "Unknown")]],
                     "typeLegend": [{"id": "output", "label": "Output"}, {"id": "inbox", "label": "Inbox"},
                                    {"id": "session", "label": "Sessions", "weight": "dim"}, {"id": "system", "label": "System", "weight": "dim"}]},
            "categories": CATEGORIES,
            "hubAngles": {cat: -math.pi / 2 + i * math.tau / len(CATEGORIES) for i, cat in enumerate(CATEGORIES)},
            "timeline": {"start": "2026-09-01", "end": "2026-09-20"},
            "root": {"id": "environments-root", "label": "Environments", "blurb": "10 projects across 5 environments"},
            "hubs": [{"id": cat, "cat": cat, "label": value["name"], "blurb": f"{sum(p[3] == cat for p in PROJECTS)} projects"}
                     for cat, value in CATEGORIES.items()],
            "groups": [{"id": "g_" + cat, "cat": cat, "label": value["name"], "blurb": "Related projects"}
                       for cat, value in CATEGORIES.items()],
            "leaves": leaves, "ties": [], "milestones": []}


def activity(pid=None):
    sessions = [{"session_id": f"demo-session-{i}", "project_id": project[0], "agent": "workspace",
                 "runtime": "local", "opened_at": stamp(90 + i * 20), "last_activity_at": stamp(4 + i * 3)}
                for i, project in enumerate(PROJECTS[:3])]
    return {"open_sessions": [s for s in sessions if not pid or s["project_id"] == pid]}


def timeline(pid=None):
    return {"events": [{"id": f"demo-event-{i}", "project_id": p[0], "ts": stamp(12 + i * 67),
                        "type": "file.edited", "runtime": "local", "path": "README.md"}
                       for i, p in enumerate(PROJECTS) if not pid or p[0] == pid]}


def todos(pid):
    return {"project_id": pid, "updated_at": stamp(12), "sessions": {"demo-session": {"runtime": "local", "todos": [
        {"id": "t1", "content": "Finish the next milestone and document the review", "status": "in_progress"},
        {"id": "t2", "content": "Check keyboard navigation and narrow layouts", "status": "pending"},
        {"id": "t3", "content": "Agree on acceptance criteria", "status": "completed"},
    ]}}}


def tree(pid, relative_path):
    project = next(p for p in PROJECTS if p[0] == pid)
    prefix = relative_path.rstrip("/") + "/" if relative_path else ""
    dirs, files = {}, []
    for path in paths_for(project):
        if not path.startswith(prefix):
            continue
        tail = path[len(prefix):]
        if "/" in tail:
            folder = tail.split("/", 1)[0]
            dirs[folder] = dirs.get(folder, 0) + 1
        else:
            files.append({"name": tail, "relative_path": path, "size_bytes": 1024 + 47 * len(path), "modified_at": stamp(16)})
    return {"project_id": pid, "relative_path": relative_path,
            "parent_relative_path": relative_path.rpartition("/")[0],
            "dirs": [{"name": name, "relative_path": prefix + name, "entries": count} for name, count in dirs.items()], "files": files}


def file_payload(pid, path, commit=None):
    name = next(p[1] for p in PROJECTS if p[0] == pid)
    if path == ".xo/project.json":
        content = json.dumps({"pid": f"demo-project-{pid}", "owner_user_id": "demo-user-alex",
                              "git": {"remote_url": f"https://github.com/fictional-workspace/{pid}.git", "default_branch": "main"}})
        return {"project_id": pid, "relative_path": path, "name": "project.json", "kind": "text",
                "content": content, "size_bytes": len(content.encode()), "modified_at": stamp(16), "truncated": False}
    content = f"# {name}\n\nA fictional workspace project used for reviewing Space UI.\n\n## This week's focus\n\n- Make the important work easy to find.\n- Keep context when moving between project views.\n- Document decisions alongside the work.\n\n## Review checklist\n\nUse **Projects → Data** to browse files in List, Graph or Tree. Explore dated work in **Timeline** and project access in **Manage**.\n\nOpen a file once, then move between views without losing your place.\n"
    if commit:
        content = f"# {name}\n\nAn earlier version of this fictional project brief.\n\n## First milestone\n\nAgree on a clear scope and record the first design decisions.\n"
    return {"project_id": pid, "relative_path": path, "name": path.rsplit("/", 1)[-1],
            "kind": "markdown", "content": content, "size_bytes": len(content.encode()), "modified_at": stamp(16), "truncated": False}


def commits(pid):
    return {"project_id": pid, "branch": "main", "source": "origin/main", "behind": 2 if pid == "aurora-console" else 0,
            "path": f"{WORKSPACE}/{pid}", "commits": [
                {"hash": "a1b2c3d" + "0" * 33, "short_hash": "a1b2c3d", "subject": "Clarify the project review checklist", "author": "Alex Example", "date": stamp(35), "path": "README.md"},
                {"hash": "d4e5f6a" + "0" * 33, "short_hash": "d4e5f6a", "subject": "Record the first milestone", "author": "Sam Example", "date": stamp(180), "path": "README.md"}]}


def sharing():
    return {"cadence": "active", "last_poll_ok": True, "last_poll_at": stamp(1), "watch_branch": "main",
            "own_workspace_id": WORKSPACE_ID, "projects_root": WORKSPACE, "recent": [],
            "repos": {f"github.com/fictional-workspace/{pid}":
                      {"project": pid, "shared": True, "available": True, "members": 3,
                       "last_fetch_at": stamp(1), "last_error": None, "clone": None, "auto_cloned_at": None}
                      for pid in ("aurora-console", "atlas-handbook", "retrieval-lab")}}


# Expanded documentation fixtures. No values are read from a real account.
def session_telemetry():
    sources = [("claude_code", "Claude Code", "claude-sonnet-4"),
               ("codex", "Codex", "gpt-5.5"), ("cursor", "Cursor", "claude-sonnet-4")]
    sessions, daily_sessions, daily_models, daily_tools = [], [], [], []
    for i in range(18):
        agent, label, model = sources[i % 3]
        project = PROJECTS[i % len(PROJECTS)]
        started = stamp(70 + (i // 3) * 1440 + (i % 3) * 80)
        tokens = 32000 + (i * 19037) % 96000
        cost_known = agent == "claude_code"
        cost = round(tokens * .000004, 2) if cost_known else 0.0
        key = f"{agent}:demo-session-{i + 1:02}"
        sessions.append({"id": f"demo-session-{i + 1:02}", "key": key, "agent": agent,
                         "source": agent, "agent_version": "example", "project": project[1],
                         "project_path": f"{WORKSPACE}/{project[0]}", "model": model,
                         "started_at": started, "ended_at": stamp(25 + (i // 3) * 1440 + (i % 3) * 80),
                         "tokens": tokens, "total_tokens": tokens, "own_tokens": tokens,
                         "fresh": int(tokens * .28), "output": int(tokens * .12),
                         "cache_write": int(tokens * .1), "cache_read": int(tokens * .5),
                         "cost": cost, "cost_known": cost_known, "breakdown_known": True,
                         "turns": 9 + i % 12, "duration_sec": 2700,
                         "tools": [{"name": "Read", "calls": 14 + i, "errors": 0},
                                   {"name": "Edit", "calls": 6 + i % 5, "errors": 0},
                                   {"name": "Bash", "calls": 8 + i % 4, "errors": 0}],
                         "subagents": []})
        daily_sessions.append({"day": started[:10], "agent": agent,
                               "session_id": f"demo-session-{i + 1:02}", "session_key": key,
                               "tokens": tokens, "cost": cost, "cost_known": cost_known})
    for days_ago in range(70):
        day = (NOW - timedelta(days=days_ago)).date().isoformat()
        if days_ago % 7 in (5, 6):
            continue
        for i, (agent, _, model) in enumerate(sources):
            tokens = 62000 + (days_ago * 4703 + i * 17621) % 84000
            daily_models.append({"day": day, "agent": agent, "model": model,
                                 "tokens": tokens, "cost": round(tokens * .000004, 2) if agent == "claude_code" else 0.0,
                                 "cost_known": agent == "claude_code"})
            for j, name in enumerate(("Read", "Edit", "Bash")):
                daily_tools.append({"day": day, "agent": agent, "name": name,
                                    "calls": 18 + (days_ago + i + j) % 30, "errors": 0})
    return {"meta": {"generated_at": stamp(), "pricing_version": "illustrative",
                     "sources": [{"id": agent, "label": label, "available": True,
                                  "cost_status": "estimated" if agent == "claude_code" else "unavailable"}
                                 for agent, label, _ in sources]},
            "totals": {"sessions": len(sessions), "tokens": sum(s["tokens"] for s in sessions),
                       "cost_usd": sum(s["cost"] for s in sessions), "projects": len(PROJECTS),
                       "sessions_by_agent": {agent: 6 for agent, _, _ in sources},
                       "tokens_by_agent": {agent: sum(s["tokens"] for s in sessions if s["agent"] == agent) for agent, _, _ in sources},
                       "cost_by_agent": {agent: sum(s["cost"] for s in sessions if s["agent"] == agent) for agent, _, _ in sources}, "cost_complete": False},
            "sessions": sessions, "daily_sessions": daily_sessions,
            "daily_models": daily_models, "daily_tools": daily_tools}


def prompts():
    return {"supported": True, "total_prompts": 3, "capped": False, "prompts": [
        {"turn": 1, "timestamp": stamp(70), "responses": 2, "tool_uses": 8,
         "text": "Review Aurora Console's release overview. Make the next action clear and keep the service status easy to scan.", "truncated": False},
        {"turn": 2, "timestamp": stamp(55), "responses": 1, "tool_uses": 5,
         "text": "Add a keyboard path through the release cards, then check the narrow layout.", "truncated": False},
        {"turn": 3, "timestamp": stamp(35), "responses": 1, "tool_uses": 4,
         "text": "Record what changed in the project guide and run the focused checks.", "truncated": False},
    ]}


TOOLKITS = [("gmail", "Gmail", True, True), ("googlecalendar", "Google Calendar", True, True),
            ("notion", "Notion", True, False),
            ("googlesheets", "Google Sheets", False, False), ("googledocs", "Google Docs", False, False),
            ("googleslides", "Google Slides", False, False), ("googlemeet", "Google Meet", False, False),
            ("figma", "Figma", False, False), ("slack", "Slack", True, True),
            ("telegram", "Telegram", False, False)]


def toolkits():
    return {"toolkits": [{"id": tid, "slug": tid.upper(), "display_name": name,
                          "status": "ACTIVE" if connected else "NEEDS_AUTH",
                          "workspace_enabled": enabled, "account_count": 1 if connected else 0,
                          "schemes": ["API_KEY" if tid == "telegram" else "OAUTH2"], "supports_action_prefs": True}
                         for tid, name, connected, enabled in TOOLKITS]}


def connections():
    catalogs = {
        "gmail": [("unread", "Unread mail", True), ("inbox", "Recent inbox mail", False)],
        "googlecalendar": [("upcoming", "Upcoming events", True)],
        "slack": [("recent", "Recent messages", True)],
        "notion": [("recent_pages", "Recently edited pages", True)],
        "telegram": [("updates", "New messages", True)],
    }
    return {"signed_in": True, "poller_enabled": True, "connections": [
        {"toolkit": tid, "display_name": name, "configured": enabled, "enabled": enabled,
         "connected_here": enabled, "interval_s": 900, "collectors": [catalogs[tid][0][0]] if tid in catalogs else [],
         "available_collectors": [{"id": cid, "label": label, "default": default} for cid, label, default in catalogs.get(tid, [])],
         "last_poll_at": stamp(3) if enabled else None, "last_ok_at": stamp(3) if enabled else None,
         "last_error": None, "events_total": 24 if enabled else 0,
         "account_label": "alex@example.com" if tid in ("gmail", "googlecalendar") else None,
         "account_checked_at": stamp(3) if connected else None}
        for tid, name, connected, enabled in TOOLKITS]}


INBOX_ROWS = [
    ("todo.blocked", "Waiting for release checklist approval", "aurora-console", "todos", "new",
     "The release candidate is ready. Confirm the accessibility review and approve the checklist before deployment."),
    ("gmail.unread", "Design review notes are ready", "aurora-console", "connections", "new",
     "Alex Example shared the review notes. The keyboard path is clear; the narrow layout needs one final pass."),
    ("session.started", "Session started in Retrieval Lab", "retrieval-lab", "timeline", "new",
     "A new workspace session is evaluating the citation accuracy baseline."),
    ("issue.open", "Issue #42: improve retry visibility", "orbit-api", "issues", "seen",
     "Show the next delivery attempt and the latest response together so operators can understand a delayed event."),
    ("slack.recent", "Release review starts at 14:00", "aurora-console", "connections", "new",
     "The team will walk through the release overview, open questions, and the rollback plan."),
    ("sharing.fetched", "New commits fetched for Atlas Handbook", "atlas-handbook", "sharing", "seen",
     "Two documentation updates are available. Open Sharing to review the commits before applying them."),
    ("todo.added", "Document the retrieval evaluation method", "retrieval-lab", "timeline", "seen",
     "Capture the dataset assumptions, scoring rules, and reproducibility notes alongside the experiment."),
    ("todo.completed", "First milestone acceptance criteria agreed", "field-notes", "todos", "done",
     "The team agreed on the offline workflow and completed the initial review."),
]


def inbox(status="open", limit=200):
    items = [{"id": f"{i + 1:08x}", "ts": stamp(7 + i * 23), "source": source,
              "kind": kind, "title": title, "body": body, "project_id": pid, "status": state,
              "link": {"view": "projects", "project": pid}, "url": None}
             for i, (kind, title, pid, source, state, body) in enumerate(INBOX_ROWS)]
    counts = {state: sum(item["status"] == state for item in items) for state in ("new", "seen", "done")}
    visible = [item for item in items if status == "all" or item["status"] == status
               or status == "open" and item["status"] != "done"]
    return {"items": visible[:limit], "counts": counts, "total": len(visible)}


def runtime_config():
    def path(host, container):
        return {"host_path": host, "container_path": container, "exists": True, "readable": True, "writable": True}
    applied = {"agent_name": "claude_code", "watcher_enabled": True,
               "watcher_source_mode": "all", "watcher_interval_seconds": 1}
    roots = {"xo_projects_root": WORKSPACE, "quirq_state_root": "/demo/.quirq"}
    return {"configured": applied, "applied": applied, "restart_required": False,
            "restart_supported": True, "restart_mode": "native", "restart_reasons": [],
            "roots": {"configured": roots, "applied": roots, "change_required": False},
            "paths": {"projects": path(WORKSPACE, "/workspace/xo-projects"),
                      "state": path("/demo/.quirq", "/state/.quirq"),
                      "ai_workspace": path("/demo", "/workspace")},
            "network": {"public_url": "http://localhost:5002/space/", "listen_port": 5002},
            "usage_reporting": {"status": "off"},
            "agents": [{"name": agent, "active": i == 0, "watched": i < 2,
                        "home": path(f"/demo/.{folder}", f"/state/{folder}") if i < 2 else
                        {"host_path": f"/demo/.{folder}", "container_path": f"/state/{folder}", "exists": False, "readable": False, "writable": False},
                        "binary_available": i < 2, "bootstrap_available": False,
                        "session_files": [18, 12, 0, 0, 0][i], "secrets": [],
                        "install_url": "https://docs.openclaw.ai/install" if agent == "openclaw" else None}
                       for i, (agent, folder) in enumerate([("claude_code", "claude"), ("codex", "codex"),
                                                          ("openclaw", "openclaw"), ("hermes", "hermes"), ("antigravity", "antigravity")])]}


def setup_identity():
    return {"space": {"status": "configured", "id": WORKSPACE_ID, "label": "Aurora workspace", "owner": "Alex Example"},
            "xo": {"status": "connected", "user_id": "demo-user-alex"},
            "github": {"status": "connected", "username": "alex-example", "source": "connector"}}


def telemetry_sources():
    return {"items": [{"id": agent, "label": label, "enabled": True,
                       "vendor": {"claude_code": "anthropic", "codex": "openai", "cursor": "cursor"}[agent],
                       "cost_status": "estimated" if agent == "claude_code" else "unavailable",
                       "path": {"editable": True, "env": env, "label": "Argus database" if agent == "claude_code" else label + " home",
                                "configured": "", "default": folder, "effective": folder, "resolved": folder}}
                      for agent, label, env, folder in [
                          ("claude_code", "Claude Code", "ARGUS_DB", "/demo/.argus/argus.db"),
                          ("codex", "Codex", "CODEX_HOME", "/demo/.codex"),
                          ("cursor", "Cursor", "CURSOR_HOME", "/demo/.cursor")]]}


def native_connector(toolkit):
    return {"github": {"status": "connected", "username": "alex-example"},
            "magicpath": {"logged_in": False, "cli_installed": True, "skill_installed": True},
            "vercel": {"status": "needs_auth"},
            "gdrive": {"remotes": [{"name": "demo-drive", "complete": True}]},
            "onedrive": {"remotes": []}}[toolkit]


def github_issues(pid):
    return {"project_id": pid, "state": "ok", "repo": f"fictional-workspace/{pid}",
            "tracked": 1, "fetched_at": stamp(20), "issues": [
                {"number": 42, "title": "Make keyboard focus clear in the release overview", "state": "open",
                 "labels": ["accessibility"], "assignees": [], "url": "https://example.com/issues/42",
                 "updated_at": stamp(35), "adopted": True, "in_progress": True},
                {"number": 39, "title": "Document the release checklist", "state": "open",
                 "labels": ["documentation"], "assignees": [], "url": "https://example.com/issues/39",
                 "updated_at": stamp(90), "adopted": False, "in_progress": False},
            ]}


def quirq(project_contract, workspace_contract):
    paths = [
        ("projects/offsets.json", "Read offsets for native session logs", 2450),
        ("cache/heartbeat.json", "Watcher process heartbeat", 260),
        ("cache/activity/workspace.json", "Current live workspace activity", 1350),
        ("cache/activity/projects/aurora-console.json", "Aurora Console session presence", 490),
        ("cache/graph.json", "Derived file graph", 24500),
        ("cache/dashboard.json", "Derived project environment map", 7300),
        ("cache/sessions.json", "Aggregated session telemetry", 51000),
        ("inbox/inbox.json", "Local incoming events and read status", 3900),
        ("scheduler/jobs.json", "Saved manual commands and optional intervals", 1250),
        ("scheduler/state.json", "Command execution state and last result", 820),
        ("scheduler/runs/checkout-status.jsonl", "Retained command results and output tails", 940),
        ("scheduler/logs/checkout-status.log", "Appended command output", 1120),
    ]
    return {"root": {"host_path": "/demo/.quirq", "container_path": "/state/.quirq", "readable": True, "writable": True},
            "totals": {"files": len(paths), "bytes": sum(p[2] for p in paths), "directories": 5, "truncated": False},
            "watcher": {"enabled": True, "alive": True, "interval_seconds": 1, "source_mode": "all",
                        "last_tick_at": stamp(), "tick_count": 9240, "tracked_files": 38, "offsets_present": True},
            "activity": {"workspace_open_sessions": 3, "projects": [
                {"project_id": p[0], "open_sessions": 1, "runtimes": ["local"], "updated_at": stamp()}
                for p in PROJECTS[:3]]},
            "runtime": runtime_config()["applied"], "credentials": [], "install_state": {"onboarding_completed": True},
            "project_outputs": {"project_count": 10, "root": {"host_path": WORKSPACE}, "legacy_activity_files": 0,
                                "project_contract": project_contract, "workspace_contract": workspace_contract},
            "tree": [{"path": path, "name": path, "kind": "file", "depth": 0, "description": purpose,
                      "size_bytes": size, "modified_at": stamp(2), "sensitive": False} for path, purpose, size in paths]}


def commands():
    """Read-only examples; nothing is executed or registered by the preview."""
    rows = [
        ("checkout-status", "Check checkout status", "Inspect local edits before a release.",
         ["git", "status", "--short"], None, "ok", 0, " M README.md\n M src/app.py\n"),
        ("smoke-check", "Run smoke checks", "Validate the service before sharing an update.",
         ["python3", "scripts/smoke.py"], None, "failed", 1, "2 checks passed; API readiness check failed.\n"),
        ("graph-health", "Check graph health", "Check the generated workspace views every hour.",
         ["python3", "scripts/check_views.py"], 3600, None, None, ""),
    ]
    return [{"id": job_id, "name": name, "description": description,
             "command": {"argv": argv, "cwd": "/demo/xo-space", "timeout": 30},
             "every_seconds": interval, "enabled": True, "project_id": None,
             "created_at": stamp(120), "updated_at": stamp(60), "next_run": None,
             "running": False, "running_since": None, "last_run": stamp(5) if status else None,
             "last_result": {"started_at": stamp(5), "finished_at": stamp(5), "trigger": "manual",
                             "status": status, "returncode": code, "duration_seconds": 0.24,
                             "output_tail": output} if status else None}
            for job_id, name, description, argv, interval, status, code, output in rows]


def gmail_tools():
    # A representative subset of current Gmail actions and real classifications.
    return {"tools": [
        {"slug": slug, "name": name, "description": "Fictional preview action metadata.",
         "parameters": {}, "enabled": enabled, "category": category}
        for slug, name, category, enabled in [
            ("GMAIL_FETCH_EMAILS", "Fetch emails", "read", True),
            ("GMAIL_GET_PROFILE", "Get profile", "read", True),
            ("GMAIL_GET_ATTACHMENT", "Get attachment", "read", True),
            ("GMAIL_CREATE_EMAIL_DRAFT", "Create email draft", "write", True),
            ("GMAIL_SEND_EMAIL", "Send email", "write", False),
        ]]}
