import React from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardGrid from "../components/dashboard/overview/DashboardGrid";

interface HomeProps {
  gymName?: string;
  adminUser?: {
    name: string;
    email: string;
    avatar: string;
  };
}

const Home = ({
  gymName = "Trung Hieu Gym",
  adminUser = {
    name: "Admin User",
    email: "admin@fitcore.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
}: HomeProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          gymName={gymName}
          adminUser={adminUser}
          notificationCount={3}
        />
        <main className="flex-1 overflow-auto">
          <DashboardGrid />
        </main>
      </div>
    </div>
  );
};

export default Home;
