// app/(protected)/admin/ipo-upload/page.jsx
import AdminIPOUploadClient from '@/components/AdminIPOUploadClient';

export const metadata = {
  title: 'Admin IPO Upload - ShareBazaarOnline',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminIPOUploadPage() {
  return <AdminIPOUploadClient />;
}