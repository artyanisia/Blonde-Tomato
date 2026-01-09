import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth() {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();

  //state.auth = auth = reducer from redux/store
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "Student") {
        navigate("/student/dashboard");
      } else if (user.role === "Professor") {
        navigate("/professor/dashboard");
      }else {
        console.log("Rolul nu corespunde:", user.role);
      }
    }
  }, [isAuthenticated, user, navigate]);

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
