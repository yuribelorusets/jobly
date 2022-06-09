import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../shared/Alert";

/** Form component used for signing up user.
 * props: signup
 * state: formData
 */
function SignupForm({ signup }) {
  const initialValue = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  };
  const [formData, setFormData] = useState(initialValue);
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(null)

  /** Update form input. */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  }

  /** Call parent function. */
  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      await signup(formData);
      navigate("/");
    } catch (err) {
      setAlerts(err)
    }

  }

  const formInputsHTML = (
    <div className="mb-3">
      <label htmlFor="signup-username">Username: </label>
      <input
        id="signup-username"
        name="username"
        className="form-control"
        placeholder="Enter username"
        onChange={handleChange}
        value={formData.username}
        aria-label="signup-form-username"
      />
      <label htmlFor="signup-password">Password: </label>
      <input
        type="password"
        id="signup-password"
        name="password"
        className="form-control"
        placeholder="Enter password"
        onChange={handleChange}
        value={formData.password}
        aria-label="signup-form-password"
      />
      <label htmlFor="signup-firstName">First Name: </label>
      <input
        id="signup-firstName"
        name="firstName"
        className="form-control"
        placeholder="Enter First Name"
        onChange={handleChange}
        value={formData.firstName}
        aria-label="signup-form-firstName"
      />
      <label htmlFor="signup-lastName">Last Name: </label>
      <input
        id="signup-lastName"
        name="lastName"
        className="form-control"
        placeholder="Enter Last Name"
        onChange={handleChange}
        value={formData.lastName}
        aria-label="signup-form-lastName"
      />
      <label htmlFor="signup-email">Email: </label>
      <input
        // type="email"
        id="signup-email"
        name="email"
        className="form-control"
        placeholder="Enter Email:"
        onChange={handleChange}
        value={formData.email}
        aria-label="signup-form-email"
      />
    </div>
  );

  return (
    <form
      className="custom-form justify-content-center container bg-light"
      onSubmit={handleSubmit}
    >
      {formInputsHTML}

      {alerts && <Alert alerts={alerts} />}

      <button className="SignupForm-Btn btn-primary btn ms-3 py-1 btn-sm">
        Submit
      </button>
    </form>
  );
}

export default SignupForm;
