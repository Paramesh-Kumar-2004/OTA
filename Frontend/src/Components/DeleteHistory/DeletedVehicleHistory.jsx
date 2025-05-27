import React, { useEffect } from "react";
import { Box, Table, TableBody, TableCell, Typography, TableHead, TableRow, Button } from "@mui/material";
import { useGetDeletedVehicalListQuery } from "../../api/api";  // Import the hook for fetching deleted vehicles
import { enqueueSnackbar } from "notistack";  // Assuming you want to show snackbars
import { format } from 'date-fns';
import "../../style.css"
import { CSS_STYLE } from "../../Constants/Constant";


function DeletedVehicleHistory() {
  // Using the API hook to fetch deleted vehicle list
  const { data, isLoading, isError } = useGetDeletedVehicalListQuery();

  // Loading...
  // if (isLoading) {
  //   return <div style={{display:"flex"}}>
  //     <div style={{marginTop:"5px"}}>Loading</div> 
  //     <div className="spinner"></div>
  //   </div>;  // Display loading message while fetching data
  // }

  // if (isError) {
  //   enqueueSnackbar("Failed to fetch deleted vehicle data", { variant: "error" });
  //   return <div>Error fetching deleted vehicles.</div>;  // Handle API errors
  // }

  return (
    <Box sx={{ 
      marginTop: "40px",
      }}>
      <Typography variant="h6" gutterBottom>
        History
      </Typography>
      <Table>
        <TableHead sx={{ backgroundColor: "#FF4F4F" }}>
          <TableRow>
            <TableCell sx={{ color: "white" }}>VIN</TableCell>
            <TableCell sx={{ color: "white" }}>Model Year</TableCell>
            <TableCell sx={{ color: "white" }}>Model Name</TableCell>
            <TableCell sx={{ color: "white" }}>Deleted At</TableCell>
          </TableRow>
        </TableHead>
        {isLoading && (
          <div style={{ display: "flex" }}>
            <div style={{ marginTop: "5px" }}>Loading Deleted Vehicles</div>
            <div className="spinner"></div>
          </div>
        )}
        <TableBody sx={{ backgroundColor: "#FDE0E0" }}>
          {data?.data?.map((vehicle) => (
            <TableRow key={vehicle.vin}>
              <TableCell>{vehicle.vin}</TableCell>
              <TableCell>{vehicle.modelYear}</TableCell>
              <TableCell>{vehicle.modelName}</TableCell>
              <TableCell>{format(new Date(vehicle.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default DeletedVehicleHistory;


