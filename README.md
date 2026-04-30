# VoteGuide AI

VoteGuide AI is an award-winning, intelligent election process assistant built to guide citizens through the 2026 elections with confidence.

## Features
- **AI-Powered Q&A**: Real-time conversational agent powered by Google Gemini 1.5 Flash with Search Grounding to provide accurate, up-to-date election data.
- **Interactive Election Journey**: Visual vertical timeline helping users track their progress through Registration, Verification, and Polling.
- **Eligibility Checker**: Dynamic multi-step form to assess voter eligibility instantly.
- **Global Search**: Command-K interface for blazing fast access to the FAQ Knowledge Base.
- **Multilingual Support**: Switch seamlessly between English and Hindi.
- **Premium UI**: Matte Black and Dark Orange aesthetic, utilizing Framer Motion for buttery smooth haptic animations and ShadCN-inspired components.

## Tech Stack
- Next.js 14 (App Router)
- React & TypeScript
- Tailwind CSS & Framer Motion
- Google Generative AI SDK (Gemini 1.5 Flash)
- Supabase (PostgreSQL & Auth)
- Radix UI & Lucide Icons

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Setup environment variables in `.env.local`:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server: `npm run dev`

## Database Schema (Supabase)

Run the following SQL commands in your Supabase SQL Editor to set up the necessary tables:

```sql
-- Chat History Table
CREATE TABLE chat_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  role text CHECK (role IN ('user', 'model')) NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Eligibility Checks Table
CREATE TABLE eligibility_checks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  age integer,
  is_citizen boolean,
  state text,
  result text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE eligibility_checks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  age integer,
  is_citizen boolean,
  state text,
  result text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```
