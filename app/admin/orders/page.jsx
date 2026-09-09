// app/(protected)/admin/orders/page.jsx
import AdminOrdersClient from '@/components/AdminOrdersClient';

export const metadata = {
  title: 'Admin Orders - ShareBazaarOnline',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}