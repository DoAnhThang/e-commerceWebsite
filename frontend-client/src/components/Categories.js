import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import { useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";

function Categories() {
  // dispatch actions to Redux store
  const dispatch = useDispatch();

  return (
    <Container className="text-center mb-4">
      <p className="text-secondary mb-0">CAREFULLY CREATED COLLECTIONS</p>
      <h4 className="mb-4">BROWSE OUR CATEGORIES</h4>

      <Row>
        <Col xs={12} sm={6} className="mb-4">
          <NavLink to="shop">
            <img
              src={require("../data/product_1.png")}
              alt="iphone"
              className="w-100 opacity-70-hover"
              onClick={() => dispatch(uiActions.category("iphone"))}
            />
          </NavLink>
        </Col>
        <Col xs={12} sm={6} className="mb-4">
          <NavLink to="shop">
            <img
              src={require("../data/product_2.png")}
              alt="macbook"
              className="w-100 opacity-70-hover"
              onClick={() => dispatch(uiActions.category("macbook"))}
            />
          </NavLink>
        </Col>
      </Row>

      <Row>
        <Col xs={12} sm={4} className="mb-4">
          <NavLink to="shop">
            <img
              src={require("../data/product_3.png")}
              alt="ipad"
              className="w-100 opacity-70-hover"
              onClick={() => dispatch(uiActions.category("ipad"))}
            />
          </NavLink>
        </Col>
        <Col xs={12} sm={4} className="mb-4">
          <NavLink to="shop">
            <img
              src={require("../data/product_4.png")}
              alt="watch"
              className="w-100 opacity-70-hover"
              onClick={() => dispatch(uiActions.category("watch"))}
            />
          </NavLink>
        </Col>
        <Col xs={12} sm={4} className="mb-4">
          <NavLink to="shop">
            <img
              src={require("../data/product_5.png")}
              alt="airpod"
              className="w-100 opacity-70-hover"
              onClick={() => dispatch(uiActions.category("airpod"))}
            />
          </NavLink>
        </Col>
      </Row>
    </Container>
  );
}

export default Categories;
