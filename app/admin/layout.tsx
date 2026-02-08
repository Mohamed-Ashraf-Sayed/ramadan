import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import SessionProvider from "@/components/admin/SessionProvider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if the current path is the login page
  // We need to allow access to login page without authentication

  return (
    <SessionProvider>
      {session ? (
        <div className="min-h-screen bg-ramadan-navy">
          <Sidebar />
          <main className="mr-64 min-h-screen p-8">{children}</main>
        </div>
      ) : (
        children
      )}
    </SessionProvider>
  );
}
