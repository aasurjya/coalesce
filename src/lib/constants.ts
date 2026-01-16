import { EventInfo, CommitteeMember } from './types';

export const EVENT_INFO: EventInfo = {
  name: 'COALESCE',
  tagline: 'Where Excellence Converges',
  date: 'March 15, 2026',
  time: '10:00 AM - 8:00 PM',
  location: 'Grand Auditorium, Main Campus',
  venue: 'University Convention Center',
  fee: 299,
  upi_id: 'coalesce@upi',
  upi_qr_url: '/upi-qr.png',
  description: 'Experience the pinnacle of collegiate excellence at COALESCE 2026. A grand celebration of talent, innovation, and achievement bringing together the brightest minds for an unforgettable day of competitions, performances, and networking.',
};

export const COMMITTEE_MEMBERS: CommitteeMember[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    role: 'Festival Chairperson',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80\u0026w=2574\u0026auto=format\u0026fit=crop',
    order: 1,
  },
  {
    id: '2',
    name: 'Priya Patel',
    role: 'Vice Chairperson',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80\u0026w=2574\u0026auto=format\u0026fit=crop',
    order: 2,
  },
  {
    id: '3',
    name: 'Rahul Verma',
    role: 'Technical Head',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80\u0026w=2574\u0026auto=format\u0026fit=crop',
    order: 3,
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    role: 'Creative Director',
    photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80\u0026w=2574\u0026auto=format\u0026fit=crop',
    order: 4,
  },
  {
    id: '5',
    name: 'Amit Kumar',
    role: 'Finance Head',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80\u0026w=2574\u0026auto=format\u0026fit=crop',
    order: 5,
  },
  {
    id: '6',
    name: 'Kavya Singh',
    role: 'Marketing Lead',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80\u0026w=2574\u0026auto=format\u0026fit=crop',
    order: 6,
  },
  {
    id: '7',
    name: 'Rohan Gupta',
    role: 'Logistics Coordinator',
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80\u0026w=2574\u0026auto=format\u0026fit=crop',
    order: 7,
  },
  {
    id: '8',
    name: 'Ananya Iyer',
    role: 'PR \u0026 Communications',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80\u0026w=2574\u0026auto=format\u0026fit=crop',
    order: 8,
  },
];

export const EVENT_HIGHLIGHTS = [
  {
    title: 'Competitions',
    description: 'Battle for glory in 15+ categories',
    icon: 'Trophy',
  },
  {
    title: 'Workshops',
    description: 'Learn from industry experts',
    icon: 'Lightbulb',
  },
  {
    title: 'Networking',
    description: 'Connect with peers & professionals',
    icon: 'Users',
  },
  {
    title: 'Entertainment',
    description: 'Live performances & celebrity guests',
    icon: 'Music',
  },
];
