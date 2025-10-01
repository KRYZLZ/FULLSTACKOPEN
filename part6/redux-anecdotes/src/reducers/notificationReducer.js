import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setNotifications: (state, action) => {
      return action.payload;
    },
    clearNotification: () => {
      return null;
    },
  },
});

export const { clearNotification } = notificationSlice.actions;

export const setNotification = (message, time = 5) => {
  return (dispatch) => {
    dispatch(notificationSlice.actions.setNotifications({ message }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, time * 1000);
  };
};

export default notificationSlice.reducer;
