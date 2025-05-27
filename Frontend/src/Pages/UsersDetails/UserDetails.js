import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  Tab,
  Tabs,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { CSS_STYLE, ROLES } from "../../Constants/Constant";
// import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { useGetUserListQuery, useUpdateUserMutation, useRegisterUserMutation, useDeleteUserMutation } from "../../api/api";
import { addUsers } from "../../features/Users/UsersSlice";
import { enqueueSnackbar } from "notistack";
import Header from "../../Components/Header/Header";
import GetThemeColor from "../../Util/GetThemColor";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getTextColor } from "../../Util/GetTextColors";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);



function UserDetails() {

  const { theme } = GetThemeColor();
  const dispatch = useDispatch();
  const [updateUser] = useUpdateUserMutation();
  const [deleteuserdata] = useDeleteUserMutation();
  const [registerUser] = useRegisterUserMutation();
  const [value, setValue] = useState("All");
  const { isLoading, data, refetch } = useGetUserListQuery();
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false); // Modal state
  const [firstName, setFirstName] = useState(""); // New user form state
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeUser, setChangeUser] = useState([]);
  // Pagination Variables
  const [currentPage, setCurrentPage] = useState(1);
  // const [dataPerPage, setDataPerPage] = useState(10);
  const dataPerPage = 10
  const indexoflastpost = currentPage * dataPerPage
  const indexoffirstpost = indexoflastpost - dataPerPage
  const totalpage = Math.ceil(rows.length / dataPerPage)
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
  const currentData = rows.slice(indexoffirstpost, indexoflastpost)

  useEffect(() => {
    if (data?.data) {
      setRows(data?.data);  // Set rows directly from the API response
    }
  }, [data]);

  const handleRoleChange = (row) => {
    setRows(
      rows.map((item) => {
        if (item.userEmail === row.email) {
          return { ...item, role: row.role };
        } else {
          return item;
        }
      })
    );
  };

  function updateUserRole(row) {
    setChangeUser((prev) => {
      const index = prev.findIndex((user) => user.userEmail === row.userEmail);

      if (index !== -1) {
        const updatedUsers = [...prev];
        updatedUsers[index] = { ...updatedUsers[index], role: row.role };
        return updatedUsers;
      } else {
        return [...prev, row];
      }
    });
  }

  const handleSearch = (event) => {
    setSearch(event.currentTarget.value);
    const filteredRows = data?.data.filter((row) => {
      return row.userEmail
        .toLowerCase()
        .includes(event.currentTarget.value.toLowerCase());
    });
    setRows(filteredRows);
  };

  const handleChange = (event, newValue) => {
    if (newValue !== "All") {
      const filteredRows = data?.data.filter((row) => {
        return row.role.toLowerCase().includes(newValue.toLowerCase());
      });
      setRows(filteredRows);
    } else {
      setRows(data?.data);
    }

    setValue(newValue);
  };

  const updateStatus = () => {
    if (changeUser.length > 0) {
      changeUser.forEach((role) => {
        updateUser(role)
          .unwrap()
          .then((res) => {
            enqueueSnackbar(`Updated the user ${role.userEmail}`, {
              variant: "success",
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
              autoHideDuration: 2000,
            });
          })
          .catch((er) => {
            enqueueSnackbar("Could not update the user", {
              variant: "error",
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
              autoHideDuration: 2000,
            });
          });
      });
    } else {
      enqueueSnackbar("No changes to update", {
        variant: "info",
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        autoHideDuration: 2000,
      });
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match!", {
        variant: "error",
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        autoHideDuration: 2000,
      });
      return;
    }

    registerUser({
      firstName,
      lastName,
      userEmail,
      password,
    })
      .unwrap()
      .then((newUser) => {
        enqueueSnackbar("User created successfully", {
          variant: "success",
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          autoHideDuration: 2000,
        });

        refetch()
        dispatch(addUsers([...data?.data, newUser])); // Add new user to Redux state
        setRows((prevRows) => [...prevRows, newUser]); // Add new user to local rows state

        handleCloseModal();
      })
      .catch((error) => {
        enqueueSnackbar("Could not create user", {
          variant: "error",
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          autoHideDuration: 2000,
        });
      });
  };

  function handleDeleteUser(data) {
    console.log("ID:", data);
    deleteuserdata({ id: data })
      .unwrap()
      .then((res) => {
        enqueueSnackbar("User deleted successfully", {
          variant: "success",
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          autoHideDuration: 2000,
        });
        setRows((prevRows) => prevRows.filter((row) => row.id !== data));
      })
      .catch((err) => {
        enqueueSnackbar("Could not delete the user", {
          variant: "error",
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          autoHideDuration: 2000,
        });
      });
  }

  if (isLoading) {
    return (
      <div style={{ display: "flex" }}>
        <div style={{ marginTop: "5px" }}>Loading</div>
        <div className="spinner"></div>
      </div>
    );
  }


  return (
    <div
      style={{
        height: "98vh",
        width: "90%",
        // border: "3px solid red",
        overflowX: 'scroll',
        scrollbarWidth: 'none', // For Firefox to hide scrollbar
      }}
    >

      <Box >
        <div style={{
          position: 'sticky',
          top: '0%',
          background: (theme === "black" || theme === null || theme === undefined) ? "black" : theme,
          zIndex: 1
        }}>
          <Header title="Access Control" />
        </div>
        <Box sx={{ width: "100%", marginTop: "40px" }}>
          <Box
            sx={{
              // borderColor: "divider",
              borderBottom: "1px solid gray"
            }}
          >

            <Tabs value={value} onChange={handleChange} aria-label="roleTab"
              sx={{
                "& .MuiTab-root": {
                  color: "white", // Set color for unselected tabs
                },
                "& .Mui-selected": {
                  background: '#6b46c1'
                },
                // "& .MuiTabs-indicator": {
                //   backgroundColor: "Skyblue", // Set the color of the indicator line
                // }
              }}
            >
              <Tab label="All" value={"All"} style={{ color: theme === "black" ? "White" : getTextColor(theme), }} />
              <Tab label={ROLES.ADMIN} value={ROLES.ADMIN} style={{ color: theme === "black" ? "White" : getTextColor(theme), }} />
              <Tab label={ROLES.CAMPAIGN_MANAGER} value={ROLES.CAMPAIGN_MANAGER} style={{ color: theme === "black" ? "White" : getTextColor(theme), }} />
              <Tab label={ROLES.NORMAL} value={ROLES.NORMAL} style={{ color: theme === "black" ? "White" : getTextColor(theme), }} />
            </Tabs>

          </Box>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              // background: 'red',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginTop: '14px',
              marginBottom: '14px',
            }}
          >

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                // background: 'gold',
                // border: "2px solid gray"
              }}
            >

              <h3>Search : &#160;</h3>
              <TextField
                fullWidth
                size="small"
                type="text"
                id="search"
                placeholder="Search By Email"
                required
                style={{
                  width: "auto",
                  borderRadius: "8px",
                  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                  border: "2px solid gray"
                }}
                value={search}
                onChange={handleSearch}
              />
            </div>

            <div style={{
              // width: '100%',
              display: 'flex',
              padding: '1%',
              justifyContent: 'right',
              // background: 'pink'
              gap: '5px'
            }}
            >
              <Button variant="contained" onClick={updateStatus}
                style={{
                  color: theme === "black" ? "White" : getTextColor(theme),
                  border: '1px solid skyblue',
                }}
              >
                Update User
              </Button>
              <Button variant="contained" onClick={handleOpenModal}
                style={{
                  color: theme === "black" ? "White" : getTextColor(theme),
                  border: '1px solid skyblue',
                }}
              >
                Add User
              </Button>
            </div>
          </div>

        </Box>

        <Box>
          {/* <TableContainer sx={{ mt: "30px", maxHeight: 380, overflow: "auto" }}> */}
          <Table aria-label="userTable">
            <TableHead
              sx={{
                borderRadius: "8px 8px 0px 8px",
                // position:'sticky',
                // top:'10px',
                "& th": {
                  textAlign: "center",
                  background: CSS_STYLE.Table_Head,
                  color: theme === "black" ? "White" : getTextColor(theme),
                  fontSize: "14px",
                  fontWeight: "500",
                  letterSpacing: "1.32px",
                  border: "1px solid #6B46C1",
                  whiteSpace: "normal", // Allows text to wrap
                  wordWrap: "break-word", // Wraps long words
                  // overflow: "hidden", // Hides overflowing content
                  textOverflow: "ellipsis", // Shows ellipsis when content overflows
                  maxWidth: "120px", // Optional: Set max width for header cells
                },
              }}
            >
              <TableRow >
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Creation Date</TableCell>
                <TableCell>Role</TableCell>
                {/* <TableCell>Status</TableCell> */}
                {/* <TableCell>Save</TableCell> */}
                <TableCell>Delete User</TableCell>
              </TableRow>
            </TableHead>

            {isLoading && (
              <div style={{ display: "flex" }}>
                <div style={{ marginTop: "5px" }}>Loading Vehicles</div>
                <div className="spinner"></div>
              </div>
            )}

            <TableBody sx={{ background: "#EFF5FF" }}>
              {currentData &&
                currentData.map((row) => {
                  return (
                    <TableRow
                      key={row.userEmail}
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
                          overflow: "hidden", // Hide content overflow in body
                          textOverflow: "ellipsis", // Truncate content with ellipsis if necessary
                        },
                      }}
                    >
                      <TableCell>{row.firstName} {row.lastName}</TableCell>
                      <TableCell scope="row">{row.userEmail}</TableCell>
                      <TableCell>{dayjs(row.createdAt).fromNow()}</TableCell>
                      <TableCell>
                        <Select
                          value={row.role}
                          size="small"
                          onChange={(e) => {
                            handleRoleChange({
                              role: e.target.value,
                              email: e.target.name,
                            });
                            updateUserRole({
                              role: e.target.value,
                              userEmail: e.target.name
                            })
                          }}
                          name={row.userEmail}
                        >
                          <MenuItem value={ROLES.ADMIN}>{ROLES.ADMIN}</MenuItem>
                          <MenuItem value={ROLES.CAMPAIGN_MANAGER}>
                            {ROLES.CAMPAIGN_MANAGER}
                          </MenuItem>
                          <MenuItem value={ROLES.NORMAL}>{ROLES.NORMAL}</MenuItem>
                        </Select>
                      </TableCell>
                      {/* <TableCell>{row.Status}</TableCell> */}
                      {/* <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => updateStatus(row)}
                        >
                          Save
                        </Button>
                      </TableCell> */}
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            const confirmDelete = window.confirm(`Are You Sure You Want To Delete ${row.userEmail} ?`);
                            if (confirmDelete && row.id) {  // Check if row.id exists
                              handleDeleteUser(row.id);
                            } else {
                              console.error("User ID not found!");
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          {/* </TableContainer> */}
        </Box>

        {/* Add User Modal */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                label="First Name"
                fullWidth
                margin="normal"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <TextField
                label="Last Name"
                fullWidth
                margin="normal"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                type="email"
              />
              <TextField
                label="Password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
              />
              <TextField
                label="Confirm Password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                type="password"
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              color="primary"
              variant="contained"
              disabled={
                !firstName || !lastName || !userEmail || !password || !confirmPassword
              }
            >
              Save User
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <div className={theme === "black" ? "darkpaginationbar" : "lightpaginationbar"}>
        <button
          className="ButtonPrevious"
          variant="contained"
          color="primary"
          onClickCapture={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >Previous</button>

        {pageNumbers.map((page, index) => (
          <h2
            key={index}
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
    </div>
  );
}

export default UserDetails;


