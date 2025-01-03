import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useRoutes } from "react-router-dom";
import Home from "./pages/home";
import routes from "tempo-routes";
import Member from "./pages/member";
import Equipment from "./pages/equipment";
import Room from "./pages/room";
import TrainingPackage from "./pages/training-package";
import Analystic from "./pages/analystic";
import Login from "./pages/login";
import { AuthProvider } from "./services/AuthContext";
import RequireAuth from "./services/RequireAuth";
import TypePackage from "./pages/type-package";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/members"
          element={
            <RequireAuth>
              <Member />
            </RequireAuth>
          }
        />
        <Route
          path="/equipments"
          element={
            <RequireAuth>
              <Equipment />
            </RequireAuth>
          }
        />
        
        <Route
          path="/rooms"
          element={
            <RequireAuth>
              <Room />
            </RequireAuth>
          }
        />
        <Route
          path="/training-packages"
          element={
            <RequireAuth>
              <TrainingPackage />
            </RequireAuth>
          }
        />
        <Route
          path="/type-packages"
          element={
            <RequireAuth>
              <TypePackage />
            </RequireAuth>
          }
        />
        <Route
          path="/analytics"
          element={
            <RequireAuth>
              <Analystic />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
