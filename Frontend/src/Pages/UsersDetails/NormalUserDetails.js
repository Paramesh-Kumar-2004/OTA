import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  Tab,
  Tabs,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { CSS_STYLE, ROLES } from "../../Constants/Constant";
import { useSelector, useDispatch } from "react-redux";
import { useGetUserListQuery } from "../../api/api";
import { addUsers } from "../../features/Users/UsersSlice";
import Header from "../../Components/Header/Header";
import GetThemeColor from "../../Util/GetThemColor";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);



function NormalUserDetails() {

  const { theme } = GetThemeColor();
  const dispatch = useDispatch();
  const [value, setValue] = useState("All");
  const { isLoading, data, isError } = useGetUserListQuery();
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const usersList = useSelector((state) =>
    state.users?.allUsers ? state.users.allUsers : []
  );


  useEffect(() => {
    dispatch(addUsers(data?.data));
    setRows(data?.data);
  }, [data, dispatch]);

  const handleSearch = (event) => {
    setSearch(event.currentTarget.value);
    const filteredRows = usersList.filter((row) => {
      return row.userEmail
        .toLowerCase()
        .includes(event.currentTarget.value.toLowerCase());
    });
    setRows(filteredRows);
  };

  const handleChange = (event, newValue) => {
    if (newValue !== "All") {
      const filteredRows = usersList.filter((row) => {
        return row.role.toLowerCase().includes(newValue.toLowerCase());
      });
      setRows(filteredRows);
    } else {
      setRows(usersList);
    }

    setValue(newValue);
  };


  if (isLoading) {
    return (
      <div style={{ display: "flex" }}>
        <div style={{ marginTop: "5px" }}>Loading</div>
        <div className="spinner"></div>
      </div>
    ); // Display loading message while fetching data
  }

  if (isError) {
    return (
      <div style={{ display: "flex" }}>
        <div style={{ marginTop: "5px" }}>Something Went Wrong! Please Try Again</div>
        <div className="spinner"></div>
      </div>
    ); // Display Error Message 
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
                  color: theme === "black" ? "White" : getTextColor(theme), // Set color for unselected tabs
                },
                "& .Mui-selected": {
                  color: "Green", // Set color for selected tab
                  background: 'skyblue'
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "Blue", // Set the color of the indicator line
                }
              }}
            >
              <Tab label="All" value={"All"} />
              <Tab label={ROLES.ADMIN} value={ROLES.ADMIN} />
              <Tab label={ROLES.CAMPAIGN_MANAGER} value={ROLES.CAMPAIGN_MANAGER} />
              <Tab label={ROLES.NORMAL} value={ROLES.NORMAL} />
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
              marginTop: '1%',
              marginBottom: '1%',
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

          </div>

        </Box>

        <Box>
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
                  borderRight: "1px solid #fff",
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
                <TableCell>Last Modified</TableCell>
                <TableCell>Role</TableCell>
                {/* <TableCell>Status</TableCell> */}
              </TableRow>
            </TableHead>

            {isLoading && (
              <div style={{ display: "flex" }}>
                <div style={{ marginTop: "5px" }}>Loading Vehicles</div>
                <div className="spinner"></div>
              </div>
            )}

            <TableBody sx={{ background: "#EFF5FF" }}>
              {rows &&
                rows.map((row) => {
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
                      <TableCell>{row.role}</TableCell>
                      {/* <TableCell>{row.Status}</TableCell> */}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </div>
  );
}

export default NormalUserDetails;

