# Grechelle — Portfolio

A premium, editorial-style developer portfolio built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — design tokens in `tailwind.config.ts`
- **Framer Motion** — subtle, restrained motion only
- **Geist Sans / Geist Mono** — via the `geist` package
- **Lucide React** — icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  layout.tsx           # Root layout, metadata, fonts, persistent chrome
  page.tsx             # Assembles all sections
  globals.css          # Design tokens, base styles, focus states
  sitemap.ts / robots.ts
  api/chat/route.ts            # Chatbot endpoint (streaming)
  api/chat/analytics/route.ts  # Anonymous analytics snapshot
components/
  Navbar.tsx          # Sticky nav, active-section highlighting, mobile drawer
  CommandMenu.tsx      # ⌘K command palette (signature interaction)
  Hero.tsx / About.tsx / AboutComposition.tsx
  TechStack.tsx / Projects.tsx / ProjectCard.tsx
  Experience.tsx / Contact.tsx / Footer.tsx
  ScrollProgress.tsx
  Chatbot/
    ChatWidget.tsx      # Floating widget shell (button + panel)
    ChatBubble.tsx / TypingIndicator.tsx / SuggestedChips.tsx
lib/
  data.ts               # Single source of truth for all site content
  useActiveSection.ts   # IntersectionObserver hook for nav highlighting
  chatbot/
    types.ts            # Shared types (ChatMessage, Intent, ChatProvider, …)
    system-prompt.ts     # Grechelle's identity, tone, and hard boundaries
    intent.ts            # Deterministic intent classification
    retrieval.ts          # Scoped JSON context retrieval per intent
    memory.ts             # Conversation history trimming
    cache.ts               # Response cache for repeat questions
    rateLimit.ts            # In-memory per-IP rate limiting
    security.ts              # Input validation + prompt-injection guard
    language.ts               # Lightweight language hint for analytics
    analytics.ts                # Anonymous aggregate tracking
    useChat.ts                   # Client hook: streaming fetch + state
    providers/
      index.ts                    # Provider factory (env-driven)
      openai-compatible.ts          # OpenAI & DeepSeek (shared, SSE parsing)
      anthropic.ts                   # Claude adapter
      gemini.ts                       # Gemini adapter
data/
  profile.json / projects.json / experience.json / skills.json
  faq.json / education.json / contact.json
