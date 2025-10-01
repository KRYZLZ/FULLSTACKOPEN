import { configureStore } from "@reduxjs/toolkit";
import reducer from "./anecdoteReducer";
import filterReducer from "./filterReducer";
import notificationReducer from "./notificationReducer";

const store = configureStore({
  reducer: {
    reducer: reducer,
    filter: filterReducer,
    notification: notificationReducer,
  },
});

export default store;
