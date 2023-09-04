import { useSelector } from "react-redux";

import Banner from "../components/Banner";
import Categories from "../components/Categories";
import Products from "../components/Products";
import Others from "../components/Others";
import Popup from "../components/Popup";

function Home() {
  // take state data from Redux
  const showPopup = useSelector((state) => state.ui.popupIsVisible);

  return (
    <>
      <Banner />
      <Categories />
      <Products />
      <Others />
      {showPopup && <Popup />}
    </>
  );
}

export default Home;
