import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  campaign: {},
};

export const CampaignSlice = createSlice({
    name: "campaign",
    initialState,
    reducers: {
      addCampaign: (state, action) => {
        state.allUsers = action.payload;
      },
    }
})

export const { addCampaign } = CampaignSlice.actions;

export default CampaignSlice.reducer;




 