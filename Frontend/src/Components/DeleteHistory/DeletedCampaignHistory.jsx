import React, { useState, useEffect } from "react";
import { Box, Button, Table, Typography, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { format } from "date-fns";
import { useGetDelCampaignListQuery, useDeleteCampaignMutation } from "../../api/api";
import { enqueueSnackbar } from "notistack"; // Assuming you want to show snackbars
import "../../style.css";
import { CSS_STYLE } from "../../Constants/Constant";
import GetThemeColor from "../../Util/GetThemColor";

function DeletedCampaignHistory() {

  const { storedBackground, storedColor } = GetThemeColor();

  // Using the API hook to fetch deleted vehicle list
  const { data, isLoading, isError, refetch } = useGetDelCampaignListQuery();
  const [deleteCampaign] = useDeleteCampaignMutation();

  // Listen for custom events to trigger updates
  useEffect(() => {
    const handleCampaignDeleted = (event) => {
      console.log("Campaign deleted, updating list...");
      refetch(); // Refresh deleted campaign list
    };

    window.addEventListener("campaignDeleted", handleCampaignDeleted);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("campaignDeleted", handleCampaignDeleted);
    };
  }, [refetch]);

  // const handleCampaignDelete = (id) => {
  //   deleteCampaign({ campaignID: id })
  //     .unwrap()
  //     .then(() => {
  //       enqueueSnackbar("Campaign Deleted Permanent Successfully", {
  //         variant: "success",
  //         anchorOrigin: {
  //           vertical: "top",
  //           horizontal: "center",
  //         },
  //         autoHideDuration: 2000,
  //       });
  //     })
  //     .catch(() => {
  //       enqueueSnackbar("Could not delete the campaign", {
  //         variant: "error",
  //         anchorOrigin: {
  //           vertical: "top",
  //           horizontal: "center",
  //         },
  //         autoHideDuration: 2000,
  //       });
  //     });
  // };

  // if (isLoading) {
  //   return (
  //     <div style={{ display: "flex" }}>
  //       <div style={{ marginTop: "5px" }}>Loading</div>
  //       <div className="spinner"></div>
  //     </div>
  //   ); // Display loading message while fetching data
  // }

  if (isError) {
    return <div>Error fetching deleted campaigns.</div>;
  }

  return (
    <div>
      <Box sx={{ marginTop: "40px" }}>
        <Typography variant="h6" gutterBottom style={{ color: storedColor }}>
          History
        </Typography>
        <Table>
          <TableHead sx={{ backgroundColor: "#FF4F4F" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Campaign Name</TableCell>
              <TableCell sx={{ color: "white" }}>Vehicle VIN</TableCell>
              <TableCell sx={{ color: "white" }}>Software Name</TableCell>
              <TableCell sx={{ color: "white" }}>Update Status</TableCell>
              <TableCell sx={{ color: "white" }}>Creation Date</TableCell>
              <TableCell sx={{ color: "white" }}>Deletion Date</TableCell>
              {/* <TableCell sx={{ wcolor: "white" }}>Action</TableCell> */}
            </TableRow>
          </TableHead>

          {isLoading && (
            <div style={{ display: "flex" }}>
              <div style={{ marginTop: "5px" }}>Loading Deleted Vehicles</div>
              <div className="spinner"></div>
            </div>
          )}

          <TableBody sx={{ background: "#FDE0E0" }}>
            {data?.data?.map((campaign) => (
              <TableRow key={campaign.campaignID}>
                <TableCell>{campaign.campaignName}</TableCell>
                <TableCell>{campaign.vehicle}</TableCell>
                <TableCell>{campaign.softwareName}</TableCell>
                <TableCell>{campaign.status}</TableCell>
                <TableCell>{format(new Date(campaign.createdAt), "yyyy-MM-dd HH:mm")}</TableCell>
                <TableCell>{format(new Date(campaign.updatedAt), "yyyy-MM-dd HH:mm")}</TableCell>
                {/* <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCampaignDelete(campaign.campaignID)}
                  >
                    Delete
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </div>
  );
}

export default DeletedCampaignHistory;

