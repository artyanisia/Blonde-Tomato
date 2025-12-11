import { useState, useEffect, useRef } from "react";
import Login from "./Login";
import Register from "./Register";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth() {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();
  const authStatusRef = useRef(false);

  //state.auth = auth = reducer from redux/store
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (
      isAuthenticated &&
      !authStatusRef.current &&
      user &&
      user.role &&
      isLoginView
    ) {
      authStatusRef.current = true;

      if (user.role === "Student") {
        navigate("/student/dashboard", { replace: true });
      } else if (user.role === "Professor") {
        navigate("/professor/dashboard", { replace: true });
      }
    } else if (!isAuthenticated) {
      authStatusRef.current = false;
    }
  }, [isAuthenticated, user, navigate, isLoginView]);

  return (
    <div className="auth-container">
      {isLoginView ? <Login /> : <Register />}
      <button
        className="auth-toggle"
        onClick={() => setIsLoginView(!isLoginView)}
      >
        {isLoginView ? "Register" : "Sign in"}
      </button>
    </div>
  );
}

export default Auth;
