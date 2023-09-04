import { useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";

function LivechatIcon() {
  // dispatch actions to Redux
  const dispatch = useDispatch();

  return (
    <div
      className="position-fixed bottom-0 end-0 bg-primary rounded-circle text-white cursor-pointer m-3 livechat-icon"
      style={{ zIndex: 100, padding: "1rem" }}
      onClick={() => dispatch(uiActions.livechat())}
    >
      <i className="fab fa-facebook-messenger" style={{ fontSize: "3rem" }}></i>
    </div>
  );
}

export default LivechatIcon;
