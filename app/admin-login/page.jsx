// app/admin-login/page.jsx
import AdminLoginClient from '@/components/AdminLoginClient';

export const metadata = {
  title: 'Admin Login - ShareBazaarOnline',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}