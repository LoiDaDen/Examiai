# Examinai

Examinai is an AI-powered IELTS practice platform for Writing, Speaking, Reading, Listening, and IELTS knowledge chat.

## Features

- **IELTS Chat Assistant**: answers IELTS questions using app prompts and seeded IELTS knowledge.
- **Writing Practice**: timed Writing Task 1/2 flow, image upload for Task 1, essay assessment, corrections, improved versions, and band-style feedback.
- **Speaking Practice**: IELTS Speaking Parts 1/2/3 with AI examiner flow, speech-to-text, text-to-speech, and feedback.
- **Reading Practice**: passage-based IELTS Reading questions, timer, free-text answers, single-choice and multi-answer multiple choice, scoring, and AI feedback.
- **Listening Practice**: audio-based IELTS Listening sections, timer, free-text completion answers, transcript hidden until submit, answer review, transcript highlighting, and AI feedback.
- **Admin Exam Management**: admin form for adding Writing, Speaking, Reading, and Listening content. Reading and Listening support PDF import.
- **Role-based Access**: normal users can use the app; only admin users can access exam management.
- **i18n**: English and Vietnamese UI.

## Tech Stack

- **Framework**: Next.js 16 App Router, React 19, TypeScript
- **AI**: Vercel AI SDK, Fireworks AI models through OpenAI-compatible API
- **Speech**: browser speech synthesis fallback and Deepgram TTS route
- **Database/Auth**: Supabase PostgreSQL/Auth, Drizzle ORM
- **UI**: Tailwind CSS 4, Base UI, shadcn-style components, lucide icons, Lottie animations

## Requirements

- Node.js 20+
- pnpm
- Supabase project
- Fireworks AI API key
- Optional: Deepgram API key for TTS
- For PDF import on the server: `pdftotext`


## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
DATABASE_URL=
FIREWORKS_AI_API_KEY=
DEEPGRAM_API_KEY=
ADMIN_EMAILS=
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are used by the browser.
- `SUPABASE_SECRET_KEY` and `DATABASE_URL` are server-side only.
- `FIREWORKS_AI_API_KEY` can contain one key or multiple comma-separated keys.
- `DEEPGRAM_API_KEY` is only needed for the TTS API route.
- `ADMIN_EMAILS` is optional fallback admin access. The main admin check uses `profiles.role = 'admin'`.

Do not commit `.env.local`.


## Local Development

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

Useful commands:

```bash
pnpm run build
pnpm run start
pnpm run lint
pnpm exec tsc --noEmit --pretty false
```

## PDF Import

PDF import is available for:

- Reading
- Listening

PDF import is intentionally not available for Writing and Speaking in the current UI.

The server extracts PDF text with `pdftotext`, then uses AI to structure the content for the admin form. Some known PDFs also have deterministic fallback parsing.

