import { Container } from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { SERVER_URL } from "../data/api";

function Products() {
  // dispatch actions to Redux
  const dispatch = useDispatch();

  // take products data from Redux store
  const products = useSelector((state) => state.ui.products);

  // filter to display only 8 products
  let trendingProducts = [];
  if (products.length > 8) {
    trendingProducts = products.slice(0, 8);
  } else trendingProducts = products;

  return (
    <Container className="mb-5">
      <div className="ms-2">
        <p className="text-secondary mb-0">MADE THE HARD WAY</p>
        <h4 className="mb-4">TOP TRENDING PRODUCTS</h4>
      </div>

      <div
        className="d-grid gap-3 trending--products"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {/* render products data */}
        {trendingProducts.map((prod) => (
          <div key={prod._id} className="text-center animation-zoom-1000">
            <img
              src={`${
                prod.img1.includes("images")
                  ? `${SERVER_URL}/${prod.img1}`
                  : prod.img1
              }`}
              alt={prod.name}
              className="d-block w-100 opacity-70-hover cursor-pointer mb-3"
              onClick={() => {
                dispatch(
                  uiActions.popup({
                    popupIsVisible: true,
                    clickedId: prod._id,
                  })
                );
              }}
            />
            <h6>{prod.name}</h6>
            <p className="text-secondary">
              {prod.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default Products;
