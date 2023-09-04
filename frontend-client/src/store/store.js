import { configureStore } from "@reduxjs/toolkit";

import uiSlice from "./ui-slice";

// create Redux store to transmit data
const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
});

export default store;
