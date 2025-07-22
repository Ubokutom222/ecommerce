import auth from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/admin/sign-in");
  const { role } = session.user;
  if (role !== "admin" && role !== "vendor") {
    redirect("/admin/sign-in");
  }
  return <div>This is the admin dashbaord</div>;
}
