# ETHOnline 2026 requirements

Research checked at **2026-09-12 23:39:48 UTC / 2026-09-13 08:39:48 JST**. This records public rules, not participant acceptance or completed submission. Dashboard verification remains separate.

## Deadline and event rules

The year-specific [submission guide](https://ethglobal.com/events/ethonline2026/info/details) sets the deadline to **September 13, 2026, 12:00 pm EDT**, equivalent to **September 13, 16:00 UTC / September 14, 01:00 JST**. Late entries are not accepted. The [year-specific start guide](https://ethglobal.com/events/ethonline2026/info/start) independently agrees.

The year-specific submission guide requires:

| Topic | Requirement |
| --- | --- |
| Form | Dashboard submission with title, description, repository link; select partner prizes in the final step, up to three partners. |
| AI | Disclose generated/assisted files and assets. Meaningful human contribution is necessary; entirely AI-produced entries may be ineligible. Include specifications, prompts, and planning artifacts. |
| Video | 2–4 minutes, at least 720p. No sped-up footage, music/text replacing speech, phone recording, TTS, or AI voiceover. |
| Judging | Partner judging is asynchronous. Choosing finalist consideration also requires the applicable live session. |

Source: [ETHOnline 2026 submission guide](https://ethglobal.com/events/ethonline2026/info/details), checked at the time above. Exact authenticated form fields, upload behavior, and judging slot are not verified.

## Start Fresh and participation

The [general event rules](https://ethglobal.com/rules) prohibit pre-event project-specific code, design, and assets in From Scratch. Record reused public dependencies, disclose pre-existing work, and maintain real development history; a single bulk commit can create eligibility problems. QWitness targets Start Fresh, not Continuity. A new folder alone does not establish eligibility.

The [2026 start guide](https://ethglobal.com/events/ethonline2026/info/start) says individual acceptance and staking secure participation, with dashboard notifications for project check-ins. Solo entries are allowed; teams may have up to five people. Acceptance, stake/exemption, required check-ins, project creation, and Start Fresh selection must be checked in the participant dashboard. This document does not authorize fund transfers.

## Target sponsor

**Best AI Tooling or AI Use Case with The Graph (From Scratch)**: $5,000 pool; awards $2,500 / $1,500 / $1,000. [Official 2026 Graph prize page](https://ethglobal.com/events/ethonline2026/prizes/the-graph).

| Qualification | QWitness evidence needed |
| --- | --- |
| The Graph is essential to the tooling or blockchain-data workflow. | Actual adapter/query path and explanation of its use. |
| Live Graph-provider data; mocked/local/static data do not qualify. | Successful real query with deployment, timestamp and safe metadata. |
| Meaningful analysis or reusable AI tooling. | Actual LLM/MCP client run; reusable core/tool instructions. |
| Public code and runnable README or SKILL.md. | Public repository, setup and clean build evidence. |
| Short demo, 2–4 minutes. | Checked video showing the actual workflow. |
| Correct eligibility pool. | Start Fresh entry and development history. |

The separate Continuity award is excluded. The composable/standardized award is not assumed merely because one subgraph is queried. The Substreams one-prompt deployment condition applies to that challenge, which QWitness does not target. Source: [official Graph prize page](https://ethglobal.com/events/ethonline2026/prizes/the-graph), checked at the time above; corroborated by the [2026 prize index](https://ethglobal.com/events/ethonline2026/prizes).

## Source differences and limits

- The [2026 information hub](https://ethglobal.com/events/ethonline2026/info) links to the year-specific start and submission guides used above.
- The [main 2026 event page](https://ethglobal.com/events/ethonline2026) returned an HTTP 500 through the web reader twice. This does not establish that the participant dashboard is unavailable.
- The [non-year-specific ETHOnline guide](https://ethglobal.com/events/ethonline/info/details) has a blank submission-deadline value. It is supplementary, not the deadline authority.
- The [official event listing](https://ethglobal.com/events) shows September 4–16 for the event; this date range does not override the earlier submission deadline.
- [The Graph resource article](https://thegraph.com/blog/hackathon-resources/) was updated September 3, 2026. Its approximate September 13 deadline and shorter AI award title are superseded here by the exact year-specific submission and prize pages.

The user's sixteen hours is an execution budget, not a source for the deadline. At the check time, the public deadline was about 16 hours 20 minutes away. The implementation owner records task start as **2026-09-12 23:38:33 UTC** and the sixteen-hour budget end as **2026-09-13 15:38:33 UTC / September 14 00:38:33 JST**, which is earlier than the public deadline. Reserve the last two hours from **September 13 13:38:33 UTC / 22:38:33 JST** for the user's upload and submission.

The implementation owner additionally reports seeing September 14, 01:00 am in Tokyo time for Project Submissions Due on the main event page in a browser. That page was logged out. This corroborates the public deadline but does not verify authenticated participant status. The initial public repository was created at [dorakingx/qwitness](https://github.com/dorakingx/qwitness), commit `c78e289`; that establishes repository access, not final feature completion.

## Project-specific requirements and pending verification

The following are user requirements from `docs/GOAL.md`, not claims about extra organizer rules: approximately three minutes; 1920×1080, 30 fps, H.264 MP4; the participant's real English narration; manual YouTube upload and final Submit; no automatic microphone recording; at least 70% actual app/tool/verification footage.

Pending: authenticated dashboard status and deadline; registration/acceptance; stake or exception; check-ins; project/track; exact form fields; demo/repository accessibility; live Graph execution; real AI/MCP run; substantive human review; participant audio; video QA; final submission receipt. Update these from evidence, not assumptions.
