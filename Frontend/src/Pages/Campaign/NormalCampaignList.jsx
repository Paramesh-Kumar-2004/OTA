import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Paper,
} from "@mui/material";
import {
  useGetCampaignListQuery,
  useSoftwareStatusMutation,
} from "../../api/api";
import "../../Styles/CampaignInstallDetails.css"
import { CSS_STYLE } from "../../Constants/Constant";
import GetThemeColor from "../../Util/GetThemColor";
import Header from "../../Components/Header/Header";
import dayjs from "dayjs";
import "../../Styles/Paginationbar.css"
import "../../Styles/CampaignInstallDetails.css"
import { getTextColor } from "../../Util/GetTextColors";



function NormalCampaignList() {

  // Fetch campaign data
  const { theme } = GetThemeColor();

  const { isLoading, data, refetch } = useGetCampaignListQuery();
  const [campaignList, setCampaignList] = useState(data?.data || []); // Local state for campaigns
  const [filterStatus, setFilterStatus] = useState("All"); // State to store selected filter value
  const [CampaignInstallationDetails, setCampaignInstallationDetails] = useState(false)
  const [SoftwareStatus] = useSoftwareStatusMutation();

  const [campaignDetails, setCampaignDetails] = useState(null);  // To store fetched campaign details

  const [currentPage, setCurrentPage] = useState(1); // Current Page
  // const [dataPerPage, setDataPerPage] = useState(10); // Data Per Page
  const dataPerPage = 10

  const indexoflastpost = currentPage * dataPerPage
  const indexoffirstpost = indexoflastpost - dataPerPage

  const totalpage = Math.ceil(campaignList.length / dataPerPage)


  const pages = Array.from({ length: totalpage }, (_, index) => index + 1);
  // Pagination logic
  const pagesToShow = 5; // Number of page buttons to show before and after the current page
  let pageNumbers = [];

  if (totalpage <= pagesToShow) {
    pageNumbers = pages; // If total pages are less than or equal to the pages to show, display all pages
  } else {
    if (currentPage <= pagesToShow) {
      pageNumbers = [...Array(pagesToShow).keys()].map((i) => i + 1); // Show pages 1-5 if current page is at the start
      pageNumbers.push("..."); // Show ellipsis after the last visible page
      pageNumbers.push(totalpage); // Always show the last page
    } else if (currentPage > totalpage - pagesToShow) {
      pageNumbers = [1]; // Always show the first page
      pageNumbers.push("..."); // Show ellipsis before the first visible page
      pageNumbers.push(...pages.slice(totalpage - pagesToShow)); // Show the last few pages
    } else {
      pageNumbers = [1]; // Always show the first page
      pageNumbers.push("..."); // Show ellipsis after the first visible page
      pageNumbers.push(...pages.slice(currentPage - Math.floor(pagesToShow / 2) - 1, currentPage + Math.floor(pagesToShow / 2)));
      pageNumbers.push("..."); // Show ellipsis before the last visible page
      pageNumbers.push(totalpage); // Always show the last page
    }
  }

  function handleCampaignDetailsOpen(campaignID) {
    // refetch()
    setCampaignInstallationDetails(true);

    // Fetch campaign details using the backend API
    SoftwareStatus({ CampaignID: campaignID })
      .then((res) => {
        setCampaignDetails(res);  // Store the fetched data in state
        // console.log("Fetched campaign details:", res.data.Software_Status);  // Log the fetched details
        // res.data.Software_Status.map((item) => {
        //   console.log(item.id)
        // })
      })
      .catch((error) => {
        console.error("Error fetching campaign details:", error);
      });
  }

  function handleCampaignDetailsClose() {
    setCampaignInstallationDetails(false)
  }

  useEffect(() => {
    // If data is available, update the state with the fetched data
    if (data && data.data) {
      console.log("Fetched data:", data.data);
      setCampaignList(data.data); // Update campaign list based on fetched data
    }
  }, [data, refetch, currentPage]); // The effect depends on `data` and `refetch`

  // Close The Campaign Details Popup Box, If I Click OutSide Of The Box.
  useEffect(() => {
    const handleClickOutside = (event) => {
      const detailsElement = document.getElementById("campaign_detail_main");
      if (detailsElement && !detailsElement.contains(event.target)) {
        handleCampaignDetailsClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <div style={{ display: "flex" }}>
      <div style={{ marginTop: "5px" }}>Loading</div>
      <div className="spinner"></div>
    </div>;  // Display loading message while fetching data
  }

  // Filter campaign list by the selected update status
  const filteredCampaignList =
    filterStatus === "All"
      ? campaignList
      : campaignList.filter((item) => item.status === filterStatus);

  const currentData = filteredCampaignList.slice(indexoffirstpost, indexoflastpost)


  return (

    <Box
      style={{
        height: "97vh",
        width: "90%",
        // border: "3px solid red",
        overflowX: 'scroll',
        scrollbarWidth: 'none', // For Firefox to hide scrollbar
        scrollBehavior: 'smooth',
      }}
    >
      <Paper sx={{ boxShadow: "none", borderRadius: "0px", marginBottom: "40px", background: 'transparent' }} elevation={0}>
        <div style={{
          position: 'sticky',
          top: '0%',
          background: (theme === "black" || theme === null || theme === undefined) ? "black" : theme,
          zIndex: 1
        }}>
          <Header title={"Campaign Management"} />
        </div>
        <Box sx={{ width: "100%", marginTop: "40px" }}>

          <Button
            color="primary"
            size="large"
            value="campaignList"
            aria-label="campaignList"
            style={{
              color: theme === "black" ? "White" : getTextColor(theme),
              border: '2px solid gray',
              borderRadius: '0px',
              background: '#6946c6',
            }}
          >Campaign list</Button>

          <div style={{ marginTop: "4%" }}>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              margin: '3px',
              justifyContent: 'right',
              // background:'red',
              alignItems: 'center'
            }}>
              <h4
                style={{ color: theme === "black" ? "White" : getTextColor(theme), }}
              >Filter By Campaign Status : &#160;</h4>
              <FormControl
                style={{
                  width: "auto",
                  minWidth: '126px',
                  borderRadius: "8px",
                  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                  // border: "2px solid gray"
                }}>
                <InputLabel
                  id="status-select-label"
                  style={{
                    width: '100%',
                    display: 'flex',
                    color: theme === "black" ? "White" : getTextColor(theme),
                    justifyContent: 'flex-start', // Aligns the label to the left
                    zIndex: '-1'
                  }}
                >
                  Select
                </InputLabel>

                <Select
                  labelId="status-select-label"
                  value={filterStatus} // Ensure value is linked to state
                  label="Filter"
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    // console.log(e.target.value); // Debugging to ensure the value updates
                  }}
                  style={{
                    border: '2px solid white',
                    color: theme === "black" ? "White" : getTextColor(theme),
                    backgroundColor: "transparent", // Ensure it's transparent or adjust as needed
                    width: "100%", // Takes the full width of FormControl
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: theme === "black" ? "#444" : "#f5f5f5",  // Background color of the dropdown menu
                        color: theme === "black" ? "White" : getTextColor(theme),  // Text color of the dropdown menu
                        // border: '2px solid gray'
                      },
                    },
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Success" >Success</MenuItem>
                  <MenuItem value="Partial Success" >Partially Successful</MenuItem>
                  <MenuItem value="Cancelled" >Cancelled</MenuItem>
                  <MenuItem value="Client Not Connect" >Ongoing</MenuItem>
                  <MenuItem value="Failed" >Failed</MenuItem>
                </Select>
              </FormControl>
            </div>

            <Table sx={{ tableLayout: "fixed", width: "100%" }}>
              <TableHead
                sx={{
                  borderRadius: "8px 8px 0px 0px",
                  background: CSS_STYLE.Table_Head,
                  "& th": {
                    textAlign: "center",
                    color: theme === "black" ? "White" : getTextColor(theme),
                    fontSize: "14px",
                    fontWeight: "500",
                    border: `1px solid #6B46C1`,
                    whiteSpace: "normal", // Allows text to wrap
                    wordWrap: "break-word", // Wraps long words
                    overflow: "hidden", // Hides overflowing content
                    textOverflow: "ellipsis", // Shows ellipsis when content overflows
                    padding: "12px"
                  },
                }}
              >
                <TableRow>
                  {/* <TableCell>Campaign ID</TableCell> */}
                  <TableCell>Campaign Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Campaign Type</TableCell>
                  {/* <TableCell>Update Type</TableCell> */}
                  <TableCell>Software Name</TableCell>
                  <TableCell>VIN</TableCell>
                  <TableCell>Campaign Status</TableCell>
                  <TableCell>Details</TableCell>
                  {/* <TableCell>Action</TableCell> */}
                </TableRow>
              </TableHead>

              <TableBody>
                {/* {filteredCampaignList.map((item) => ( */}
                {currentData.map((item) => (

                  <TableRow
                    key={item.campaignID}
                    sx={{
                      "&:last-child tr": {
                        borderRadius: "0px 0px 10px 10px",
                      },
                      height: "50px", // Set a fixed height for all rows
                      "& td": {
                        background: CSS_STYLE.Table_Body,
                        margin: "1px",
                        borderRight: "1px solid #fff",
                        borderBottom: "1px solid #fff",
                        textAlign: "center",
                        overflow: "hidden", // Hide content overflow in body
                        textOverflow: "ellipsis", // Truncate content with ellipsis if necessary
                        whiteSpace: "nowrap", // Prevent text from wrapping
                        maxWidth: "120px", // Optional: Set max width for cells
                        cursor: 'default',
                        padding: "10px"
                      }
                    }}
                  >
                    {/* <TableCell title={item.id}>{item.id}</TableCell> */}
                    <TableCell title={item.campaignName}>{item.campaignName}</TableCell>
                    <TableCell title={item.campaignDescription}>{item.campaignDescription}</TableCell>
                    <TableCell title={item.campaignType}>{item.campaignType}</TableCell>
                    <TableCell title={item.softwareName}>{item.softwareName}</TableCell>

                    {/* <TableCell title={item.vehicle}>{item.vehicle.length === 1 ? item.vehicle : "See Details"}</TableCell> */}
                    {item.vehicle.length === 1 && (
                      <TableCell title={item.vehicle}>{item.vehicle}</TableCell>
                    )}
                    {item.vehicle.length > 1 && (
                      <TableCell title={item.vehicle}
                      >View More</TableCell>
                    )}
                    <TableCell title={item.status}>
                      {item.status === "Client Not Connect" ? "Ongoing" : item.status}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => { handleCampaignDetailsOpen(item.campaignID); }}
                      >
                        Details
                      </Button>
                    </TableCell>

                    {/* <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          const confirmDelete = window.confirm(
                            `Are You Sure You Want To Delete ${item.campaignName} ?`
                          );
                          if (confirmDelete) {
                            handleCampaignDeleteStatus(item.campaignID);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell> */}

                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* In Table View */}

            {CampaignInstallationDetails && campaignDetails && (
              <div className="mainbox">

                <div id="campaign_detail_main"
                  style={{
                    // background: theme === "black" ? 'red' : "#ededed",
                    background: theme === "black" ? 'rgb(58, 57, 57)' : "#ededed",
                  }}
                >
                  <div id="Campaign_Details_Data" >
                    <table>
                      <thead style={{
                        background: CSS_STYLE.Table_Head,
                      }}>
                        <tr style={{ color: theme === "black" ? "White" : getTextColor(theme) }}>
                          <th className="THSoftwareStatusDetailPopup" >Campaign ID</th>
                          <th className="THSoftwareStatusDetailPopup" >Software ID</th>
                          <th className="THSoftwareStatusDetailPopup" >Vehicle VIN</th>
                          <th className="THSoftwareStatusDetailPopup" >Client Status</th>
                          <th className="THSoftwareStatusDetailPopup" ><span id="THSoftwareStatusDetailDate">Date</span></th>
                        </tr>
                      </thead>
                      <tbody id="Campaign_Details_Data_Body">
                        {campaignDetails.data.Software_Status.map((status, index) => (
                          <tr style={{ color: theme === "black" ? "White" : getTextColor(theme) }} key={index}>
                            <td className="TBSoftwareStatusDetailPopup" >{campaignDetails.data.Software_Status[0].campaignID}</td>
                            <td className="TBSoftwareStatusDetailPopup" >{campaignDetails.data.Software_Status[0].SoftwareID}</td>
                            <td className="TBSoftwareStatusDetailPopup" >{status.Vehicle_VIN}</td>
                            <td className="TBSoftwareStatusDetailPopup" >{status.Status}</td>
                            {/* <td className="TBSoftwareStatusDetailPopup">{format(new Date(status.ClientNotConnect), 'dd:MM:yyyy')}</td> */}

                            {status.Status === "Client Not Connect" && (
                              <td className="TBSoftwareStatusDetailPopup">{dayjs(status.ClientNotConnect).format("DD : MM : YYYY")}</td>
                            )}
                            {status.Status === "Success" && (
                              <td className="TBSoftwareStatusDetailPopup">{dayjs(status.Success).format("DD : MM : YYYY")}</td>
                            )}
                            {status.Status === "Cancelled" && (
                              <td className="TBSoftwareStatusDetailPopup">{dayjs(status.Cancelled).format("DD : MM : YYYY")}</td>
                            )}
                            {status.Status === "Failed" && (
                              <td className="TBSoftwareStatusDetailPopup">{dayjs(status.Failed).format("DD : MM : YYYY")}</td>
                            )}

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      // background:'red',
                      paddingBottom: '4px',
                      justifyContent: "space-around",
                    }}>
                    {/* {campaignDetails.data.Software_Status[0].Status.toLowerCase() === "client not connect" && ( */}

                    <p><button id="CampaignStatusCloseButton"
                      onClick={handleCampaignDetailsClose}>Close</button></p>
                  </div>
                </div>
              </div>
            )}

            <div className={theme === "black" ? "darkpaginationbar" : "lightpaginationbar"}>
              <button
                className="ButtonPrevious"
                variant="contained"
                color="primary"
                onClickCapture={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >Previous</button>

              {pageNumbers.map((page, index) => (
                <h2 key={index}
                  style={{ color: currentPage === page ? "Blue" : "" }}
                  className="pagecountnumber"
                  onClick={() => {
                    // Only set currentPage if the page is not an ellipsis
                    if (page !== "...") {
                      setCurrentPage(page);
                    }
                  }}
                >{page}</h2>
              ))}

              <button
                className="ButtonNext"
                variant="contained"
                color="primary"
                onClickCapture={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalpage}
              >Next</button>
            </div>
            {/* Use the DeletedCampaignHistory component */}
            {/* <DeletedCampaignHistory deletedCampaigns={deletedCampaigns} /> */}
          </div >
          {/* </div> */}
        </Box>
      </Paper >
    </Box >
  );
}

export default NormalCampaignList;

