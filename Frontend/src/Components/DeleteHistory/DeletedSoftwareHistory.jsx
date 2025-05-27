import React from 'react'
import { Box, Button, Table, Typography, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { format } from "date-fns";
import { useGetDeletedSoftwareListQuery } from '../../api/api';
import { enqueueSnackbar } from "notistack";  // Assuming you want to show snackbars
import "../../style.css"
import { CSS_STYLE } from '../../Constants/Constant';
import GetThemeColor from '../../Util/GetThemColor';



function DeletedSoftwareHistory() {

  // Using the API hook to fetch deleted vehicle list
  const { data, isLoading, isError } = useGetDeletedSoftwareListQuery();
  // console.log(data);  // Check the structure of the API response

  const { storedColor } = GetThemeColor();

  // if (isLoading) {
  //   return <div style={{display:"flex"}}>
  //     <div style={{marginTop:"5px"}}>Loading</div> 
  //     <div className="spinner"></div>
  //   </div>;  // Display loading message while fetching data
  // }

  // if (isError) {
  //   enqueueSnackbar("Failed to fetch deleted vehicle data", { variant: "error" });
  //   return <div>Error fetching deleted Software.</div>;  // Handle API errors
  // }

  return (
    <div>

      <Box sx={{ marginTop: "40px" }}>
        <Typography variant="h6" gutterBottom style={{ color: storedColor }}>
          History
        </Typography>
        <Table>
          <TableHead sx={{ backgroundColor: "#FF4F4F" }}>
            <TableRow>
              <TableCell style={{ color: 'white' }}>Software Name</TableCell>
              {/* <TableCell>Software ID</TableCell> */}
              <TableCell style={{ color: 'white' }}>Version</TableCell>
              <TableCell style={{ color: 'white' }}>Creation Date</TableCell>
              <TableCell style={{ color: 'white' }}>Deletion Date</TableCell>
            </TableRow>
          </TableHead>

          {isLoading && (
            <div style={{ display: "flex" }}>
              <div style={{ marginTop: "5px" }}>Loading Deleted Software</div>
              <div className="spinner"></div>
            </div>
          )}

          <TableBody sx={{ background: "#FDE0E0" }}>
            {data?.data?.map((softwares) => (
              <TableRow key={softwares.softwareId}>
                <TableCell>{softwares.softwareName}</TableCell>
                {/* <TableCell>{softwares.softwareId}</TableCell> */}
                <TableCell>{softwares.version}</TableCell>
                <TableCell>{format(new Date(softwares.createdAt), 'yyyy-MM-dd HH:mm')}</TableCell>
                <TableCell>{format(new Date(softwares.updatedAt), 'yyyy-MM-dd HH:mm')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

    </div>
  )
}

export default DeletedSoftwareHistory




// import React from 'react';
// import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
// import { format } from 'date-fns';
// import { useGetDeletedSoftwareListQuery } from '../../api/api';
// import { enqueueSnackbar } from 'notistack';  // Assuming you want to show snackbars


// function DeletedSoftwareHistory() {
//   // Using the API hook to fetch deleted software list
//   const { data, isLoading, isError } = useGetDeletedSoftwareListQuery();
//   console.log(data);  // Check the structure of the API response

//   if (isLoading) {
//     return <div>Loading...</div>;  // Display loading message while fetching data
//   }

//   if (isError) {
//     enqueueSnackbar("Failed to fetch deleted software data", { variant: "error" });
//     return <div>Error fetching deleted software.</div>;  // Handle API errors
//   }

//   // Ensure that data exists before trying to render
//   if (!data?.data || data.data.length === 0) {
//     return <div>No deleted software found.</div>;  // Handle the case where no data is found
//   }

//   return (
//     <div>
//       <Box sx={{ marginTop: '40px' }}>
//         <Table>
//           <TableHead
//             sx={{
//               backgroundColor: '#6B46C1',
//               '& th': {
//                 textAlign: 'center',
//                 color: '#fff',
//                 fontSize: '16px',
//                 fontWeight: '500',
//               },
//             }}
//           >
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Software ID</TableCell>
//               <TableCell>Version</TableCell>
//               <TableCell>Created At</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody sx={{ background: '#EFF5FF' }}>
//             {data.data.map((software) => (
//               <TableRow key={software.vin}>
//                 {/* Ensure the correct fields are used based on the structure of the response */}
//                 <TableCell>{software.name || 'N/A'}</TableCell> {/* Adjust field names as needed */}
//                 <TableCell>{software.softwareId || 'N/A'}</TableCell> {/* Adjust field names as needed */}
//                 <TableCell>{software.version || 'N/A'}</TableCell> {/* Adjust field names as needed */}
//                 <TableCell>
//                   {software.updatedAt
//                     ? format(new Date(software.updatedAt), 'yyyy-MM-dd HH:mm:ss')
//                     : 'N/A'}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Box>
//     </div>
//   );
// }

// export default DeletedSoftwareHistory;
