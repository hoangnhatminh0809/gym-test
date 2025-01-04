import React from "react";
import StatsCard from "./StatsCard";
import ActivityFeed from "./ActivityFeed";
import QuickActions from "./QuickActions";
import { Users, DollarSign, Calendar, Dumbbell } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/services/api";

interface DashboardGridProps {
  stats?: {
    title: string;
    value: string | number;
    trend: number;
    icon: React.ReactNode;
    description: string;
  }[];
}

const defaultStats = [
  {
    title: "Active Members",
    value: "1,234",
    trend: 12.5,
    icon: <Users className="h-4 w-4" />,
    description: "Total active gym members",
  },
  {
    title: "Monthly Revenue",
    value: "$45,678",
    trend: 8.3,
    icon: <DollarSign className="h-4 w-4" />,
    description: "Revenue this month",
  },
  {
    title: "New Member",
    value: "156",
    trend: -2.5,
    icon: <Calendar className="h-4 w-4" />,
    description: "New member join our gym",
  },
  {
    title: "Equipment Usage",
    value: "85%",
    trend: 5.2,
    icon: <Dumbbell className="h-4 w-4" />,
    description: "Average equipment utilization",
  },
];

const DashboardGrid = ({ stats = defaultStats }: DashboardGridProps) => {
  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <ActivityFeed />
        </div>
        <div>
          {/* <QuickActions /> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;