```

## Editing content

All copy — name, tagline, tech stack, projects, experience, and contact
links — lives in `lib/data.ts`. Update that file and every section re-renders
automatically; no other files need to change for a content update.

## AI chatbot ("Chat with Grechelle")

A floating chat widget (bottom-right, ⌘K-adjacent but always visible) lets
visitors talk to an AI that answers **in character as Grechelle** — first
person, grounded only in the JSON files in `/data`, never fabricating
experience.

### Setup

```bash
cp .env.example .env.local
# then fill in AI_PROVIDER, AI_MODEL, and the matching API key
```

By default it uses `AI_PROVIDER=openai` with `AI_MODEL=gpt-5-nano`. To swap
models or vendors, change those two env vars only — no code changes:

| Provider | `AI_PROVIDER` | Example `AI_MODEL` |
|---|---|---|
| OpenAI | `openai` | `gpt-5-nano`, `gpt-5-mini`, `gpt-5` |
| Anthropic | `anthropic` | `claude-haiku-4-5-20251001` |
| Google | `gemini` | `gemini-flash-latest` |
| DeepSeek | `deepseek` | `deepseek-chat` |

### How it minimizes API cost

Requests flow through several free, deterministic layers before ever
touching an LLM (`app/api/chat/route.ts`):

1. **Rate limiting & input validation** (`lib/chatbot/rateLimit.ts`,
   `security.ts`) — rejects abuse and prompt-injection attempts for $0.
2. **Intent detection** (`lib/chatbot/intent.ts`) — a keyword/regex
   classifier (word-boundary matching, not naive substring, so "your"
   doesn't false-match "yo") that sorts messages into FAQ, project,
   tech-stack, off-topic, etc.
3. **Static FAQ** (`data/faq.json`) — common questions (email, GitHub,
   LinkedIn, resume, location, greetings) are answered directly from JSON,
   no AI call at all.
4. **Off-topic refusal** — trivia, homework, unrelated coding help, etc. are
   refused deterministically before reaching the model.
5. **Response cache** (`lib/chatbot/cache.ts`) — identical repeat questions
   return the previous LLM answer instead of calling the model again.
6. **Scoped retrieval** (`lib/chatbot/retrieval.ts`) — only the JSON slice
   relevant to the detected intent is sent as context (e.g. asking about the
   ERP project sends just that one project object, not all five).
7. **Trimmed memory** (`lib/chatbot/memory.ts`) — only the last few
   exchanges are sent, each capped in length.

Only genuinely open-ended, in-scope questions reach the model, with a small
system prompt (`lib/chatbot/system-prompt.ts`) plus a minimal context block —
and the response streams back token-by-token.

### Data & grounding

Everything the bot can say about Grechelle lives in `/data/*.json`
(`profile`, `projects`, `experience`, `skills`, `faq`, `education`,
`contact`). `education.json` is intentionally empty with a note, since no
education details were provided — the bot is instructed to say so rather
than invent a degree. Add real data there and it becomes available
immediately, no prompt changes needed.

### Security & analytics

- Prompt-injection patterns ("ignore previous instructions," "reveal your
  system prompt," "act as ChatGPT," etc.) are caught by both a regex
  pre-filter and the system prompt itself.
- `lib/chatbot/rateLimit.ts` is in-memory and per-instance — fine for a
  single deployment; swap for Upstash/Vercel KV behind the same function
  signature for multi-region.
- `lib/chatbot/analytics.ts` tracks only aggregate, anonymous counts (intent
  distribution, language distribution, project clicks, fallback rate,
  average response time) — no message content or visitor identifiers.
  View a snapshot at `GET /api/chat/analytics`.

## Theming — colors & light/dark mode

Every color in the site — background, text, borders, and the accent — comes
from CSS variables defined in one place: the `:root` and `.light` blocks at
the top of `app/globals.css`. Nothing else needs to change.

### Changing the accent color

Edit two lines in `app/globals.css`:

```css
--accent: 219 39 119;       /* pink-600 — the base accent */
--accent-hover: 236 72 153; /* pink-500 — hover/active state */
```

Values are `R G B` triplets (no commas, no `rgb()` wrapper) so Tailwind can
apply opacity modifiers like `bg-accent/15`. Pick any color the same way —
e.g. for blue: `--accent: 37 99 235;` / `--accent-hover: 59 130 246;`. Every
button, link, active nav indicator, and small decoration across the site —
including the chat widget — updates automatically.

### Light / dark mode

- Dark is the default theme. Toggling adds a `.light` class to `<html>`,
  which swaps the CSS variables in `app/globals.css` to the light-theme
  values — no `dark:` utility classes scattered through components.
- The toggle lives in the navbar (desktop and mobile) and in the ⌘K command
  menu ("Switch to light/dark mode"). Both read from `lib/theme.tsx`, a
  small shared context, so they never fall out of sync.
- The visitor's choice is saved to `localStorage` and respected on return
  visits; first-time visitors get their OS-level preference
  (`prefers-color-scheme`). A tiny inline script in `app/layout.tsx` applies
  the right class before first paint, so there's no flash of the wrong theme.
- To retune either theme's palette (not just the accent) — e.g. make dark
  mode a touch warmer, or light mode off-white instead of pure white — edit
  the `--bg`, `--surface`, `--fg`, etc. values in the corresponding `:root`
  or `.light` block.

## Design notes

- A single accent color (pink, `#DB2777` by default — see Theming above)
  reserved for links, buttons, active states, and small decorations, on top
  of a neutral zinc palette that adapts between dark and light mode.
- Motion is intentionally restrained: fades, slides, and a spring-based
  active-nav indicator. `prefers-reduced-motion` is respected globally.
- The command menu (⌘K) is the signature interaction — a fast, keyboard-first
  way to jump to any section, project, contact link, or theme toggle, in
  keeping with the Raycast/Linear-inspired direction of the brief.
