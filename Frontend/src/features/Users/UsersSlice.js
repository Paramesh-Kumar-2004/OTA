import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allUsers: [],
};

export const UsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUsers: (state, action) => {
      state.allUsers = action.payload;
    },

    UpdateRole: (state, action) => {
      state.allUsers = state.allUsers.map((item) => {
        if (item.userEmail === action.payload.email) {
          return { ...item, role: action.payload.role };
        } else {
          return item;
        }
      });
    },
  },
});

export const { addUsers, UpdateRole } = UsersSlice.actions;

export default UsersSlice.reducer;
