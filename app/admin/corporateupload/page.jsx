// app/(protected)/admin/corporate/page.jsx
import AdminCorporateActionClient from '@/components/AdminCorporateActionClient';

export const metadata = {
  title: 'Admin Corporate Action - ShareBazaarOnline',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminCorporateActionPage() {
  return <AdminCorporateActionClient />;
}