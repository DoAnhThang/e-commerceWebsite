/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getLoginStatus, getProducts, getCart } from "./store/ui-slice";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import PageNotFound from "./components/PageNotFound";
import LivechatIcon from "./components/LivechatIcon";
import Livechat from "./components/Livechat";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import History from "./pages/History";

function App() {
  // dispatch actions to Redux
  const dispatch = useDispatch();

  // take state data from Redux store
  const isAuth = useSelector((state) => state.ui.isAuth);
  const showLivechat = useSelector((state) => state.ui.livechatIsVisible);

  // dispatch fetch products data action
  useEffect(() => {
    dispatch(getLoginStatus());
    dispatch(getProducts());
  }, []);

  if (isAuth) dispatch(getCart());

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/detail/:productId" element={<Detail />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />

        {isAuth && (
          <>
            <Route path="/history" element={<History />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </>
        )}
      </Routes>
      <LivechatIcon />
      {showLivechat && <Livechat />}
      <Footer />
    </>
  );
}

export default App;
