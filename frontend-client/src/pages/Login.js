import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { SERVER_URL } from "../data/api";

const initValues = { email: "", password: "" };

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formLogin, setFormLogin] = useState(initValues);
  const [errorMsg, setErrorMsg] = useState(initValues);

  const handleChange = (e) => {
    setFormLogin((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const loading = useSelector((state) => state.ui.loading);

  // post login
  const postLogin = async () => {
    dispatch(uiActions.loading(true));
    try {
      const res = await fetch(`${SERVER_URL}/auth/login`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify(formLogin),
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
        dispatch(uiActions.status(data));
        navigate("/");
      }
      dispatch(uiActions.loading(false));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(initValues);
    postLogin();
  };

  return (
    <Container
      className="text-center py-5 mt-6"
      style={{
        backgroundImage: `url(${require("../data/banner1.jpg")})`,
        backgroundPositionX: "center",
      }}
    >
      <Container
        className="bg-white rounded-4 login--box"
        style={{ width: "50%" }}
      >
        <h1 className="py-5 fw-normal">Log In</h1>

        {/* sign in form */}
        <Form onSubmit={handleSubmit} style={{ margin: "auto 3rem" }}>
          <Form.Label className="w-100 mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              className={`fst-normal rounded-0 p-3 ${
                errorMsg.email && "border-danger bg-lightRed"
              }`}
              value={formLogin.email}
              onChange={handleChange}
              required
            />
            {errorMsg.email && (
              <div className="form-text text-danger text-start">
                {errorMsg.email}
              </div>
            )}
          </Form.Label>

          <Form.Label className="w-100 mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              className={`fst-normal rounded-0 p-3 ${
                errorMsg.password && "border-danger bg-lightRed"
              }`}
              value={formLogin.password}
              onChange={handleChange}
              required
            />
            {errorMsg.password && (
              <div className="form-text text-danger text-start">
                {errorMsg.password}
              </div>
            )}
          </Form.Label>

          <Button
            variant="dark"
            type="submit"
            className="rounded-0 w-100 fst-normal py-3 my-5"
            disabled={
              Object.values(formLogin).some((val) => val === "") || loading
            }
          >
            {loading ? "LOADING..." : "LOG IN"}
          </Button>
        </Form>

        <p className="d-inline-block me-2 text-secondary">Create an account?</p>
        <Link to="/signup" className="text-decoration-none d-inline-block mb-5">
          Sign up
        </Link>
      </Container>
    </Container>
  );
}

export default Login;
