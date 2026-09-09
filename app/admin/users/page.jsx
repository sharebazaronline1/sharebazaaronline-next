// app/admin/users/page.jsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminUsersClient from '@/components/AdminUsersClient';

export const metadata = {
  title: 'Admin Users - ShareBazaarOnline',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin-login');
  }

  // Check admin status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/admin-login?error=unauthorized');
  }

  return <AdminUsersClient />;
}