import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { SERVER_URL } from "../data/api";

const initValues = { email: "", password: "", fullName: "", phoneNumber: "" };

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formSignup, setFormSignup] = useState(initValues);
  const [errorMsg, setErrorMsg] = useState(initValues);

  const handleChange = (e) => {
    setFormSignup((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loading = useSelector((state) => state.ui.loading);

  // put signup
  const putSignup = async () => {
    dispatch(uiActions.loading(true));
    try {
      const res = await fetch(`${SERVER_URL}/auth/signup`, {
        method: "PUT",
        body: JSON.stringify({ ...formSignup, role: "client" }),
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
        navigate("/login");
      }
      dispatch(uiActions.loading(false));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(initValues);
    putSignup();
  };

  return (
    <Container
      className="text-center py-5 mt-6"
      style={{
        backgroundImage: `url(${require("../data/banner1.jpg")})`,
        backgroundPositionX: "center",
      }}
    >
      {/* sign up form */}
      <Container
        className="bg-white rounded-4 signup--box"
        style={{ width: "50%" }}
      >
        <h1 className="py-5 fw-normal">Sign Up</h1>

        <Form onSubmit={handleSubmit} style={{ margin: "auto 3rem" }}>
          <Form.Label className="w-100 mb-3">
            <Form.Control
              type="text"
              name="fullName"
              placeholder="Full Name"
              className={`fst-normal rounded-0 p-3 ${
                errorMsg.fullName && "border-danger bg-lightRed"
              }`}
              value={formSignup.fullName}
              onChange={handleChange}
              required
            />
            {errorMsg.fullName && (
              <div className="form-text text-danger text-start">
                {errorMsg.fullName}
              </div>
            )}
          </Form.Label>

          <Form.Label className="w-100 mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              className={`fst-normal rounded-0 p-3 ${
                errorMsg.email && "border-danger bg-lightRed"
              }`}
              value={formSignup.email}
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
              value={formSignup.password}
              onChange={handleChange}
              required
            />
            {errorMsg.password && (
              <div className="form-text text-danger text-start">
                {errorMsg.password}
              </div>
            )}
          </Form.Label>

          <Form.Label className="w-100 mb-3">
            <Form.Control
              type="number"
              name="phoneNumber"
              placeholder="Phone Number"
              className={`fst-normal rounded-0 p-3 ${
                errorMsg.phoneNumber && "border-danger bg-lightRed"
              }`}
              value={formSignup.phoneNumber}
              onChange={handleChange}
              required
            />
            {errorMsg.phoneNumber && (
              <div className="form-text text-danger text-start">
                {errorMsg.phoneNumber}
              </div>
            )}
          </Form.Label>

          <Button
            variant="dark"
            type="submit"
            className="rounded-0 w-100 fst-normal py-3 my-5"
            disabled={
              Object.values(formSignup).some((val) => val === "") || loading
            }
          >
            {loading ? "LOADING..." : "SIGN UP"}
          </Button>
        </Form>

        <p className="d-inline-block me-2 text-secondary">Login?</p>
        <Link to="/login" className="text-decoration-none d-inline-block mb-5">
          Click
        </Link>
      </Container>
    </Container>
  );
}

export default Signup;
