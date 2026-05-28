import { getDashboardStats } from "@/server/actions/admin";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboardPage() {
  const data = await getDashboardStats();

  return <DashboardClient data={data} />;
}
