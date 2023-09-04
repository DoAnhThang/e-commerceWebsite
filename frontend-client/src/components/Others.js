import { Container, Row, Col } from "react-bootstrap";

function Others() {
  return (
    <Container>
      <Row className="text-center bg-light pt-5 pb-4 my-5">
        <Col md={4} xs={12} className="pb-4">
          <h4>FREE SHIPPING</h4>
          <p className="text-secondary mb-0">Free shipping worldwide</p>
        </Col>
        <Col md={4} xs={12} className="pb-4">
          <h4>24 X 7 SERVICE</h4>
          <p className="text-secondary mb-0">Free shipping worldwide</p>
        </Col>
        <Col md={4} xs={12} className="pb-4">
          <h4>FESTIVAL OFFER</h4>
          <p className="text-secondary mb-0">Free shipping worldwide</p>
        </Col>
      </Row>

      <Row className="others--email">
        <Col md={6} xs={12}>
          <h3>LET'S BE FRIENDS!</h3>
          <p className="text-secondary">
            Nisi nisi tempor consequat laboris nisi.
          </p>
        </Col>
        <Col md={6} xs={12} className="d-flex align-items-center">
          <input
            type="text"
            placeholder="Enter your email address"
            className="fst-normal form-control rounded-0 py-3 h-75"
          />
          <button className="btn btn-dark rounded-0 text-light fst-normal px-3 h-75">
            Subscribe
          </button>
        </Col>
      </Row>
    </Container>
  );
}

export default Others;
