// app/(protected)/admin/corporate-actions/page.jsx
import AdminCorporateActionsClient from '@/components/AdminCorporateActionsClient';

export const metadata = {
  title: 'Admin Corporate Actions Manager - ShareBazaarOnline',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminCorporateActionsPage() {
  return <AdminCorporateActionsClient />;
}