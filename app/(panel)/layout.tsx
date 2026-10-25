import DashboardLayout from "@/components/dashboard-layout";

export default function PanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}