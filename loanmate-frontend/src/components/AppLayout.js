import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function AppLayout() {
  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <Outlet />
      </div>
    </>
  );
}

export default AppLayout;
