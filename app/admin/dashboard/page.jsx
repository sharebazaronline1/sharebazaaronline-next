// app/(protected)/admin/dashboard/page.jsx
import AdminDashboardClient from '@/components/AdminDashboardClient';

export const metadata = {
  title: 'Admin Dashboard - ShareBazaarOnline',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}