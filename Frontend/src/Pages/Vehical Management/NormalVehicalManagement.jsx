import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Header from "../../Components/Header/Header";
import { useGetVehicalListQuery } from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { allVehicals } from "../../features/Vehicals/VehicalsSlice";
import { CSS_STYLE } from "../../Constants/Constant";
import GetThemeColor from "../../Util/GetThemColor";
import { getTextColor } from "../../Util/GetTextColors";



function VehicalManagement() {

  const { theme } = GetThemeColor();
  const { isLoading, data } = useGetVehicalListQuery();
  const vehicalList = useSelector((state) => state.vehicals?.vehicalList || []);
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState(""); // State for filter


  const [currentPage, setCurrentPage] = useState(1);
  // const [dataPerPage, setDataPerPage] = useState(10);
  const dataPerPage = 10
  const indexoflastpost = currentPage * dataPerPage
  const indexoffirstpost = indexoflastpost - dataPerPage
  const totalpage = Math.ceil(vehicalList.length / dataPerPage)

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
  const currentData = vehicalList.slice(indexoffirstpost, indexoflastpost)


  useEffect(() => {
    if (data?.data) {
      dispatch(allVehicals(data?.data));
    }
  }, [data, dispatch]);


  return (
    <Box
      style={{
        height: "97vh",
        width: "90%",
        // background:'skyblue',
        // border: "3px solid red",
        overflowX: 'scroll',
        scrollbarWidth: 'none', // For Firefox to hide scrollbar
        // scroll:'none'
      }}
    >
      <Paper sx={{
        pb: 0,
        boxShadow: "none",
        borderRadius: "0px",
        background: 'transparent',
      }} elevation={0}
      >
        <div
          style={{
            position: 'sticky',
            top: '0',
            background: (theme === "black" || theme === null || theme === undefined) ? "black" : theme,
            zIndex: 1
          }}>
          <Header title={"Vehicle Management"} />
        </div>

        <Box sx={{ width: "100%", marginTop: "40px" }}>
          <div
            style={{
              paddingBottom: '14px'
            }}
          >
            <Button
              color="primary"
              size="large"
              value="viewVehicles"
              aria-label="viewVehicles"
              style={{
                color: theme === "black" ? "White" : getTextColor(theme),
                border: '2px solid gray',
                borderRadius: '0px',
                background: '#6946c6',
              }}
            >
              View Vehicles
            </Button>
          </div>


          <Box sx={{ marginTop: "40px" }}>
            {/* Filter Input */}

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: "end"
                // background: 'gold',
                // border: "2px solid gray"
              }}
            >
              <h3
                style={{ color: theme === "black" ? "White" : getTextColor(theme), }}
              >Search : &#160;</h3>

              <TextField
                fullWidth
                size="small"
                type="text"
                id="search"
                placeholder="Enter Model Name"
                required
                style={{
                  width: "auto",
                  borderRadius: "8px",
                  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                  border: "2px solid gray",
                  margin: '5px'
                }}
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>

            <Table>
              <TableHead
                sx={{
                  borderRadius: "8px 8px 0px 0px",
                  color: "#FFF",
                  zIndex: 1,
                  "& th": {
                    background: CSS_STYLE.Table_Head,
                    textAlign: "center",
                    color: theme === "black" ? "White" : getTextColor(theme),
                    fontSize: "14px",
                    fontWeight: "500",
                    letterSpacing: "1.32px",
                    border: "1px solid #6B46C1",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "120px",
                  },
                }}
              >
                <TableRow>
                  <TableCell>VIN</TableCell>
                  <TableCell>Brand Name</TableCell>
                  <TableCell>Model Name</TableCell>
                  <TableCell>Model Year</TableCell>
                </TableRow>
              </TableHead>

              {isLoading && (
                <div style={{ display: "flex" }}>
                  <div style={{ marginTop: "5px" }}>Loading Vehicles</div>
                  <div className="spinner"></div>
                </div>
              )}

              <TableBody sx={{ backgroundColor: CSS_STYLE.Table_Body }}>
                {currentData
                  .filter((vehicle) => vehicle.modelName.toLowerCase().includes(filterName.toLowerCase()))
                  .map((vehicle) => (
                    <TableRow key={vehicle.vin}
                      sx={{
                        "&:last-child tr": {
                          borderRadius: "0px 0px 10px 10px",
                        },
                        "& td": {
                          background: CSS_STYLE.Table_Body,
                          margin: "1px",
                          borderRight: "1px solid #fff",
                          borderBottom: "1px solid #fff",
                          textAlign: "center",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    >
                      <TableCell>{vehicle.vin}</TableCell>
                      <TableCell>{vehicle.brandName}</TableCell>
                      <TableCell>{vehicle.modelName}</TableCell>
                      <TableCell>{vehicle.modelYear}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Paper >

      <div className={theme === "black" ? "darkpaginationbar" : "lightpaginationbar"}>
        <button
          className="ButtonPrevious"
          variant="contained"
          color="primary"
          onClickCapture={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >Previous</button>

        {pageNumbers.map((page) => (
          <h2
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

      {/* <DeletedVehicleHistory /> */}

    </Box >
  );
}

export default VehicalManagement;

