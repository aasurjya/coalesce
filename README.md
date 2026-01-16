# COALESCE - College Event Website

A production-ready college event website with registration, manual UPI payment verification, and digital entry pass generation.

![COALESCE](https://img.shields.io/badge/COALESCE-2026-gold)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## Features

- ✨ **Awards-focused Design** - Elegant gold theme with GSAP animations
- 📝 **Online Registration** - Multi-step registration form
- 💳 **Manual UPI Payment** - No payment gateway required
- 🎫 **Digital Entry Pass** - PDF tickets with QR codes
- 📧 **Email Notifications** - Automated confirmation emails
- 👑 **Admin Dashboard** - Manage registrations, verify payments, mark attendance
- 📱 **Mobile-First** - Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS 4
- **Animations**: GSAP
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (screenshots, tickets)
- **Email**: Resend (or any SMTP provider)
- **PDF Generation**: jsPDF
- **QR Codes**: qrcode library

## Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd coalesce
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema below in the SQL Editor
3. Create storage buckets: `screenshots` and `tickets` (set to public)

### 3. Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=COALESCE <noreply@yourdomain.com>
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  roll_college TEXT NOT NULL,
  utr TEXT NOT NULL UNIQUE,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  ticket_url TEXT,
  checked_in BOOLEAN NOT NULL DEFAULT FALSE
);

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin sessions table
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Policies (adjust as needed)
CREATE POLICY "Allow insert for all" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for service role" ON registrations FOR SELECT USING (true);
CREATE POLICY "Allow update for service role" ON registrations FOR UPDATE USING (true);
```

### Create Admin User

Run this SQL to create an admin user (replace with your email and a bcrypt hash of your password):

```sql
-- Generate password hash: Use https://bcrypt-generator.com/ with 12 rounds
-- Example for password "admin123" (DO NOT USE IN PRODUCTION)
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@coalesce.event', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.UFG1l1C/FMQq6W');
```

### Storage Buckets

Create these buckets in Supabase Storage:

1. **screenshots** - For payment screenshots
   - Set to public
   
2. **tickets** - For generated PDF tickets
   - Set to public

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── register/           # Registration endpoint
│   │   └── admin/
│   │       ├── login/          # Admin login
│   │       ├── logout/         # Admin logout
│   │       ├── auth/           # Auth check
│   │       ├── registrations/  # Get all registrations
│   │       ├── verify/[id]/    # Verify payment
│   │       ├── reject/[id]/    # Reject registration
│   │       └── checkin/[id]/   # Check-in attendee
│   ├── admin/                  # Admin dashboard
│   ├── register/               # Registration page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── About.tsx               # About section
│   ├── Committee.tsx           # Committee members
│   ├── Footer.tsx              # Footer
│   ├── Hero.tsx                # Hero section
│   ├── Highlights.tsx          # Event highlights
│   ├── Navigation.tsx          # Navigation bar
│   ├── Particles.tsx           # Background particles
│   └── RegistrationForm.tsx    # Multi-step form
└── lib/
    ├── constants.ts            # Event configuration
    ├── email.ts                # Email templates
    ├── generate-ticket.ts      # PDF generation
    ├── supabase.ts             # Supabase client
    └── types.ts                # TypeScript types
```

## Configuration

Edit `src/lib/constants.ts` to customize:

- Event name, date, time, location
- Registration fee
- UPI ID and QR code
- Committee members
- Event highlights

## UPI Payment Setup

1. Generate a UPI QR code for your UPI ID
2. Save it as `public/upi-qr.png`
3. Update `EVENT_INFO.upi_id` in `src/lib/constants.ts`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

```bash
npm run build
```

## Admin Dashboard

Access at `/admin`

Features:
- View all registrations
- Filter by status (pending/verified/rejected)
- Search by name, email, or UTR
- Verify payments → generates ticket & sends email
- Reject invalid payments
- Mark attendance (check-in)
- Export to CSV

## Security Notes

- ❌ No payment gateway = No GST/KYC required
- ✅ Manual verification ensures payment accuracy
- ✅ Admin routes protected by session auth
- ✅ HTTPS enforced in production
- ✅ Service role key kept server-side only

## License

MIT License - Built for educational purposes by students.

---

**COALESCE 2026** - Where Excellence Converges ✨
