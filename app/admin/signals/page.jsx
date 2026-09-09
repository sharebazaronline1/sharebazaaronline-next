// app/(protected)/admin/signals/page.jsx
import AdminSignalsClient from '@/components/AdminSignalsClient';

export const metadata = {
  title: 'Admin Signals - ShareBazaarOnline',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSignalsPage() {
  return <AdminSignalsClient />;
}