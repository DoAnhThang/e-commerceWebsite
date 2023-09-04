import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import footerData from "../data/footer";

function Footer() {
  return (
    <Container fluid className="bg-dark mt-5">
      <Container className="pt-5">
        <Row className="pb-4 flex-wrap cg-1">
          {/* render data from footerData */}
          {footerData.map((col) => (
            <Col key={col.id} className="pb-4">
              <p className="mb-3 d-block text-decoration-none text-white fs-4">
                {col.title}
              </p>

              {col.values.map((value) => (
                <Link
                  key={value}
                  to="#"
                  className="mb-2 d-block text-decoration-none text-white"
                >
                  {value}
                </Link>
              ))}
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

export default Footer;
