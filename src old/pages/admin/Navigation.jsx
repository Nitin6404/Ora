import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import oralogo from "../../assets/oralogo.png";

const modules = [
  {
    name: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: "/dashboard-icon.svg",
  },
  // {
  //   name: "roles",
  //   label: "Manage Roles",
  //   path: "/roles",
  //   icon: "/role-icon.svg",
  // },
  {
    name: "users",
    label: "User Management",
    path: "/users",
    icon: "/user-icon.svg",
  },
  {
    name: "assign",
    label: "Assign",
    path: "/assign",
    icon: "/assi.svg",
  },
  {
    name: "programs",
    label: "Programs",
    path: "/programs",
    icon: "/program-icon.svg",
  },
  {
    name: "patients",
    label: "Patients",
    path: "/patients",
    icon: "/patient-icon.svg",
  },
  {
    name: "media",
    label: "Media",
    path: "/media",
    icon: "/media.svg",
  },
  // {
  //   name: "tickets",
  //   label: "Tickets",
  //   path: "/tickets",
  //   icon: "/ticket-icon.svg",
  // },
  // {
  //   name: "faq",
  //   label: "FAQ Manager",
  //   path: "/faq",
  //   icon: "program-icon.svg",
  // },
  // {
  //   name: "register",
  //   label: "Patient Register",
  //   path: "/register",
  //   icon: "program-icon.svg",
  // },
  // {
  //   name: "support",
  //   label: "Patient Support",
  //   path: "/support",
  //   icon: "program-icon.svg",
  // },
  // {
  //   name: "profile",
  //   label: "Patient Profile",
  //   path: "/profile",
  //   icon: "program-icon.svg",
  // },
];

export default function Navigation({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const allowedPages = [...user?.allowed_pages, "assign", "media"] || [];

  const visibleModules = modules.filter((mod) =>
    allowedPages.includes(mod.name)
  );

  const isDashboard =
    location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  // CLosing sidebar for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <>
      {/* Top Bar */}
      {/* {!isDashboard && (
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
      )} */}

      {/* Sidebar */}

      {/*  shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)] */}
      <nav
        className={`fixed top-4 left-0 h-[calc(100vh-64px)] rounded-3xl bg-transparent text-gray-700 flex flex-col transition-all duration-300 ease-in-out py-4 z-50
    ${isOpen ? "lg:w-64 md:w-48 w-36 px-4" : "w-16 px-2"} overflow-hidden`}
      >
        <div className="flex items-center justify-center h-12 mb-8">
          {isOpen ? (
            <img src={oralogo} alt="Logo" className="h-full w-auto" />
          ) : (
            ""
          )}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {visibleModules.map(({ name, label, path, icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-4 py-3 px-2 transition-colors rounded font-semibold
          ${
            isActive
              ? "text-[#7b71c8] bg-white"
              : "hover:bg-gray-200 text-[#292935]"
          }
          ${
            isOpen
              ? "rounded-full justify-start pl-6"
              : "rounded-full justify-center"
          }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={icon}
                    alt={`${label} icon`}
                    className={`w-5 h-5 transition duration-200 ${
                      isActive ? "filter-purple" : "filter-gray"
                    }`}
                  />
                  <span
                    className={`text-xs md:text-sm lg:text-base ${
                      isOpen ? "block" : "hidden"
                    } whitespace-nowrap`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main
        className={`transition-margin duration-300 h-full no-scrollbar
    ${isOpen ? "lg:ml-64 md:ml-48 ml-36" : "ml-16"}
    ${isDashboard ? "pt-0 px-0" : ""}`}
      >
        <div
          className={`h-screen flex flex-col ${
            isDashboard ? "mt-0" : "text-gray-700"
          }`}
        >
          {children}
        </div>
      </main>
    </>
  );
}
