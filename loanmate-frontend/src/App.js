import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/AppLayout";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import AddPerson from "./pages/AddPerson";
import PersonDetail from "./pages/PersonDetail";
import AddLoan from "./pages/AddLoan";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontSize: "14px", fontWeight: "500" },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-person" element={<AddPerson />} />
            <Route path="/person/:id" element={<PersonDetail />} />
            <Route path="/person/:id/add-loan" element={<AddLoan />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
