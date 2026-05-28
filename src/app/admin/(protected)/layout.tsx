import { redirect } from "next/navigation";
import { createClient } from "@/server/db/supabase";
import AdminShellClient from "./AdminShellClient";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  return (
    <AdminShellClient userEmail={user.email || "admin@oklute.com"}>
      {children}
    </AdminShellClient>
  );
}
