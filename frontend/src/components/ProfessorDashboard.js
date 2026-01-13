import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../redux/authSlice";
import { fetchSessions } from "../redux/sessionSlice";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import CreateSession from "./CreateSession";
import "./Dashboard.css";
import {
  approveRequest,
  fetchProfessorRequests,
  rejectRequest,
  rejectThesisRequest,
  uploadProfessorFile,
} from "../redux/requestSlice";

function ProfessorDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useRef(null);
  const { user, token } = useSelector((state) => state.auth);
  const { sessions } = useSelector((state) => state.sessions);
  const { requests } = useSelector((state) => state.requests);

  useEffect(() => {
    if (token) {
      dispatch(fetchSessions({ token, role: user?.role }));
      dispatch(fetchProfessorRequests(token));
    }
  }, [dispatch, token, user?.role]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await dispatch(approveRequest({ requestId, token })).unwrap();
      dispatch(fetchProfessorRequests(token));
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Student approved successfully",
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err || "Failed to approve request",
      });
    }
  };

  const handleRejectRequest = async (requestId) => {
    const reason = prompt("Enter the reason for rejection:");
    if (!reason) return;

    try {
      await dispatch(
        rejectRequest({ requestId, rejectionReason: reason, token })
      ).unwrap();
      dispatch(fetchProfessorRequests(token));
      toast.current.show({
        severity: "info",
        summary: "Rejected",
        detail: "Request has been rejected",
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err || "Failed to reject request",
      });
    }
  };

  const handleRejectThesisRequest = async (requestId) => {
    const reason = prompt(
      "Enter the reason for rejecting this thesis document:"
    );
    if (!reason) return;

    try {
      await dispatch(
        rejectThesisRequest({ requestId, rejectionReason: reason, token })
      ).unwrap();
      dispatch(fetchProfessorRequests(token));
      toast.current.show({
        severity: "info",
        summary: "Document Rejected",
        detail: "Submission rejected and revision requested",
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err || "Failed to reject document",
      });
    }
  };
  const handleUploadProfessorFile = async (requestId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("signedDocument", file);

    try {
      await dispatch(
        uploadProfessorFile({ requestId, formData, token })
      ).unwrap();
      dispatch(fetchProfessorRequests(token));
      toast.current.show({
        severity: "success",
        summary: "Uploaded",
        detail: "Document uploaded successfully",
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err || "Upload failed",
      });
    }
  };

  const coordinatedStudents = requests.filter(
    (req) => req.status === "Approved"
  );
  const pendingRequests = requests.filter((req) => req.status === "Pending");

  return (
    <div className="dashboard-container">
      <Toast ref={toast} />
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
          <p className="role-text">
            <strong>Role:</strong> {user?.role}
          </p>
          <hr />
          <h4>Your Sessions</h4>
          <div className="sessions-list">
            {sessions.length === 0 ? (
              <p>No sessions created yet.</p>
            ) : (
              sessions.map((session, index) => (
                <div key={index} className="session-item">
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(session.startDateHour).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {new Date(session.endDateHour).toLocaleString()}
                  </p>
                </div>
              ))
            )}
            <hr />
            <h4>My Coordinated Students</h4>
            <div className="coordinated-list">
              {coordinatedStudents.length === 0 ? (
                <p>No students coordinated yet.</p>
              ) : (
                coordinatedStudents.map((req, index) => (
                  <div
                    key={index}
                    className="request-item"
                    style={{
                      border: "1px solid #4CAF50",
                      padding: "15px",
                      marginBottom: "15px",
                      borderRadius: "8px",
                      borderLeft: "5px solid #4CAF50",
                    }}
                  >
                    <p>
                      <strong>Student:</strong>{" "}
                      {req.Student?.user?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Thesis Title:</strong> {req.title}
                    </p>
                    <p>
                      <strong>Status:</strong> <span>{req.status}</span>
                    </p>

                    <div
                      className="request-actions"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      {req.finalProfessorFileUrl ? (
                        <div
                          className="completed-action"
                          style={{
                            padding: "10px",
                            borderRadius: "5px",
                          }}
                        >
                          <Button
                            label="Download Final Signed Document"
                            icon="pi pi-download"
                            className="p-button-success p-button-sm"
                            onClick={() =>
                              window.open(
                                `http://localhost:5000/${req.finalProfessorFileUrl}`,
                                "_blank"
                              )
                            }
                          />
                        </div>
                      ) : (
                        <>
                          {req.signedRequestFilePath ? (
                            <>
                              <div style={{ display: "flex", gap: "10px" }}>
                                <Button
                                  label="Download Student's Signed File"
                                  icon="pi pi-download"
                                  className="p-button-outlined p-button-info p-button-sm"
                                  onClick={() =>
                                    window.open(
                                      `http://localhost:5000/${req.signedRequestFilePath}`,
                                      "_blank"
                                    )
                                  }
                                />
                                <Button
                                  label="Reject Thesis Document"
                                  icon="pi pi-times"
                                  className="p-button-outlined p-button-danger p-button-sm"
                                  onClick={() =>
                                    handleRejectThesisRequest(req.id)
                                  }
                                />
                              </div>

                              <div className="professor-upload">
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) =>
                                    handleUploadProfessorFile(req.id, e)
                                  }
                                  id={`professor-upload-${req.id}`}
                                  style={{ display: "none" }}
                                />
                                <Button
                                  label="Upload Final Signed File"
                                  icon="pi pi-upload"
                                  className="p-button-success p-button-sm"
                                  onClick={() =>
                                    document
                                      .getElementById(
                                        `professor-upload-${req.id}`
                                      )
                                      .click()
                                  }
                                />
                              </div>
                            </>
                          ) : (
                            <p style={{ fontSize: "0.85em", color: "#666" }}>
                              Waiting for student to upload signed request...
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <hr />
            <h4>Pending Thesis Requests</h4>
            <div className="requests-list">
              {pendingRequests.length === 0 ? (
                <p>No requests yet.</p>
              ) : (
                pendingRequests.map((req, index) => (
                  <div
                    key={index}
                    className="request-item"
                    style={{
                      border: "1px solid #ccc",
                      padding: "15px",
                      marginBottom: "15px",
                      borderRadius: "8px",
                    }}
                  >
                    <p>
                      <strong>Student:</strong>{" "}
                      {req.Student?.user?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Thesis Title:</strong> {req.title}
                    </p>
                    <p>
                      <strong>Status:</strong> {req.status}
                    </p>

                    <div
                      className="request-actions"
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      {req.status === "Pending" && (
                        <>
                          <Button
                            label="Approve"
                            icon="pi pi-check"
                            className="p-button-success p-button-sm"
                            onClick={() => handleApproveRequest(req.id)}
                          />
                          <Button
                            label="Reject"
                            icon="pi pi-times"
                            className="p-button-danger p-button-sm"
                            onClick={() => handleRejectRequest(req.id)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
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
