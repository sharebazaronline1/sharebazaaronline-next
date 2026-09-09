// app/(protected)/admin/referrals/page.jsx
import AdminReferralsClient from '@/components/AdminReferralsClient';

export const metadata = {
  title: 'Admin Referrals - ShareBazaarOnline',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminReferralsPage() {
  return <AdminReferralsClient />;
}