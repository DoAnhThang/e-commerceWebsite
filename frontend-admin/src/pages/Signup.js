import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../data/api";

const initValues = { email: "", password: "", role: "" };

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initValues);
  const [errorMsg, setErrorMsg] = useState(initValues);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // put signup or post login
  const putSignup = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/auth/signup`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          fullName: form.email.split("@")[0],
          phoneNumber: String(Math.random()).replace(".", "").slice(0, 10),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log("putSignup: ", data);
      for (const key in data) {
        if (data[key].msg) {
          setErrorMsg((prev) => ({ ...prev, [key]: data[key].msg }));
        }
      }
      if (data.isAuth) {
        navigate("/");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(initValues);
    putSignup();
  };

  return (
    <>
      <h4 className="text-dark fw-bold mb-4">Sign Up</h4>

      <div
        className="bg-white w-25 rounded-3 px-4 py-2"
        style={{ minWidth: "15rem" }}
      >
        <form className="text-end my-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            className={`form-control form-control-sm w-100 mb-2 ${
              errorMsg.email && "border-danger bg-lightRed"
            }`}
            value={form.email}
            onChange={handleChange}
            required
          />
          {errorMsg.email && (
            <div className="form-text text-danger text-start fs-7 mb-2">
              {errorMsg.email}
            </div>
          )}

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            className={`form-control form-control-sm w-100 mb-2 ${
              errorMsg.password && "border-danger bg-lightRed"
            }`}
            value={form.password}
            onChange={handleChange}
            required
          />
          {errorMsg.password && (
            <div className="form-text text-danger text-start fs-7 mb-2">
              {errorMsg.password}
            </div>
          )}

          <select
            name="role"
            className={`form-select form-select-sm mb-2 ${
              errorMsg.role && "border-danger bg-lightRed"
            }`}
            onChange={handleChange}
          >
            <option defaultValue>Select Role</option>
            <option value="admin">Administrators</option>
            <option value="consultant">Consultant</option>
            <option value="client">Client</option>
          </select>
          {errorMsg.role && (
            <div className="form-text text-danger text-start fs-7 mb-2">
              {errorMsg.role}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-outline-primary btn-sm"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign up"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
