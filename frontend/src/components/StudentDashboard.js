import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../redux/authSlice";
import { fetchSessions } from "../redux/sessionSlice";
import {
  fetchStudentRequests,
  createRequest,
  uploadStudentFile,
} from "../redux/requestSlice";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import "./Dashboard.css";

function StudentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useRef(null);

  const { user, token } = useSelector((state) => state.auth);
  const { sessions } = useSelector((state) => state.sessions);
  const { creationStatus, error } = useSelector((state) => state.requests);
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

  const handleApply = async (sessionId, professorId) => {
    const title = prompt("Enter thesis title: ");
    if (!title) return;

    try {
      await dispatch(
        createRequest({ requestData: { sessionId, professorId, title }, token })
      ).unwrap();
      dispatch(fetchStudentRequests(token));
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Application submitted successfully",
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Application Failed",
        detail: err || "Could not submit application",
      });
    }
  };

  const handleFileUpload = async (requestId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("signedDocument", file);

    try {
      await dispatch(
        uploadStudentFile({ requestId, formData, token })
      ).unwrap();
      dispatch(fetchStudentRequests(token));
      toast.current.show({
        severity: "success",
        summary: "File Uploaded",
        detail: "Your signed document has been submitted",
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Upload Failed",
        detail: err || "Could not upload file",
      });
    }
  };

  const approvedRequest = requests.find(
    (req) => req.status === "Approved" || req.status === "ReuploadNeeded"
  );

  return (
    <div className="dashboard-container">
      <Toast ref={toast} />
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          className="p-button-danger"
          onClick={handleLogout}
        />
      </div>

      <p>
        Welcome, <strong>{user?.name}</strong>!
      </p>
      <p className="role-text">Role: {user?.role}</p>

      <div className="dashboard-content">
        {approvedRequest ? (
          <div
            className="approved-section"
            style={{
              width: "100%",
              padding: "20px",
              background: "#f9f9f9",
              borderRadius: "10px",
              border: "2px solid black",
            }}
          >
            <h3 style={{ color: "black" }}>Your Request is Approved!</h3>
            <p>
              <strong>Thesis Title:</strong> {approvedRequest.title}
            </p>
            <p>
              <strong>Coordinator:</strong>{" "}
              {approvedRequest.Professor?.user?.name}
            </p>
            <hr />

            <div className="upload-box" style={{ marginTop: "20px" }}>
              <h4>1. Upload Signed Request (PDF)</h4>
              {approvedRequest.status === "ReuploadNeeded" && (
                <div style={{ marginBottom: "15px" }}>
                  <Message
                    severity="warn"
                    text={`Revision requested: ${approvedRequest.rejectionReason}`}
                    style={{ width: "100%", marginBottom: "10px" }}
                  />
                </div>
              )}
              {approvedRequest.signedRequestFilePath &&
              approvedRequest.status !== "ReuploadNeeded" ? (
                <Message
                  severity="success"
                  text="You have uploaded the signed request."
                  className="mb-2"
                />
              ) : (
                <div className="file-upload-input">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(approvedRequest.id, e)}
                    id="student-file-upload"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="student-file-upload">
                    <Button
                      label="Select & Upload Signed Request"
                      icon="pi pi-upload"
                      className="p-button-outlined p-button-success"
                      onClick={() =>
                        document.getElementById("student-file-upload").click()
                      }
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="professor-file-box" style={{ marginTop: "30px" }}>
              <h4>2. Final Document from Professor</h4>
              {approvedRequest.finalProfessorFileUrl ? (
                <div>
                  <Message
                    severity="info"
                    text="The professor has uploaded the final signed document!"
                    className="mb-2"
                  />
                  <Button
                    label="Download Final Document"
                    icon="pi pi-download"
                    className="p-button-success"
                    onClick={() =>
                      window.open(
                        `http://localhost:5000/${approvedRequest.finalProfessorFileUrl}`,
                        "_blank"
                      )
                    }
                  />
                </div>
              ) : (
                <p style={{ color: "#666" }}>
                  Waiting for professor to upload the final document...
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="sessions-section">
              <h4>Active Sessions</h4>
              {creationStatus === "success" && (
                <Message
                  severity="success"
                  text="Request created!"
                  className="mb-3"
                  style={{ width: "100%", marginBottom: "10px" }}
                />
              )}

              {creationStatus === "failure" && (
                <Message
                  severity="error"
                  text={error || "Error creating request!"}
                  className="mb-3"
                  style={{ width: "100%", marginBottom: "10px" }}
                />
              )}

              <div className="sessions-list">
                {sessions.length === 0 ? (
                  <p>No sessions created yet.</p>
                ) : (
                  sessions.map((session, index) => (
                    <div key={index} className="session-item">
                      <p>
                        <strong>Professor:</strong>{" "}
                        {session.Professor?.user?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Start:</strong>{" "}
                        {new Date(session.startDateHour).toLocaleString()}
                      </p>
                      <p>
                        <strong>End:</strong>{" "}
                        {new Date(session.endDateHour).toLocaleString()}
                      </p>

                      <Button
                        label="Apply for Thesis"
                        icon="pi pi-plus"
                        onClick={() =>
                          handleApply(session.id, session.professorId)
                        }
                        className="p-button-sm p-button-success"
                        style={{ marginTop: "10px" }}
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
                    <div
                      key={index}
                      className="request-item"
                      data-status={req.status}
                    >
                      <p>
                        <strong>Thesis Title:</strong> {req.title}
                      </p>
                      <p>
                        <strong>Professor:</strong>{" "}
                        {req.Professor?.user?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className={`status-${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </p>
                      {req.status === "Rejected" && req.rejectionReason && (
                        <p
                          className="rejection-reason"
                          style={{ color: "#d9534f", fontSize: "0.9em" }}
                        >
                          <strong>Reason:</strong> {req.rejectionReason}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
