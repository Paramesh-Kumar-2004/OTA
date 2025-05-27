import React, { useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Modal,
  IconButton,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { v4 as uuidv4 } from "uuid";
import Header from "../../Components/Header/Header";
import { CAMPAIGN_TYPE, CSS_STYLE, UPDATE_TYPE } from "../../Constants/Constant";
import {
  useCreateCampaignMutation,
  useGetCampaignListQuery,
} from "../../api/api";
import AllCampaigns from "../../Pages/Campaign/AllCampaigns";
import CloseIcon from '@mui/icons-material/Close'; // Close icon for modal
import GetThemeColor from "../../Util/GetThemColor";

import AddVehicleModal from "../../Components/New Creations/AddVehicleModal";
import SoftwareCreationModal from "../../Components/New Creations/SoftwareCreationModal";

import VehiclePopUp from "../../Components/VehiclePopUp"
import { getTextColor } from "../../Util/GetTextColors";
import SelectSoftwarePopup from "../../Components/SelectSoftwarePopup";


function Campaign() {

  const { theme } = GetThemeColor();
  const [alignment, setAlignment] = useState("createCampaign");
  const [openAddVehicleModal, setOpenAddVehicleModal] = useState(false);
  const [openCreateSoftwareModal, setOpenCreateSoftwareModal] = useState(false); // State to open Create Software Modal
  const [vehicle, setVehicle] = useState([]); // Selected vehicle VIN
  const [software, setSoftware] = useState(""); // Selected software
  const [selectedSoftware, setSelectedSoftware] = useState(false)

  const [softwareFullData, setSoftwareFullData] = useState([])


  const [createCampaign] = useCreateCampaignMutation();
  const { isLoading: isCampaignLoading, refetch } = useGetCampaignListQuery();


  // Filters
  const [filterStatus, setFilterStatus] = useState("All"); // State to store selected filter value

  const generateShortUuid = () => {
    // Generate a full UUID and extract the first 8 characters
    return uuidv4().split('-')[0].substring(0, 8);
  };

  // const [campaignID] = useState(generateShortUuid());
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [campaignType, setCampaignType] = useState(CAMPAIGN_TYPE.NORMAL);
  const [updateType, setUpdateType] = useState(UPDATE_TYPE.FULL);


  const [selectedVehicles, setSelectedVehicles] = useState([]); // State to store the selected vehicles
  const [openSelectedVehiclesTable, setopenSelectedVehiclesTable] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility


  // This function will be passed as a prop to the Test component
  const handleSelectedVehiclesChange = (vehicles) => {
    const vins = vehicles.map(vehicle => vehicle.vin);
    setVehicle(vins);
    setSelectedVehicles(vehicles)
  };


  function handleSelectedSoftware(software) {
    if (software) {
      setSoftware(software.softwareId)
      setSoftwareFullData(software)
      // console.log("Selected Software ID:", software);
    }
    else {
      setSoftware('')
      setSoftwareFullData('')
      // console.log("Selected Software ID:", software);
    }
  }

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSoftware(false)
  };

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    // console.log(event, newAlignment)
    refetch()
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCampaignID = generateShortUuid(); // Generate a unique campaign ID for each submission

    createCampaign({
      campaignID: newCampaignID, // Use the generated unique campaign ID for each vehicle
      campaignName,
      campaignDescription,
      campaignType,
      updateType,
      vehicle, // Get the current vehicle VIN
      software,
    })
      .unwrap()
      .then(() => {
        enqueueSnackbar(`Campaign created successfully  - ${vehicle}`, {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        refetch(); // Refetch campaign list to update UI
        // Reset the form states to their initial values
        setCampaignName('');
        setCampaignDescription('');
        setVehicle([]);  // Assuming 'vehicle' is an array
        setSoftware('');  // If 'software' is a string
        setSelectedVehicles(0)
        setCampaignType(CAMPAIGN_TYPE.NORMAL)
        setUpdateType(UPDATE_TYPE.FULL)

        // Clear sessionStorage after submitting
        sessionStorage.clear()

      })
      .catch((err) => {
        enqueueSnackbar(`${err.data.message}`, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        console.log(err)
        setCampaignName('');
        setCampaignDescription('');
        setVehicle([]);  // Assuming 'vehicle' is an array
        setSoftware('');  // If 'software' is a string
        setSelectedVehicles(0)
        setCampaignType(CAMPAIGN_TYPE.NORMAL)
        setUpdateType(UPDATE_TYPE.FULL)
        sessionStorage.clear()
      });
  };

  const element = document.body;

  const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
      // console.log(entry.contentRect);
    });
  });
  resizeObserver.observe(element);

  const handleModalClose = () => {
    setOpenCreateSoftwareModal(false);
  };

  const handleSoftwareCreated = (softwareId) => {
    console.log(`New software created with ID: ${softwareId}`);
    // You can also refetch software list or perform any other actions here.
    setOpenCreateSoftwareModal(false); // Close the modal after creation
    enqueueSnackbar(`Software created successfully with ID: ${softwareId}`, {
      variant: "success",
      anchorOrigin: { vertical: "top", horizontal: "center" },
      autoHideDuration: 2000,
    });
  };

  if (isCampaignLoading) {
    return (
      <div style={{ display: "flex" }}>
        <div style={{ marginTop: "5px" }}>Loading Campaigns</div>
        <div className="spinner"></div>
      </div>
    ); // Display loading message while fetching data
  }


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
          top: '0%', background: (theme === "black" || theme === null || theme === undefined) ? "black" : theme,
          zIndex: 1
        }}>
          <Header title={"Campaign Management"} />
        </div>
        <Box sx={{ width: "100%", marginTop: "40px" }}>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              // background:'red',
            }}>
            <div>

              <Button
                color="primary"
                size="large"
                value="createCampaign"
                onClick={(event) => handleAlignment(event, "createCampaign")}
                aria-label="createCampaign"
                style={{
                  color: theme === "black" ? "White" : getTextColor(theme),
                  border: '2px solid gray',
                  borderRadius: '0px',
                  width: '160px',
                  background: alignment === "createCampaign" ? '#6946c6' : "",
                }}
              >
                Create Campaign
              </Button>
              <Button
                color="primary"
                size="large"
                value="campaignList"
                onClick={(event) => handleAlignment(event, "campaignList")}
                aria-label="campaignList"
                style={{
                  color: theme === "black" ? "White" : getTextColor(theme),
                  border: '2px solid gray',
                  borderRadius: '0px',
                  width: '160px',
                  background: alignment === "campaignList" ? '#6946c6' : "",
                }}
              >
                Campaign list
              </Button>
            </div>

            {alignment !== "createCampaign" && (

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
            )}

          </div>

          {alignment === "createCampaign" ? (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: '99%',
                  marginTop: "26px"
                }}
              >

                <div style={{ width: '40%' }}>
                  <FormLabel htmlFor="CampaignName"
                    sx={{
                      display: "block",
                      color: theme === "black" ? "White" : getTextColor(theme),
                      fontWeight: 'bolder',
                      fontSize: '14px'
                    }}>

                    <span style={{ color: 'red' }}>*</span> Campaign Name
                  </FormLabel>
                  <TextField
                    // style={{width:'400px'}}
                    fullWidth
                    size="small"
                    type="text"
                    name="CampaignName"
                    placeholder="Enter The Campaign Name"
                    required
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>

                <Box sx={{ width: '55%' }}>
                  <FormLabel htmlFor="CampaignDesc"
                    style={{
                      display: "block",
                      color: theme === "black" ? "White" : getTextColor(theme),
                      fontWeight: 'bolder',
                      fontSize: '14px',
                    }}>
                    {/* <Typography color="red" component="span" >* </Typography> */}
                    Campaign Description
                  </FormLabel>
                  <TextField
                    fullWidth
                    size="small"
                    type="text"
                    name="CampaignDesc"
                    multiline
                    placeholder="Enter The Campaign Description"
                    sx={{ "& .MuiInputBase-root": { height: "auto" } }}
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                  />
                </Box>
              </div>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  marginTop: "2%"
                }}>

                <div>
                  <FormLabel htmlFor="Campaigntype"
                    style={{
                      display: "block",
                      color: theme === "black" ? "White" : getTextColor(theme),
                      fontWeight: 'bolder',
                      fontSize: '14px'
                    }}>
                    <Typography color="red" component="span">*</Typography> Types of Campaign
                  </FormLabel>
                  <RadioGroup
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }}
                    row
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value)}
                  >
                    <FormControlLabel
                      value={CAMPAIGN_TYPE.NORMAL}
                      // control={<Radio />} 
                      control={
                        <Radio
                          sx={{
                            color: theme === "black" ? "White" : getTextColor(theme),
                            "&.Mui-checked": {
                              color: "Blue", // Color when selected for CRITICAL option
                            },
                          }}
                        />
                      }
                      label={CAMPAIGN_TYPE.NORMAL}
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          color: theme === "black" ? "White" : getTextColor(theme),
                          fontWeight: 'bolder'
                        },
                      }} />
                    <FormControlLabel
                      value={CAMPAIGN_TYPE.CRITICAL}
                      // control={<Radio />}
                      control={
                        <Radio
                          sx={{
                            color: theme === "black" ? "White" : getTextColor(theme),
                            "&.Mui-checked": {
                              color: "Blue", // Color when selected for CRITICAL option
                            },
                          }}
                        />
                      }
                      label={CAMPAIGN_TYPE.CRITICAL}
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          color: theme === "black" ? "White" : getTextColor(theme), // Set text color for NORMAL option
                          fontWeight: 'bolder'
                        },
                      }}
                    />
                  </RadioGroup>

                </div>

                <div>
                  <FormLabel htmlFor="updateType"
                    style={{
                      display: "block",
                      color: theme === "black" ? "White" : getTextColor(theme),
                      fontWeight: 'bolder',
                      fontSize: '14px',
                      // marginTop: 18
                    }}>
                    Update Type
                  </FormLabel>
                  <RadioGroup
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}
                    row
                    value={updateType}
                    onChange={(e) => setUpdateType(e.target.value)}
                  >
                    <FormControlLabel
                      value={UPDATE_TYPE.FULL}
                      control={
                        <Radio
                          sx={{
                            color: theme === "black" ? "White" : getTextColor(theme),
                            "&.Mui-checked": {
                              color: "Blue", // Color when selected for CRITICAL option
                            },
                          }}
                        />
                      }
                      label={UPDATE_TYPE.FULL}
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          color: theme === "black" ? "White" : getTextColor(theme), // Set text color for NORMAL option
                          fontWeight: 'bolder'
                        },
                      }}
                    />
                    <FormControlLabel
                      value={UPDATE_TYPE.DELTA}
                      control={
                        <Radio
                          sx={{
                            color: theme === "black" ? "White" : getTextColor(theme),
                            "&.Mui-checked": {
                              color: "Blue", // Color when selected for CRITICAL option
                            },
                          }}
                        />
                      }
                      label={UPDATE_TYPE.DELTA}
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          color: theme === "black" ? "White" : getTextColor(theme), // Set text color for NORMAL option
                          fontWeight: 'bolder'
                        },
                      }}
                    />

                  </RadioGroup>
                </div>


                {vehicle.length <= 0 && (
                  <div>
                    <FormLabel htmlFor="vehicle"
                      style={{
                        display: "block",
                        color: theme === "black" ? "White" : getTextColor(theme),
                        fontWeight: 'bolder',
                        fontSize: '14px',
                        // marginTop: 18
                      }}>
                      Vehicle
                    </FormLabel>

                    <Select
                      size="small"
                      name="vehicle"
                      fullWidth
                      required
                      value={vehicle} // Allowing multiple vehicle selection
                      // onChange={handleVehicleChange}
                      displayEmpty
                      style={{
                        border: '2px gray solid',
                        background: 'white',
                        color: "grey",
                      }}
                    >

                      <Button value="" disabled>Select A Vehicle</Button>
                      {!isModalOpen && (
                        <div>
                          <div style={{ textAlign: 'center' }}>
                            <Button variant="text" onClick={openModal}>Select Vehicles</Button>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <Button variant="text" onClick={() => setOpenAddVehicleModal(true)}>Create New Vehicle</Button>
                          </div>
                        </div>
                      )}

                    </Select>
                    <FormHelperText sx={{ color: "#6c757d" }}>Select an existing vehicle or add a new one</FormHelperText>

                  </div>
                )}

                {selectedVehicles.length >= 1 && (
                  <div>
                    <FormLabel
                      style={{
                        display: "block",
                        color: theme === "black" ? "White" : getTextColor(theme),
                        fontWeight: 'Bolder',
                        fontSize: '14px',
                      }}>
                      Vehicle Count
                    </FormLabel>
                    <div
                      onClick={openModal}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "center",
                        fontWeight: 'bolder',
                        height: '30px',
                        padding: '5px',
                        background: 'White',
                        border: '2px solid gray',
                        borderRadius: '3px',
                        color: "black",
                        cursor: 'pointer',
                      }}
                    >{selectedVehicles.length}
                    </div>
                    <FormHelperText sx={{ color: "#6c757d" }}>Click To Reselect Vehicles</FormHelperText>
                  </div>
                )}

                {software.length <= 0 && (
                  <div>
                    <FormLabel htmlFor="software"
                      style={{
                        display: "block",
                        color: theme === "black" ? "White" : getTextColor(theme),
                        fontWeight: 'bolder',
                        fontSize: '14px',
                      }}>
                      Software
                    </FormLabel>
                    <Select
                      size="small"
                      name="software"
                      fullWidth
                      required
                      value={software || ""}
                      // onChange={(e) => setSoftware(e.target.value)}
                      displayEmpty
                      style={{
                        border: '2px gray solid',
                        color: "grey",
                        background: 'white'
                      }}
                    >
                      <Button value="" disabled >Select A Software</Button>

                      {!selectedSoftware && (
                        <div>
                          <div style={{ textAlign: 'center' }}>
                            <Button variant="text" onClick={() => setSelectedSoftware(true)}>Select Software</Button>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <Button onClick={() => setOpenCreateSoftwareModal(true)}>Create New Software</Button>
                          </div>
                        </div>
                      )}

                    </Select>
                    <FormHelperText sx={{ color: "#6c757d" }}>Select the software for the campaign</FormHelperText>
                  </div>
                )}


                {software.length >= 1 && (
                  <div>
                    <FormLabel
                      style={{
                        display: "block",
                        color: theme === "black" ? "White" : getTextColor(theme),
                        fontWeight: 'Bolder',
                        fontSize: '14px',
                      }}>
                      Software Selected
                    </FormLabel>
                    <div
                      onClick={() => setSelectedSoftware(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '30px',
                        padding: '5px',
                        background: 'White',
                        border: '2px solid gray',
                        borderRadius: '3px',
                        color: "black",
                        fontWeight: 'bolder',
                        cursor: 'pointer',
                      }}
                    >{softwareFullData.softwareName}
                    </div>
                    <FormHelperText sx={{ color: "#6c757d", minWidth: '200px' }}>Click To Reselect Software</FormHelperText>
                  </div>
                )}


              </Box>

              <Box sx={{ marginTop: "40px" }}>
                <Button type="submit" variant="contained" color="primary" sx={{ width: "100%" }}>
                  Create Campaign
                </Button>
              </Box>
            </form>
          ) : (
            <AllCampaigns filterStatus={filterStatus} />
          )}
        </Box>
      </Paper >

      {openSelectedVehiclesTable && (
        <div style={{
          width: '60%',
          maxHeight: '60%',
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: '50%',
          left: '50%',  // Use left instead of right to better control the positioning
          transform: 'translate(-50%, -50%)', // This will center the component
          background: "white",
          padding: '14px',
          border: "5px solid #adadad",
          borderRadius: '14px',
          overflowY: 'scroll',
          overflowX: "hidden",
          zIndex: '10'
        }}>
          <Button onClick={() => setopenSelectedVehiclesTable(false)}
            style={{
              right: "-86%",
              width: '14%',
              // borderRadius:'14px',
              color: '#ffe6e6',
              background: '#ff6347',
            }}>
            X
          </Button>
          <Table >
            <TableHead style={{ borderTop: '2px solid gray', background: CSS_STYLE.Table_Head }}>
              <TableRow>
                <TableCell>VIN</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Brand</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ background: CSS_STYLE.Table_Body }}>
              {selectedVehicles.map((vehicle) => (
                <TableRow key={vehicle.vin}>
                  <TableCell>{vehicle.vin}</TableCell>
                  <TableCell>{vehicle.modelName}</TableCell>
                  <TableCell>{vehicle.modelYear}</TableCell>
                  <TableCell>{vehicle.brandName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )
      }

      {
        isModalOpen && (
          <VehiclePopUp
            onSelectedVehiclesChange={handleSelectedVehiclesChange}
            closeModal={closeModal} // Pass closeModal function to Test component
          />
        )
      }

      {
        selectedSoftware && (
          <SelectSoftwarePopup
            onSelectedSoftwareChange={handleSelectedSoftware}
            closeModal={closeModal}
          />
        )
      }


      <AddVehicleModal
        open={openAddVehicleModal}
        onClose={() => setOpenAddVehicleModal(false)}
        // onVehicleAdded={(vin) => setVehicle([...vehicle, vin])}
        onVehicleAdded={(vin) => ""}
        theme={theme}
      />

      {/* Modal for Creating New Software */}
      <Modal open={openCreateSoftwareModal} onClose={handleModalClose}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "white", padding: "20px", borderRadius: "10px", width: "400px"
        }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Create New Software</Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <SoftwareCreationModal
            open={openCreateSoftwareModal}           // Controls whether the modal is open
            onClose={handleModalClose}              // Function to close the modal
            onSoftwareCreated={handleSoftwareCreated} // Callback when software is successfully created
          />
        </Box>
      </Modal>
    </Box >
  );
}

export default Campaign;

