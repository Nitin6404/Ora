import Navigation from './Navigation'
import React, { useEffect, useState } from "react";
import { ChartBarIcon, UserGroupIcon, UsersIcon, KeyIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import apiService from "../../services/apiService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    programs: 0,
    patients: 0,
    users: 0,
    roles: 0,
    tickets: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.get("/api/program/dashboard-stats/");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  const widgets = [
    { label: "Programs", value: stats.programs, icon: ChartBarIcon },
    { label: "Patients", value: stats.patients, icon: UsersIcon },
    { label: "Users", value: stats.users, icon: UserGroupIcon },
    { label: "Roles", value: stats.roles, icon: KeyIcon },
    { label: "Tickets", value: stats.tickets, icon: ClipboardDocumentListIcon },
  ];

  return (
    <Navigation>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {widgets.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white shadow rounded-lg p-6 flex items-center">
            <Icon className="h-10 w-10 text-blue-500 mr-4" />
            <div>
              <div className="text-2xl font-semibold">{value}</div>
              <div className="text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </Navigation>
  );
};

export default Dashboard;
