import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../data/api";

const initValues = { email: "", password: "" };

function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initValues);
  const [errorMsg, setErrorMsg] = useState(initValues);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // put signup or post login
  const postLogin = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log("postLogin: ", data);
      for (const key in data) {
        if (data[key].msg) {
          setErrorMsg((prev) => ({ ...prev, [key]: data[key].msg }));
        }
      }
      if (data.isAuth) {
        setIsAuth(data);
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
    postLogin();
  };

  return (
    <>
      <h4 className="text-dark fw-bold mb-4">Log In</h4>

      <div
        className="bg-white w-25 rounded-3 px-4 py-2"
        style={{ minWidth: "14.5rem" }}
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

          <button
            type="submit"
            className="btn btn-outline-primary btn-sm"
            disabled={loading}
          >
            {loading ? "Loading..." : "Log in"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
