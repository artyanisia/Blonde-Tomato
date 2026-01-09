import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../redux/authSlice";
import { fetchSessions } from "../redux/sessionSlice";
import { fetchStudentRequests, createRequest } from "../redux/requestSlice";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import "./StudentDashboard.css";

function StudentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, token } = useSelector((state) => state.auth); 
  const { sessions } = useSelector((state) => state.sessions);
  const { creationStatus , error } = useSelector((state) => state.requests);
  const { requests } = useSelector((state) => state.requests);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  useEffect(() => {
    if (token) { 
      dispatch(fetchSessions({ token, role: user?.role }));
      dispatch(fetchStudentRequests(token));
    }
  }, [dispatch, token, user?.role]);

  const handleApply = (sessionId, professorId) => {
    const title = prompt("Enter thesis title: ")
    if(title){
      dispatch(createRequest({requestData: {sessionId, professorId, title}, token}))
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          className="p-button-danger"
          onClick={handleLogout}
        />
      </div>
      
      <p>Welcome, <strong>{user?.name}</strong>!</p>
      <p className="role-text">Role: {user?.role}</p>

      <div className="dashboard-content">
        <div className="sessions-section">
          <h4>Active Sessions</h4>
          {creationStatus === "success" && (
            <Message severity="success" text="Request created!" className="mb-3" style={{width: '100%', marginBottom: '10px'}} />
          )}

          {creationStatus === "failure" && ( 
            <Message severity="error" text={error || "Error creating request!"} className="mb-3" style={{width: '100%', marginBottom: '10px'}} />
          )}

          <div className="sessions-list">
            {sessions.length === 0 ? (
              <p>No sessions created yet.</p>
            ) : (
              sessions.map((session, index) => (
                <div key={index} className="session-item">
                  <p><strong>Professor:</strong> {session.Professor?.user?.name || "N/A"}</p>
                  <p><strong>Start:</strong> {new Date(session.startDateHour).toLocaleString()}</p>
                  <p><strong>End:</strong> {new Date(session.endDateHour).toLocaleString()}</p>
                  
                  <Button 
                    label="Apply for Thesis" 
                    icon="pi pi-plus" 
                    onClick={() => handleApply(session.id, session.professorId)}
                    className="p-button-sm p-button-success"
                    style={{ marginTop: '10px' }}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="applications-section">
          <h4>Your Applications</h4>
          <div className="requests-list">
            {requests.length === 0 ? (
              <p>You haven't applied to any professor yet.</p>
            ) : (
              requests.map((req, index) => (
                <div key={index} className="request-item" data-status={req.status}>
                  <p><strong>Thesis Title:</strong> {req.title}</p>
                  <p><strong>Professor:</strong> {req.Professor?.user?.name || "N/A"}</p>
                  <p><strong>Status:</strong> <span className={`status-${req.status.toLowerCase()}`}>{req.status}</span></p> 
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
