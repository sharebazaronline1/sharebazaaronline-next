// app/(protected)/admin/kyc/page.jsx
import AdminKycDocumentsClient from '@/components/AdminKycDocumentsClient';

export const metadata = {
  title: 'Admin KYC Documents - ShareBazaarOnline',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminKycDocumentsPage() {
  return <AdminKycDocumentsClient />;
}