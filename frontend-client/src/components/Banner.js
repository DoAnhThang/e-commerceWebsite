import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import { useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";

function Banner() {
  // dispatch actions to Redux store
  const dispatch = useDispatch();

  return (
    <Container
      className="d-flex align-items-center mb-5"
      style={{
        height: "50vh",
        backgroundImage: `url(${require("../data/banner1.jpg")})`,
        backgroundSize: "cover",
        backgroundPositionX: "65%",
      }}
    >
      <div className="banner--text">
        <p className="text-secondary">NEW INSPIRATION 2020</p>
        <h2 className="w-75 mb-3">20% OFF ON NEW SEASON</h2>
        <NavLink to="shop">
          <button
            className="btn btn-dark rounded-0 text-light fst-italic"
            onClick={() => dispatch(uiActions.category(""))}
          >
            Browse collections
          </button>
        </NavLink>
      </div>
    </Container>
  );
}

export default Banner;
