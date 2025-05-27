// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
// } from "@mui/material";
// // Recharts imports for BarChart
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { useGetSoftwareListQuery } from "../api/api";  // API query to get software list

// function SoftwareTrend() {
//   const { data } = useGetSoftwareListQuery(); // Fetch software list from the API
//   const [softwareList, setSoftwareList] = useState(data ? data.data : []); // Local state for software list

//   useEffect(() => {
//     if (data && data.data) {
//       setSoftwareList(data.data); // Sync the local software list with API data
//     }
//   }, [data]);

//   // Prepare data for chart (count software per day)
//   const getChartData = () => {
//     const softwarePerDay = {};

//     // Aggregate software count by the created date
//     softwareList.forEach((item) => {
//       // Format date to ISO format (YYYY-MM-DD) for consistent sorting
//       const date = new Date(item.createdAt).toISOString().split('T')[0]; // Get YYYY-MM-DD format
//       if (softwarePerDay[date]) {
//         softwarePerDay[date] += 1; // Increment the count for the date
//       } else {
//         softwarePerDay[date] = 1; // Initialize count if this is the first occurrence
//       }
//     });

//     // Convert the object into an array suitable for the chart
//     const chartData = Object.keys(softwarePerDay).map((date) => ({
//       date,
//       count: softwarePerDay[date],
//     }));

//     // Sort the data by date in ascending order
//     chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

//     return chartData;
//   };

//   // Effect to simulate new data addition (e.g., after creating software)
//   useEffect(() => {
//     // Simulate data update if new data is added (this could come from API or user action)
//     // In real use cases, this would be updated automatically when software is created or deleted.
//     const interval = setInterval(() => {
//       if (data && data.data) {
//         setSoftwareList(data.data); // Update the software list every few seconds
//       }
//     }, 5000); // Adjust interval time (e.g., every 5 seconds)

//     // Cleanup the interval when component is unmounted
//     return () => clearInterval(interval);
//   }, [data]);

//   return (
//     <Box sx={{ p: 5, pt: 2, pb: 0 }}>
//       <Paper
//         sx={{
//           pb: 0,
//           boxShadow: "none",
//           borderRadius: "0px",
//         }}
//         elevation={0}
//       >

//         {/* Software Creation Trend - Vertical Bar Chart */}
//         <Box sx={{ marginTop: "40px", width: "100%", height: "300px" }}>
//           <Typography variant="h6" paddingLeft={'20px'}>Software Trend</Typography>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={getChartData()}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {/* BarChart for vertical bars */}
//               <Bar dataKey="count" fill="pink" />
//             </BarChart>
//           </ResponsiveContainer>
//         </Box>
//       </Paper>
//     </Box>
//   );
// }

// export default SoftwareTrend;


import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
// Recharts imports for BarChart
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetSoftwareListQuery } from "../../api/api";  // API query to get software list

function SoftwareTrend() {
  const { data } = useGetSoftwareListQuery(); // Fetch software list from the API
  const [softwareList, setSoftwareList] = useState(data ? data.data : []); // Local state for software list

  useEffect(() => {
    if (data && data.data) {
      setSoftwareList(data.data); // Sync the local software list with API data
    }
  }, [data]);

  // Prepare data for chart (count software per day)
  const getChartData = () => {
    const softwarePerDay = {};

    // Aggregate software count by the created date
    softwareList.forEach((item) => {
      // Format date to ISO format (YYYY-MM-DD) for consistent sorting
      const date = new Date(item.createdAt).toISOString().split('T')[0]; // Get YYYY-MM-DD format
      if (softwarePerDay[date]) {
        softwarePerDay[date] += 1; // Increment the count for the date
      } else {
        softwarePerDay[date] = 1; // Initialize count if this is the first occurrence
      }
    });

    // Convert the object into an array suitable for the chart
    const chartData = Object.keys(softwarePerDay).map((date) => ({
      date,
      count: softwarePerDay[date],
    }));

    // Sort the data by date in ascending order
    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

    return chartData;
  };

  // Effect to simulate new data addition (e.g., after creating software)
  useEffect(() => {
    // Simulate data update if new data is added (this could come from API or user action)
    // In real use cases, this would be updated automatically when software is created or deleted.
    const interval = setInterval(() => {
      if (data && data.data) {
        setSoftwareList(data.data); // Update the software list every few seconds
      }
    }, 5000); // Adjust interval time (e.g., every 5 seconds)

    // Cleanup the interval when component is unmounted
    return () => clearInterval(interval);
  }, [data]);

  return (
    <Box sx={{ p: 5, pt: 2, pb: 0 }}>
      <Paper
        sx={{
          pb: 0,
          boxShadow: "none",
          borderRadius: "0px",
        }}
        elevation={0}
      >

        {/* Software Creation Trend - Vertical Bar Chart */}
        <Box sx={{ marginTop: "5%", width: "100%", height: "300px" }}>
          <Typography variant="h6" paddingLeft={'20px'}>Software Trend</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                // angle={90}  // Rotate labels vertically
                // textAnchor="start"  // Align the labels to start (adjust for better visibility)
                height={100}  // Adjust height to fit rotated labels
                interval={0}  // Show every label
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="pink" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}

export default SoftwareTrend;
 