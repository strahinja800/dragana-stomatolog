# AGENTS.md

Instructions for AI agents (Claude Code, Cursor, Copilot) working on this project.

## I. Task Execution

1. **Plan Mode first**: Start every request with a Plan Mode phase. Break down the task into 3-5 concrete steps (Plan, Research, Implement, Validate).
2. **Context before code**: Always check existing project structure, patterns, and tech stack before implementation.
3. **Multi-tool research**: Combine Tavily (industry insights), Context7 (documentation), and next-devtools (Next.js analysis). Never use single-tool research.
4. **Sequential thinking**: Use Sequential-thinking approach for complex problems, debugging, and architecture planning.

## II. Code Quality

1. **TypeScript first**: Always apply robust TypeScript types. Run `tsc --noEmit` before suggesting changes.
2. **Component atomicity**: Decompose large components into smaller, focused sub-components. Group them in a folder with hierarchical naming (e.g., folder `booking-form` contains `booking-form.tsx`, `booking-form-fields.tsx`, `booking-form-submit.tsx`).
3. **Minimalism**: Implement only what is needed. Avoid unused, speculative, placeholder, or commented-out code.
4. **Error handling**: Include error handling, error boundaries, and edge cases.
5. **Import order**: Write usage first, then import (prevents auto-removal of unused imports).

## III. Figma Integration

When importing assets via Figma MCP:

- **Never** retain generated hash/random filenames
- Always rename to descriptive, semantic names (e.g., `hero-bg.png` instead of `vector_12ab.svg`)

## IV. Communication

1. **Tone**: Natural, friendly but professional. Simple, direct language.
2. **Language**: Serbian for UI text and user-facing content. English for code and comments.
3. **Clarity**: Ask clarifying questions if anything is unclear before implementation.

## V. Project Conventions

- Use `@/` path alias for all imports
- Styling with `cn()` utility from `@/lib/utils`
- Forms with `react-hook-form`
- Icons from `lucide-react`
- Images in `assets/`, exported through `data/data.ts`
- Navigation defined in `constants/navigations.ts`
- Feature components go in `module/` organized by domain
