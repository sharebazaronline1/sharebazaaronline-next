// app/(protected)/admin/pre-ipo/page.jsx
import AdminPreIPOClient from '@/components/AdminPreIPOClient';

export const metadata = {
  title: 'Admin Pre-IPO Management - ShareBazaarOnline',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPreIPOPage() {
  return <AdminPreIPOClient />;
}