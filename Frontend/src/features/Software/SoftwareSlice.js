import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  softwareList: [],
};

export const SoftwareSlice = createSlice({
    name: "software",
    initialState,
    reducers: {
      addSoftware: (state, action) => {
        state.software = action.payload;
      },
      getAllSoftwares :(state,action)=>{
        state.softwareList = action.payload
      }
    }
})

export const { addSoftware, getAllSoftwares } = SoftwareSlice.actions;

export default SoftwareSlice.reducer;