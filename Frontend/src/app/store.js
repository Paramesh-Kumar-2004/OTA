import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import { otaApi } from '../api/api'
import usersReducer from '../features/Users/UsersSlice'
import vehicalReducer  from "../features/Vehicals/VehicalsSlice";
import SoftwareReducer from '../features/Software/SoftwareSlice';
import CampaignReducer from '../features/Campaign/CampaignSlice'

export const store = configureStore({
    reducer:{
        [otaApi.reducerPath]:otaApi.reducer,
        "users":usersReducer,
        "vehicals": vehicalReducer,
        "software": SoftwareReducer,
        "campaign": CampaignReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(otaApi.middleware),
  })

setupListeners(store.dispatch)


 