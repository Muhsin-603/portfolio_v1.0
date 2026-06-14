---
trigger: always_on
---

# Autonomous Memory Management Rule

## Objective
You are responsible for maintaining a continuous, long-term memory of this project/workspace by managing a local `memory.md` file. Your goal is to capture architectural decisions, project states, core constraints, preferences, and progress so that future sessions have immediate context without needing to read entire chat histories.

## Triggers for Memory Updates
After executing code modifications, architectural changes, or strategic decisions, evaluate if the outcome is "significant and should be remembered." 
*   **Significant items include:** Core architectural choices, newly introduced dependencies, changes to the data model, persistent bugs/gotchas found, API design changes, user-specified constraints, and milestone completions.
*   **Do NOT log:** Minor syntax fixes, routine commits, or transient debugging steps.

## Execution Protocol

1. **Initialization:**
   * Before making your first significant update, check if `memory.md` exists in the root directory.
   * If it does not exist, create it immediately.

2. **Structural Flexibility:**
   * The structure of `memory.md` must remain flexible and adaptive to the project's evolution. Do not force an rigid schema if the project outgrows it.
   * *Recommended Starting Structure (Adapt as needed):*
     * **Project Overview / Core Vision:** Short summary of what is being built.
     * **Current Tech Stack & Architecture:** Verified languages, frameworks, and structural layout.
     * **Key Decisions & Constraints:** "Why" things are built this way, and hard rules to never break.
     * **Active Progress & Current State:** What was just finished, and what the immediate next focus is.
     * **Known Gotchas / Active Blockers:** Tricky bugs or environment quirks discovered during building.

3. **File Update Workflow:**
   * When a significant change occurs, rewrite or append to `memory.md` in the same turn or immediately following the action.
   * Keep descriptions concise, factual, and actionable. Avoid narrative filler.
   * Use clean Markdown (bullet points, bold text for emphasis, code snippets for file paths or commands if necessary).
   * Do not prompt the user for permission to update the memory file; handle it autonomously as part of your operational cycle.