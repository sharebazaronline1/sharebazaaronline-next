// app/(protected)/admin/blogs/page.jsx
import AdminBlogClient from '@/components/AdminBlogClient';

export const metadata = {
  title: 'Admin Blog - ShareBazaarOnline',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminBlogPage() {
  return <AdminBlogClient />;
}