import { getAuthInfo } from "@/lib/auth";
import AdminSidebarClient from "@/components/AdminSidebarClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = await getAuthInfo(); // SERVER SIDE ✔
  console.log("isAdmin: ", isAdmin)
  return (
    <AdminSidebarClient isAdmin={isAdmin}>
      {children}
    </AdminSidebarClient>
  );
}