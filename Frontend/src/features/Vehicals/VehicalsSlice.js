import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vehicalList: [],
};

export const vehicalSlice = createSlice({
  name: "vehical",
  initialState,
  reducers: {
    allVehicals: (state, action) => {
      state.vehicalList = action.payload;
    },
  },

});

export const { allVehicals } = vehicalSlice.actions;
export default vehicalSlice.reducer;
 