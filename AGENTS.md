## 🏗️ Design Direction Document: Gantry CLI

### 1. Executive Summary
**Gantry** is a context orchestration and governance CLI for *Harness Engineering*, designed to prepare, guide, and validate AI agent execution, eliminating manual configuration fatigue and "Context Rot."

### 2. User Persona & Journey
* **Persona:** The Pragmatic Software Engineer who uses AI not just as "autocomplete," but as a complex execution agent. They value architecture and maintainability over raw, unguided speed.
* **Core Journey:**
    1.  **Setup:** The user defines the rules of the game (`gantry env` + `gantry skill add`).
    2.  **Intentionality:** The user formalizes the objective (`gantry task`).
    3.  **Assisted Execution:** The AI works within the imposed constraints.
    4.  **Feedback Loop:** The user validates the output (`gantry verify`) and compacts the learnings (`gantry checkpoint`).

### 3. Visual Identity Strategy (Terminal UI)
The visual identity follows a **Modern Minimalist** approach.
* **Color Palette:**
    * **Base:** Scale of Grays (`#2D2D2D` for secondary text, `#E0E0E0` for commands).
    * **Accent (Action Blue):** Vibrant Cobalt Blue for progress indicators, filenames, and active states. Blue conveys trust, technical authority, and clarity.
    * **Status:** Emerald Green (Success), Ochre Yellow (Warning), and Carmine Red (Contract Violation).
* **Typography:** Focus on Monospaced fonts with ligature support (e.g., Fira Code or JetBrains Mono).

### 4. Mood & Tone
* **Feeling:** Security and Control. The user should feel that the AI is "locked" onto a safe track.
* **Voice:** Narrative and Technical. Instead of dry logs, the CLI describes its actions:
    * *“Gantry is weaving the React-Architecture-Guard into your sensors...”*
    * *“Contract violation detected: The agent strayed from the Service Layer pattern.”*

### 5. Design System Foundations (CLI UX)
* **Output Layout:**
    * **Headers:** Use of subtle characters (e.g., `─── Task: Auth Flow ───`) in Blue.
    * **Verbosity:** Detailed logs are indented to create visual hierarchy, allowing the user to scan processes easily.
    * **Markdown Strategy:** The `contract plan` is generated in pure Markdown, utilizing Checkboxes (`- [ ]`) so the AI can mark progress and the user can review it as a technical To-Do list.
* **Icons/Symbols:** Use of simple Unicode symbols for high compatibility:
    * `◈` (Gantry/Core)
    * `◌` (Pending)
    * `●` (Completed)
    * `↳` (Sub-task/Dependency)