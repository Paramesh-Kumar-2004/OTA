import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_CONFIG } from "../Constants/Constant";



export const otaApi = createApi({
  reducerPath: "otaApi",
  baseQuery: fetchBaseQuery({
    //  baseUrl: "http://0.0.0.0:3000/api/v1/",
    baseUrl: `http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}/api/v1/`,
    credentials: "include", // Ensure this is set to include cookies
    mode: "cors",
  }),
  tagTypes: ["vehicle", "software", "campaigns"],

  endpoints: (builder) => ({

    userLogin: builder.mutation({
      query: (data) => ({
        url: "/users/login",
        method: "post",
        body: data,
      }),
    }),
    getUserList: builder.query({
      query: () => "users/getUsers",
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/users/register",
        method: "post",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: "/users/updateUser",
        method: "put",
        body: data,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "post",
        credentials: "include",
        data: {},
      }),
    }),
    deleteUser: builder.mutation({
      query: (data) => ({
        url: "/users/deleteUser",
        method: "delete",
        body: { id: data },  // Use 'body' instead of 'data' here to pass the request body
      }),
    }),



    getVehicalList: builder.query({
      query: () => "vehicle/getVehicle",
      providesTags: ["vehicle"],
    }),
    getDeletedVehicalList: builder.query({
      query: () => "vehicle/getDeletedVehicle",
      providesTags: ["vehicle"],
    }),
    registerVehical: builder.mutation({
      query: (data) => ({
        url: "/vehicle/register",
        method: "post",
        body: data,
      }),
      invalidatesTags: ["vehicle"],
    }),
    removeVehical: builder.mutation({
      query: (data) => ({
        url: "/vehicle/delete",
        method: "delete",
        body: data,
      }),
      invalidatesTags: ["vehicle"],
    }),
    updateVehicleDeleteStatus: builder.mutation({
      query: (data) => ({
        url: "/vehicle/updateVehicle", // Make sure this endpoint is correct
        method: "post",  // Use "POST" to update the status
        body: data,  // Pass the data (vin in this case)
      }),
      invalidatesTags: ["vehicle"],  // Invalidates the "vehicle" cache
    }),



    createCampaign: builder.mutation({
      query: (data) => ({
        url: "/campaign/createCampaign",
        method: "post",
        body: data,
      }),
      invalidatesTags: ["campaigns"],
    }),
    getCampaignList: builder.query({
      query: () => "/campaign/getCampaignList",
      invalidatesTags: ["campaigns"],
    }),
    getSoftwareStatus: builder.query({
      query: () => "/campaign/getsoftwarestatus",
      invalidatesTags: ["campaigns"],
    }),
    getDelCampaignList: builder.query({
      query: () => "/campaign/getDelCampaignList",
      invalidatesTags: ["campaigns"],
    }),
    deleteCampaign: builder.mutation({
      query: (data) => ({
        url: "/campaign/deleteCampaign",
        method: "delete",
        body: data,
      }),
      invalidatesTags: ["campaigns"],
    }),
    checkUpdate: builder.mutation({
      query: (data) => ({
        url: "/campaign/checkUpdate",
        method: "post",
        body: data,
      }),
    }),
    updateCampaignDeleteStatus: builder.mutation({
      query: (data) => ({
        url: "/campaign/campaignDeleteHistory",
        method: "post",
        body: data,
      }),
    }),
    softwareStatus: builder.mutation({
      query: (data) => ({
        url: "/campaign/softwarestatus",
        method: "post",
        body: data,
      }),
    }),
    updateInstallstatus: builder.mutation({
      query: (data) => ({
        url: "/campaign/CheckStatus",
        method: "post",
        body: data,
      }),
    }),



    createSoftware: builder.mutation({
      query: (data) => ({
        url: "/software/createSoftware",
        method: "post",
        body: data,
        formData: true,
      }),
      providesTags: ["software"],
    }),
    getSoftwareList: builder.query(
      {
        query: () => "/software/getSoftwareList",
        providesTags: ["software"],
      },
      []
    ),
    getDeletedSoftwareList: builder.query(
      {
        query: () => "/software/getDelSoftwareList",
        providesTags: ["software"],
      },
      []
    ),
    updateSoftwareDeleteStatus: builder.mutation({
      query: (data) => ({
        url: "/software/deleteStatus", // Make sure this endpoint is correct
        method: "post",  // Use "POST" to update the status
        body: data,  // Pass the data (vin in this case)
      }),
      invalidatesTags: ["software"],  // Invalidates the "vehicle" cache
    }),
    deleteSoftware: builder.mutation({
      query: (data) => ({
        url: "/software/deleteSoftware",
        method: "delete",
        body: data,
      }),
      providesTags: ["software"],
    }),


  }),
});

export const {
  useGetUserListQuery,
  useUpdateUserMutation,
  useLogoutUserMutation,
  useDeleteUserMutation,
  useRegisterUserMutation,
  useGetVehicalListQuery,
  useRegisterVehicalMutation,
  useRemoveVehicalMutation,
  useGetSoftwareListQuery,
  useCreateCampaignMutation,
  useCreateSoftwareMutation,
  useCheckUpdateMutation,
  useUserLoginMutation,
  useGetCampaignListQuery,
  useGetDelCampaignListQuery,
  useDeleteCampaignMutation,
  useDeleteSoftwareMutation,
  useGetDeletedSoftwareListQuery,
  useUpdateSoftwareDeleteStatusMutation,
  useGetDeletedVehicalListQuery,
  useUpdateVehicleDeleteStatusMutation,
  useUpdateCampaignDeleteStatusMutation,
  useSoftwareStatusMutation,
  useUpdateInstallstatusMutation,
  useGetSoftwareStatusQuery,
} = otaApi;



