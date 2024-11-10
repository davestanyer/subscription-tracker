# Subscription Manager

A modern subscription management system built with Next.js, Supabase, and shadcn/ui.

## Features

- 📊 Track subscription costs and billing cycles
- 💰 Multi-currency support with automatic conversion
- 📅 Calendar view for upcoming payments
- 👥 Client and user management
- 📈 Cost projections and analytics
- 🔄 Automatic logo fetching from domains
- 🌙 Dark/Light mode support

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and update with your Supabase credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Database Setup

1. Create a new Supabase project
2. Run the migrations in `/supabase/migrations` in order
3. Enable Row Level Security (RLS) policies as needed

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Tech Stack

- Next.js
- Supabase
- shadcn/ui
- Tailwind CSS
- TypeScript
- Recharts
- date-fns

## License

MIT
