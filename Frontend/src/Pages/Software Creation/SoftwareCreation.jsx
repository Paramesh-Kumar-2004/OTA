import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import DropFileInput from "../../Components/DropFileInput";
import Header from "../../Components/Header/Header";
import {
  useCreateSoftwareMutation,
  useDeleteSoftwareMutation,
  // useDeleteSoftwareMutation,
  useGetSoftwareListQuery,
  useUpdateSoftwareDeleteStatusMutation
} from "../../api/api";
import { v4 as uuidv4 } from "uuid";
import { enqueueSnackbar } from "notistack";
import SoftwareList from "./SoftwareList";
import GetThemeColor from "../../Util/GetThemColor";
import { getTextColor } from "../../Util/GetTextColors";



function SoftwareCreation() {

  const { theme } = GetThemeColor();

  const generateShortUuid = () => {
    // Generate a full UUID and extract the first 8 characters
    return uuidv4().split('-')[0].substring(0, 8);
  };

  const [loading, setLoading] = useState(false)
  const { isLoading, data, refetch } = useGetSoftwareListQuery();
  const [softwareId, setSoftwareId] = useState(generateShortUuid());
  const [softwareName, setSoftwareName] = useState("");
  const [version, setVersion] = useState("");
  const [files, setFiles] = useState(null);
  const [alignment, setAlignment] = useState("createSoftware");


  const [softwareList, setSoftwareList] = useState(data ? data.data : []);

  const [createSoftware] = useCreateSoftwareMutation();
  // const [deleteSoftware] = useDeleteSoftwareMutation();
  const [deleteSoftwareStatus] = useUpdateSoftwareDeleteStatusMutation();
  const [deleteSoftware] = useDeleteSoftwareMutation()


  // Retrieve deleted software list from localStorage on mount
  useEffect(() => {
    if (data && data.data) {
      setSoftwareList(data.data);
    }
  }, [data]);

  const onFileChange = (myfiles) => {
    setFiles(myfiles[0]);
  };


  const handleSoftwareCreation = (event) => {
    event.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append("softwareId", softwareId);
    formData.append("softwareName", softwareName);
    formData.append("version", version);
    formData.append("softwareFile", files);

    createSoftware(formData)
      .unwrap()
      .then((res) => {
        setLoading(false);
        enqueueSnackbar("Software created", {
          variant: "success",
          anchorOrigin: {
            vertical: 'top', // Positions it at the top
            horizontal: 'center', // Positions it in the center horizontally
          },
          autoHideDuration: 2000,
        });
        setSoftwareList((prevList) => [
          ...prevList,
          {
            softwareId,
            softwareName,
            version,
            createdAt: new Date(),
          },
        ]);
        handleReset();
        refetch()
      })
      .catch((err) => {
        enqueueSnackbar("Failed to create software", {
          variant: "error",
          anchorOrigin: {
            vertical: 'top', // Positions it at the top
            horizontal: 'center', // Positions it in the center horizontally
          },
          autoHideDuration: 2000,
        });
      });
    refetch()
  };

  const handleReset = () => {
    setFiles(null);
    setSoftwareName("");
    setVersion("");
    setSoftwareId(generateShortUuid());
    setFiles(null)
    refetch()
  };


  function handleDeleteSoftware(softwareId) {
    deleteSoftware({ softwareId })
      .unwrap()
      .then((res) => {
        enqueueSnackbar("Software Successfully Deleted", {
          variant: "success",
          anchorOrigin: {
            vertical: 'top', // Positions it at the top
            horizontal: 'center', // Positions it in the center horizontally
          },
          autoHideDuration: 2000,
        });
        refetch()
      })
      .catch((err) => {
        enqueueSnackbar(err.data.error, {
          variant: "error",
          anchorOrigin: {
            vertical: 'top', // Positions it at the top
            horizontal: 'center', // Positions it in the center horizontally
          },
          autoHideDuration: 2000,
        });
      });
  };


  const handleSoftwareDeleteStatus = (softwareId) => {
    const softwareDeleteStatus = softwareList.find((item) => item.softwareId === softwareId);

    if (softwareDeleteStatus) {
      setSoftwareList((prevList) => prevList.filter((item) => item.softwareId !== softwareId));
    }

    deleteSoftwareStatus({ softwareId })
      .unwrap()
      .then((res) => {
        enqueueSnackbar("Software Delete Status Updated", {
          variant: "success",
          anchorOrigin: {
            vertical: 'top', // Positions it at the top
            horizontal: 'center', // Positions it in the center horizontally
          },
          autoHideDuration: 2000,
        });
      })
      .catch((err) => {
        enqueueSnackbar("Failed To Update Software Delete Status", {
          variant: "error",
          anchorOrigin: {
            vertical: 'top', // Positions it at the top
            horizontal: 'center', // Positions it in the center horizontally
          },
          autoHideDuration: 2000,
        });
      });
  };

  useEffect(() => {
    refetch()
  }, [alignment])

  if (isLoading) {
    return (
      <div style={{ display: "flex" }}>
        <div style={{ marginTop: "5px" }}>Loading Softwares</div>
        <div className="spinner"></div>
      </div>
    ); // Display loading message while fetching data
  }

  // if (loading) {
  //   return (
  //     <div style={{ display: "flex" }}>
  //       <div style={{ marginTop: "5px" }}>Uploading Software </div>
  //       <div className="spinner"></div>
  //     </div>
  //   ); // Display loading message while fetching data
  // }


  return (
    <Box
      style={{
        height: "98vh",
        width: "90%",
        // border: "3px solid red",
        overflowX: 'scroll',
        scrollbarWidth: 'none', // For Firefox to hide scrollbar
        // scroll:'none'
      }}
    >
      <Paper
        sx={{
          pb: 0,
          boxShadow: "none",
          borderRadius: "0px",
          background: 'transparent'
        }}
        elevation={0}
      >
        <div
          style={{
            position: 'sticky',
            top: '0%',
            background: (theme === "black" || theme === null || theme === undefined) ? "black" : theme,
            // background: "transparent",
            zIndex: 1
          }}>
          <Header title={"Software Management"} />
        </div>

        <Box sx={{ width: "100%", marginTop: "40px" }}>

          <div
            style={{
              paddingBottom: '10px'
            }}
          >
            <Button
              color="primary"
              size="large"
              value="createSoftware"
              onClick={() => setAlignment("createSoftware")}
              aria-label="createSoftware"
              style={{
                color: theme === "black" ? "White" : getTextColor(theme),
                border: '2px solid gray',
                borderRadius: '0px',
                width: '160px',
                background: alignment === "createSoftware" ? '#6946c6' : "",
              }}
            >
              Create Software
            </Button>
            <Button
              color="primary"
              size="large"
              value="softwareList"
              onClick={() => setAlignment("softwareList")}
              aria-label="softwareList"
              style={{
                color: theme === "black" ? "White" : getTextColor(theme),
                border: '2px solid gray',
                borderRadius: '0px',
                width: '160px',
                background: alignment === "softwareList" ? '#6946c6' : "",
              }}
            >
              Software List
            </Button>
          </div>

          {alignment === "createSoftware" ? (
            <form onSubmit={handleSoftwareCreation}>
              <div style={{
                display: "flex",
                width: "100%",
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginTop: "26px"
              }}>
                {/* <div
                  style={{
                    width: '30%'
                  }}
                >
                  <FormLabel style={{ color: theme === "black" ? "White" : getTextColor(theme), fontWeight: 'bolder', fontSize: '14px' }}>Software ID</FormLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={softwareId}
                    disabled
                    required
                  />
                </div> */}
                <div style={{
                  width: '40%'
                }}>
                  <FormLabel
                    style={{
                      color: theme === "black" ? "White" : getTextColor(theme),
                      fontWeight: 'bolder',
                      fontSize: '14px'
                    }}
                  >Software Name</FormLabel>

                  <TextField
                    fullWidth
                    size="small"
                    value={softwareName}
                    onChange={(e) => setSoftwareName(e.target.value)}
                    required
                    placeholder="Enter Software Name"
                  />
                </div>
                <div style={{
                  width: '40%',
                  marginRight: '10px'
                }}>
                  <FormLabel style={{
                    color: theme === "black" ? "White" : getTextColor(theme),
                    fontWeight: 'bolder',
                    fontSize: '14px'
                  }}
                  >Version</FormLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    required
                    placeholder="Enter Software Version"
                  />
                </div>
              </div>

              {!files && (
                <DropFileInput onFileChange={onFileChange} />
              )}

              {files && (
                <Typography
                  style={{
                    margin: '1%',
                    color: theme === "black" ? "White" : getTextColor(theme),
                    fontSize: '20px',
                    paddingLeft: '1%'
                  }}>
                  Software Is Ready <br />
                  Software Name :&#160;
                  <span style={{ fontWeight: 'bolder' }}>
                    {files.name}
                  </span>
                  <br />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setFiles(null)}>Cancel</Button>
                </Typography>
              )}

              <div style={{ display: "flex", gap: "20px", justifyContent: "flex-end" }}>

                {!loading && (
                  <Button type="submit" variant="contained">
                    Create
                  </Button>
                )}

                {loading && (
                  <Button type="submit" variant="contained" disabled>
                    <div style={{ display: "flex" }}>
                      <div style={{ marginTop: "5px", color: getTextColor(theme) }}>Uploading Software </div>
                      <div className="spinner"></div>
                    </div>
                  </Button>
                )}
                <Button onClick={handleReset} type="reset" variant="contained" color="secondary">
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <SoftwareList
              softwareList={softwareList}
              handleDeleteSoftware={handleDeleteSoftware}
            />
          )}
        </Box>
      </Paper>
      {/* <DeletedSoftwareHistory /> */}
    </Box>
  );
}

export default SoftwareCreation;

