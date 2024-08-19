"use client";
import DashboardPage from "./DashboardPage";
import withAuth from '@/src/components/hoc/withAuth';

function Dashboard() {
  return (
    <div>
      <DashboardPage />
    </div>
  );
}

export default withAuth(Dashboard);
