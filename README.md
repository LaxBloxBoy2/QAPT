# QAPT Property Management Platform

A comprehensive SaaS platform for property management built with Next.js 14, TypeScript, Tailwind CSS, ShadCN UI, and Supabase.

## Features

- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, ShadCN UI
- **Authentication**: Supabase Auth with role-based access control
- **Database**: Supabase PostgreSQL with Row-Level Security
- **Responsive Design**: Mobile-friendly layout with collapsible sidebar
- **Dark/Light Theme**: Theme toggle with localStorage persistence
- **Organization Management**: Switch between multiple organizations
- **Protected Routes**: Middleware for authentication and authorization

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/LaxBloxBoy2/QAPT.git
cd QAPT
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://wowmsuvnokexqyuksweh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvd21zdXZub2tleHF5dWtzd2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MjgwMDksImV4cCI6MjA2MjUwNDAwOX0.k64s1Gk57Cy5QzshqQ4a1obFEIslfH4ayTzxSiKI61k
```

4. Set up the Supabase database schema:

- Go to the Supabase dashboard for your project
- Navigate to the SQL Editor
- Copy the contents of `supabase/schema.sql` and run it

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

The application uses the following tables:

- **organizations**: Property management companies
- **properties**: Buildings or complexes managed by organizations
- **units**: Individual rental units within properties
- **tenants**: People renting units
- **leases**: Contracts between tenants and units
- **user_organizations**: Many-to-many relationship between users and organizations with roles

## Row-Level Security

The application implements Row-Level Security (RLS) policies in Supabase to ensure users can only access data from their organizations:

- Users can only view organizations they belong to
- Users can only view properties, units, tenants, and leases in their organizations
- Only admins can create new organizations
- Only admins and managers can create/update properties

## Authentication Flow

1. Users sign up or sign in through the `/auth` routes
2. Upon successful authentication, users are redirected to the dashboard
3. Users can only access data from organizations they belong to
4. Users can switch between organizations using the organization switcher

## Project Structure

- `/app`: Next.js App Router pages and layouts
- `/components`: Reusable UI components
- `/lib`: Utility functions, hooks, and services
- `/public`: Static assets
- `/supabase`: Database schema and migrations
