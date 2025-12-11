import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../redux/authSlice";
import { Button } from "primereact/button";

function StudentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Student Dashboard</h1>
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          className="p-button-danger"
          onClick={handleLogout}
        />
      </div>
      <p>Welcome, {user?.name}!</p>
      <p>Role: {user?.role}</p>
      {/* Add student dashboard content here */}
    </div>
  );
}

export default StudentDashboard;
