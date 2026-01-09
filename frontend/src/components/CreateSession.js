import { Calendar } from "primereact/calendar";
import { useState } from "react";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { createSession } from "../redux/sessionSlice";
import { Message } from "primereact/message";

function CreateSession() {

  const dispatch = useDispatch();

  const [startDate, setstartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const { loading, error, creationStatus } = useSelector((state) => state.sessions);

  const handleCreate = () => {
    if(!startDate || !endDate){
      alert("Fill out both dates!")
      return;
    }
    dispatch(createSession({sessionData: {startDateHour: startDate, 
    endDateHour: endDate }, token }));
  }

  return (
    <div>
      <h1>Create Session</h1>

      {creationStatus === "success" && (
        <Message severity="success" text="Session created!" className="mb-3" />
      )}

    {creationStatus === "failure" && ( 
      <Message severity="error" text={error || "Error creating session!"} className="mb-3" />
    )}

      <h3>Start date</h3>
      <Calendar
        name="startDate"
        id="calendar"
        value={startDate}
        onChange={(e) => setstartDate(e.value)}
      />
      <h3>End date</h3>
      <Calendar
        name="startDate"
        id="calendar"
        value={endDate}
        onChange={(e) => setEndDate(e.value)}
      />
      <div style={{ marginTop: '20px' }}>
        <Button 
          onClick={handleCreate} 
          loading={loading}
          label="Create"
        />
      </div>
    </div>
  );
}

export default CreateSession;
