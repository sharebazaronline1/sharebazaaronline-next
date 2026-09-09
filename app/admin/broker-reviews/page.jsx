// app/(protected)/admin/broker-reviews/page.jsx
import AdminBrokerReviewClient from '@/components/AdminBrokerReviewClient';

export const metadata = {
  title: 'Admin Broker Review - ShareBazaarOnline',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminBrokerReviewPage() {
  return <AdminBrokerReviewClient />;
}