export interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  roll_college: string;
  utr: string;
  screenshot_url?: string | null;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  verified_at?: string | null;
  ticket_url?: string | null;
  checked_in: boolean;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  photo_url?: string;
  order: number;
}

export interface EventInfo {
  name: string;
  tagline: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  fee: number;
  upi_id: string;
  upi_qr_url: string;
  description: string;
  hosted_by: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
}

export type RegistrationStatus = 'pending' | 'verified' | 'rejected';
