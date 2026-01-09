import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/authSlice";
import "./Register.css";

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

function Register() {
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });

  const roleOptions = [
    { label: "Student", value: "Student" },
    { label: "Professor", value: "Professor" },
  ];

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.role ||
      !formData.email ||
      !formData.password ||
      !formData.name
    ) {
      alert("Please fill in all fields.");
      return;
    }

    dispatch(registerUser(formData));
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {error && <Message severity="error" text={`Error: ${error}`} />}

        <div className="form-field">
          <label htmlFor="name">Full Name</label>
          <InputText
            id="name"
            name="name"
            value={formData.name} 
            onChange={handleChange} 
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="role">Role</label>
          <Dropdown
            id="role"
            name="role"
            value={formData.role}
            options={roleOptions}
            onChange={(e) => setFormData({...formData, role: e.value})} 
            placeholder="Select a role"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <Password
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            toggleMask
            feedback={true}
            required
          />
        </div>

        <Button
          label={loading ? "Registering..." : "Register"}
          icon={loading ? null : "pi pi-user-plus"}
          type="submit"
          disabled={loading}
          className="submit-button"
        />
      </form>
    </div>
  );
}

export default Register;
