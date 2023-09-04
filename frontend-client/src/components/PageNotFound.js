import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <Container className="text-center" style={{ margin: "10rem auto" }}>
      <h1 className="fw-semibold mb-5">An error occurred!</h1>
      <p className="mb-5">
        Could not find this page or the session has expired!
      </p>
      <div className="d-flex justify-content-between gap-4 w-50 mx-auto">
        <Link to="/">↩ Back to the Home page</Link>
        <Link to="/login">Login again ↪</Link>
      </div>
    </Container>
  );
}

export default PageNotFound;
