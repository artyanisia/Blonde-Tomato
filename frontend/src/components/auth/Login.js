import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authSlice";
import "./Login.css";

import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";

function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please write email and password");
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <Message severity="error" text={`Error: ${error}`} />}

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            feedback={false}
            required
          />
        </div>

        <Button
          label={loading ? "Signing in..." : "Login"}
          icon={loading ? null : "pi pi-sign-in"}
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading && (
            <ProgressSpinner
              className="spinner-inline"
              strokeWidth="8"
              animationDuration=".8s"
            />
          )}
        </Button>
      </form>
    </div>
  );
}

export default Login;
