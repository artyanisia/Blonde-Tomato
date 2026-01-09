import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../redux/authSlice";
import { fetchSessions } from "../redux/sessionSlice";
import { Button } from "primereact/button";
import CreateSession from "./CreateSession";
import "./ProfessorDashboard.css";

function ProfessorDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { sessions } = useSelector((state) => state.sessions);

  useEffect(() => {
    if (token) {
      dispatch(fetchSessions({ token, role: user?.role }));
    }
  }, [dispatch, token, user?.role]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Professor Dashboard</h1>
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          className="p-button-danger"
          onClick={handleLogout}
        />
      </div>

      <div className="dashboard-content">
        <div className="user-info">
          <h3 className="welcome-text">Welcome, {user?.name}!</h3>
          <p className="role-text"><strong>Role:</strong> {user?.role}</p>
          <hr />
          <h4>Your Sessions</h4>
          <div className="sessions-list">
            {sessions.length === 0 ? (
              <p>No sessions created yet.</p>
            ) : (
              sessions.map((session, index) => (
                <div key={index} className="session-item">
                  <p><strong>Start:</strong> {new Date(session.startDateHour).toLocaleString()}</p>
                  <p><strong>End:</strong> {new Date(session.endDateHour).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="session-form-container">
          <CreateSession />
        </div>
      </div>
    </div>
  );
}

export default ProfessorDashboard;
