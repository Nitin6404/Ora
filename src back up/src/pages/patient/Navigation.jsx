import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  KeyIcon,
  FolderPlusIcon,
  UsersIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  QuestionMarkCircleIcon,
  PencilSquareIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

// All available pages with route, label, and icon
const modules = [
  { name: "dashboard", label: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { name: "roles", label: "Manage Roles", path: "/roles", icon: KeyIcon },
  { name: "users", label: "User Management", path: "/users", icon: UserGroupIcon },
  { name: "programs", label: "Manage Programs", path: "/programs", icon: FolderPlusIcon },
  { name: "patients", label: "Patients", path: "/patients", icon: UsersIcon },
  { name: "tickets", label: "Tickets", path: "/tickets", icon: ChatBubbleOvalLeftEllipsisIcon },
  { name: "faq", label: "FAQ Manager", path: "/faq", icon: QuestionMarkCircleIcon },
  { name: "register", label: "Patient Register", path: "/register", icon: PencilSquareIcon },
  { name: "support", label: "Patient Support", path: "/support", icon: ChatBubbleOvalLeftEllipsisIcon },
  { name: "profile", label: "Patient Profile", path: "/profile", icon: IdentificationIcon },
];

export default function Navigation({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const allowedPages = user?.allowed_pages || [];

  const visibleModules = modules.filter((mod) =>
    allowedPages.includes(mod.name)
  );

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-gray-100 shadow flex items-center justify-between px-6 z-40">
        <div className="text-2xl font-bold text-gray-800">ORA</div>
        <div className="flex items-center gap-4">
          <UserCircleIcon className="w-8 h-8 text-gray-600 cursor-pointer" />
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <nav
        className={`fixed top-14 left-0 h-[calc(100vh-56px)] bg-gray-50 border-r border-gray-300
          text-gray-700 flex flex-col transition-[width] duration-300
          ${isOpen ? "w-56" : "w-16"} overflow-hidden z-50`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200 font-semibold text-lg">
          {isOpen ? "Ora VR Admin Module" : "Ora"}
        </div>

        <div className="flex flex-col mt-4 flex-1">
          {visibleModules.map(({ name, label, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 transition-colors rounded ${
                  isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                }`
              }
            >
              <Icon className="w-6 h-6" />
              {isOpen && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="mb-4 px-4 py-3 border-t border-gray-200 text-sm text-gray-500">
          {isOpen ? "© 2025 ORA Company" : ""}
        </div>
      </nav>

      {/* Main Content */}
      <main
        className={`pt-14 px-6 transition-margin duration-300 ${
          isOpen ? "ml-56" : "ml-16"
        }`}
      >
        {location.pathname === "/dashboard" && (
          <h1 className="text-3xl font-bold mt-6">Welcome to ORA Dashboard</h1>
        )}
        <div className="mt-4 text-gray-700">{children}</div>
      </main>
    </>
  );
}