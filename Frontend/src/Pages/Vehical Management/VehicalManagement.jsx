import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormLabel,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Header from "../../Components/Header/Header";
import { useGetVehicalListQuery, useRemoveVehicalMutation, useRegisterVehicalMutation, useUpdateVehicleDeleteStatusMutation } from "../../api/api";
import { enqueueSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { allVehicals } from "../../features/Vehicals/VehicalsSlice";
// import DeletedVehicleHistory from "../../Components/DeleteHistory/DeletedVehicleHistory";
import { CSS_STYLE } from "../../Constants/Constant";
import GetThemeColor from "../../Util/GetThemColor";
import { getTextColor } from "../../Util/GetTextColors";



function VehicalManagement() {

  const { theme } = GetThemeColor();
  const { isLoading, data } = useGetVehicalListQuery();
  const [registerVehical] = useRegisterVehicalMutation();
  const [updateVehicleDeleteStatus] = useUpdateVehicleDeleteStatusMutation();
  const [removeVehical] = useRemoveVehicalMutation();
  const vehicalList = useSelector((state) => state.vehicals?.vehicalList || []);
  const dispatch = useDispatch();
  const [alignment, setAlignment] = useState("addVehicle");
  const [vin, setVin] = useState("");
  const [modelYear, setModelYear] = useState("");
  const [modelName, setModelName] = useState("");
  const [brandName, setBrandName] = useState("")
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

  const handleAddVehicle = (event) => {
    event.preventDefault();
    registerVehical({ vin, modelYear, modelName, brandName })
      .unwrap()
      .then((res) => {
        enqueueSnackbar("Vehicle added successfully", {
          variant: "success",
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          autoHideDuration: 2000,
        });
        dispatch(allVehicals([...vehicalList, { vin, modelYear, modelName }]));
        handleReset();
      })
      .catch((err) => {
        enqueueSnackbar("Failed to add vehicle", {
          variant: "error",
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          autoHideDuration: 2000,
        });
      });
  };

  function handleVehicleDelStatus(vin) {
    updateVehicleDeleteStatus({ vin })
      .unwrap()
      .then(() => {
        enqueueSnackbar("Vehicle Status Changed Successfully", {
          variant: "success",
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
        dispatch(
          allVehicals(
            vehicalList.map((item) =>
              item.vin === vin ? { ...item, vehicleDelHistory: "Deleted" } : item
            )
          )
        );
      })
      .catch(() => {
        enqueueSnackbar("Failed To Change Status", {
          variant: "error",
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      });
  }

  function handleDelete(vin) {
    removeVehical({ vin })
      .unwrap()
      .then((res) => {
        enqueueSnackbar('Vehicle Deleted Successfully', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        })
      }).catch((err) => {
        enqueueSnackbar(err.data.error, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        })
      })
  };

  const handleReset = () => {
    setVin("");
    setBrandName("");
    setModelName("");
    setModelYear("");
  };

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

        <Box sx={{ width: "100%", marginTop: "26px" }}>
          <div
            style={{
              paddingBottom: '10px',
              display: 'flex',
              justifyContent: "space-between"
            }}
          >
            <div>

              <Button
                color="primary"
                size="large"
                value="addVehicle"
                onClick={() => setAlignment("addVehicle")}
                aria-label="addVehicle"
                style={{
                  color: theme === "black" ? "White" : getTextColor(theme),
                  border: '2px solid gray',
                  borderRadius: '0px',
                  width: '160px',
                  background: alignment === "addVehicle" ? '#6946c6' : "",
                }}
              >
                Add Vehicle
              </Button>
              <Button
                color="primary"
                size="large"
                value="viewVehicles"
                onClick={() => setAlignment("viewVehicles")}
                aria-label="viewVehicles"
                style={{
                  color: theme === "black" ? "White" : getTextColor(theme),
                  border: '2px solid gray',
                  borderRadius: '0px',
                  width: '160px',
                  background: alignment === "viewVehicles" ? '#6946c6' : "",
                }}
              >
                View Vehicles
              </Button>
            </div>

            {alignment === "viewVehicles" && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: "end",
                  maxWidth: '50%'
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
            )}

          </div>

          {alignment === "addVehicle" ? (
            <form onSubmit={handleAddVehicle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: 'space-between',
                  width: '80vw',
                  paddingTop: '24px',
                  flexWrap: 'wrap',
                  gap: '24px'
                  // background: 'pink',
                }}
              >

                <div
                  style={{
                    width: "40%",
                    minWidth: '200px',
                  }}
                >
                  <FormLabel
                    style={{
                      color: theme === "black" ? "White" : getTextColor(theme),
                      fontWeight: 'bolder',
                      fontSize: '14px',
                    }}>VIN :</FormLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    required
                  />
                </div>

                <div style={{ width: "40%", minWidth: '200px', }}>
                  <FormLabel style={{
                    color: theme === "black" ? "White" : getTextColor(theme),
                    fontWeight: 'bolder',
                    fontSize: '14px',
                  }}>Brand Name :</FormLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ width: "40%", minWidth: '200px', }}>
                  <FormLabel style={{
                    color: theme === "black" ? "White" : getTextColor(theme),
                    fontWeight: 'bolder',
                    fontSize: '14px'
                  }}>Model Name :</FormLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ width: "40%", minWidth: '200px', }} >
                  <FormLabel style={{
                    color: theme === "black" ? "White" : getTextColor(theme),
                    fontWeight: 'bolder',
                    fontSize: '14px'
                  }}>Model Year :</FormLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={modelYear}
                    onChange={(e) => setModelYear(e.target.value)}
                    required
                  />
                </div>

              </div>

              <div style={{ display: "flex", gap: "2%", justifyContent: "right", padding: '3%', minWidth: '200px', }}>
                <Button type="submit" variant="contained">
                  OK
                </Button>
                <Button onClick={handleReset} type="reset" variant="contained" color="secondary">
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Box sx={{ marginTop: "26px" }}>
              {/* Filter Input */}

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
                    <TableCell>Action</TableCell>
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
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => {
                              const confirmDelete = window.confirm(`Are You Sure You Want To Delete ${vehicle.vin} ?`);
                              if (confirmDelete) {
                                // handleVehicleDelStatus(vehicle.vin);
                                handleDelete(vehicle.vin)
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Paper >

      {alignment === "viewVehicles" && (

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
      )
      }
      {/* {
        alignment !== "addVehicle" && (
          <DeletedVehicleHistory />
        )
      } */}
    </Box >
  );
}

export default VehicalManagement;
