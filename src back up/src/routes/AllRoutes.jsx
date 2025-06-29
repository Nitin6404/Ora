// src/routes/AllRoutes.jsx
import React from "react";

import Home from '../pages/admin/Home'
import Login from '../pages/admin/Login'
// import Dashboard from '../pages/admin/Dashboard'
import Dashboard from '../pages/admin/dashboard/index'
import ManageRoles from '../pages/admin/ManageRoles'
import UserManagement from '../pages/admin/UserManagement'
import ManagePrograms from '../pages/admin/ManagePrograms'
import AdminPatients from '../pages/admin/AdminPatients'
import AdminTickets from '../pages/admin/AdminTickets'
import AdminFaqManager from '../pages/admin/AdminFaqManager'
import PatientRegistrationForm from '../pages/patient/PatientRegistrationForm'
import PatientProfile from '../pages/patient/PatientProfile'
import FaqPortal from '../pages/patient/FaqPortal'
import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import DecisionTree from '../pages/admin/DecisionTree'
import DecisionTreeFlow from '../pages/admin/DecisionTreeFlow'
import NewProgram from '../pages/NewProgram'
import { ReactFlowProvider } from 'reactflow';
import { AnimatePresence, motion } from 'framer-motion';
import FadeWrapper from "./FadeWrapper";
import Test from "../pages/admin/Text";
import ViewProgram from "../pages/ViewProgram";
import EditProgram from "../pages/EditProgram";
import NewPatient from "../pages/NewPatient";
import AddPatient from "../pages/AddPatient";
import EditPatient from "../pages/EditPatient";
const AllRoutes = () => {
  const isAuthenticated = localStorage.getItem("token"); // or your own logic


  return (
     <AnimatePresence mode="wait">
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="/test" element={<Test />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute pageName="dashboard">
            <FadeWrapper>
              <Dashboard />
            </FadeWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/newprogram"
        element={
          <ProtectedRoute pageName="newprogram">
            <FadeWrapper>
              <NewProgram />
            </FadeWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/programview/:id"
        element={
          <ProtectedRoute pageName="programview">
            <FadeWrapper>
              <ViewProgram />
            </FadeWrapper>
          </ProtectedRoute>
        }
      />
       <Route
        path="/editprogram/:id"
        element={
          <ProtectedRoute pageName="editprogram">
            <FadeWrapper>
              <EditProgram />
            </FadeWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute pageName="newpatient">
            <FadeWrapper>
              <NewPatient />
            </FadeWrapper>
          </ProtectedRoute>
        }
      />
           <Route
        path="/addpatient"
        element={
          <ProtectedRoute pageName="addpatient">
            <FadeWrapper>
              <AddPatient />
            </FadeWrapper>
          </ProtectedRoute>
        }
      />
          <Route
        path="/editpatient/:id"
        element={
          <ProtectedRoute pageName="editpatient">
            <FadeWrapper>
              <EditPatient />
            </FadeWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles"
        element={
          <ProtectedRoute pageName="roles">
            <ManageRoles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute pageName="users">
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/programs"
        element={
          <ProtectedRoute pageName="programs">
            <NewProgram />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute pageName="register">
            <PatientRegistrationForm />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/patients"
        element={
          <ProtectedRoute pageName="patients">
            <AdminPatients />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/faq"
        element={
          <ProtectedRoute pageName="faq">
            <AdminFaqManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute pageName="support">
            <FaqPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute pageName="tickets">
            <AdminTickets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute pageName="profile">
            <PatientProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/decisiontree"
        element={
          <ProtectedRoute pageName="profile">
            <DecisionTree />
          </ProtectedRoute>
        }
      />
      <Route
        path="/decisiontreeflow"
        element={
          <ProtectedRoute pageName="profile">
            <ReactFlowProvider>
              <DecisionTreeFlow />
            </ReactFlowProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
       </AnimatePresence>
  );
};

export default AllRoutes;
