import { Container } from "react-bootstrap";

import ProductList from "../components/ProductList";

function Shop() {
  return (
    <Container>
      <div className="bg-light d-flex justify-content-between align-items-center p-5">
        <h3 className="mb-0">SHOP</h3>
        <h6 className="text-secondary mb-0">SHOP</h6>
      </div>

      {/* display product categories */}
      <ProductList />
    </Container>
  );
}

export default Shop;
