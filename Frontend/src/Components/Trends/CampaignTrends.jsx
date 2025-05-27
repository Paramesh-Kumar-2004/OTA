import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useGetCampaignListQuery } from "../../api/api"; // API query to get campaign list
import GetThemeColor from "../../Util/GetThemColor";
import { getTextColor, getLightenedColor } from "../../Util/GetTextColors";



function CampaignTrends() {
  const { data } = useGetCampaignListQuery(); // Fetch campaign list from the API
  const [campaignList, setCampaignList] = useState(data ? data.data : []); // Local state for campaign list
  const [chartData, setChartData] = useState([]);
  const [dateRange, setDateRange] = useState("Last 7 Days"); // Default date range selection
  const [startDate, setStartDate] = useState(""); // Start date for date range filter
  const [endDate, setEndDate] = useState(""); // End date for date range filter
  const [statusFilter, setStatusFilter] = useState(""); // For storing selected campaign status filter

  useEffect(() => {
    if (data && data.data) {
      setCampaignList(data.data); // Sync the local campaign list with API data
    }
  }, [data]);

  // Get the last 'n' days from today
  // const getLastNDays = (n) => {
  //   const days = [];
  //   const today = new Date();
  //   for (let i = n - 1; i >= 0; i--) {
  //     const date = new Date(today);
  //     date.setDate(today.getDate() - i); // Subtract days to get the last 'n' days
  //     days.push(date.toISOString().split("T")[0]); // Convert to YYYY-MM-DD format
  //   }
  //   return days;
  // };


  const getLastNDays = () => {
    const days = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

    // Find the most recent Monday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Move to Monday

    // Push Monday to Friday into the days array
    for (let i = 0; i < 5; i++) { // 0 to 4 will give Monday to Friday
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i); // Move to the next day
      days.push(date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }

    return days;
  };




  // Filter campaigns by a custom date range
  const filterCampaignsByCustomDate = (startDate, endDate) => {
    return campaignList.filter((item) => {
      const campaignDate = new Date(item.createdAt).toISOString().split("T")[0]; // Format the date to YYYY-MM-DD
      return campaignDate >= startDate && campaignDate <= endDate;
    });
  };

  // Get campaign date formatted as day, month, or year based on selected range
  const getCampaignDateFormatted = (campaignDate) => {
    const date = new Date(campaignDate);
    if (dateRange === "Last 7 Days") {
      // return date.toLocaleDateString("en-GB"); // For DD:MM:YYYY format
      return date.toLocaleDateString("en-GB", { weekday: "long" }); // For weekday name (e.g. "Monday")
    } else if (dateRange === "Month") {
      return date.toLocaleString("default", { month: "long" }); // For Month Name (e.g. "January")
    } else if (dateRange === "Year") {
      return date.getFullYear(); // For Year (e.g. 2024)
    }
    return "";
  };


  // Filter campaigns based on the selected date range
  const filterCampaignsByDateRange = () => {
    let filteredCampaigns = [];

    if (dateRange === "Last 7 Days") {
      const last7Days = getLastNDays(7);
      filteredCampaigns = campaignList.filter((item) => {
        const campaignDate = new Date(item.createdAt).toISOString().split("T")[0];
        return last7Days.includes(campaignDate);
      });
    }
    else if (dateRange === "Month") {
      const months = new Set();
      campaignList.forEach((item) => {
        const month = getCampaignDateFormatted(item.createdAt);
        months.add(month);
      });
      filteredCampaigns = campaignList.filter((item) => {
        const month = getCampaignDateFormatted(item.createdAt);
        return months.has(month);
      });
    }
    else if (dateRange === "Year") {
      const years = new Set();
      campaignList.forEach((item) => {
        const year = getCampaignDateFormatted(item.createdAt);
        years.add(year);
      });
      filteredCampaigns = campaignList.filter((item) => {
        const year = getCampaignDateFormatted(item.createdAt);
        return years.has(year);
      });
    }
    else if (dateRange === "Select Date") {
      // Filter by custom date range
      if (startDate && endDate) {
        filteredCampaigns = filterCampaignsByCustomDate(startDate, endDate);
      }
    }

    return filteredCampaigns;
  };



  // Get chart data based on the selected filters
  const getChartData = () => {

    const statusCount = {};
    let filteredCampaigns = filterCampaignsByDateRange();

    // Apply status filter if selected
    if (statusFilter) {
      filteredCampaigns = filteredCampaigns.filter(
        (item) => item.status && item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Aggregate campaign counts by date (day, month, or year)
    filteredCampaigns.forEach((item) => {
      const campaignDate = getCampaignDateFormatted(item.createdAt);
      const status = item.status.toLowerCase();

      if (!statusCount[campaignDate]) {
        statusCount[campaignDate] = {
          Complete: 0,
          "Ongoing": 0,
          Cancelled: 0,
          Failed: 0,
        };
      }

      // Increment counts based on status
      if (status === "client not connect") {
        statusCount[campaignDate]["Ongoing"] += 1;
      }
      else if (status === "success" || status === "partial success") {
        statusCount[campaignDate]["Complete"] += 1;
      }
      else if (status === "cancelled") {
        statusCount[campaignDate]["Cancelled"] += 1;
      }
      else if (status === "failed") {
        statusCount[campaignDate]["Failed"] += 1;
      }
    });

    // Convert statusCount object into an array suitable for the chart
    return Object.keys(statusCount).map((date) => ({
      date,
      Complete: statusCount[date].Complete,
      "Ongoing": statusCount[date]["Ongoing"],
      Cancelled: statusCount[date].Cancelled,
      Failed: statusCount[date].Failed,
    }));
  };

  useEffect(() => {
    // Update chart data whenever the date range or status filter changes
    setChartData(getChartData());
  }, [dateRange, statusFilter, startDate, endDate, campaignList]); // Adding startDate and endDate dependencies

  // Helper function to format date
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}:${month}:${year}`;
  };

  const { theme } = GetThemeColor();


  return (
    <Box>
      {/* Campaign Trend BarChart */}

      <Box
        style={{
          display: 'flex',
          flexDirection: "column",
          alignItems: 'center',
          justifyContent: 'center',
          height: "52vh",
          minHeight: "250px",
          gap: '2px',
          border: "2px solid rgba(0, 0, 0, 0.144)",
          // background: 'rgb(58, 57, 57)',
          background: theme === "black" ? 'rgb(58, 57, 57)' : theme === "white" ? "#ededed" : getLightenedColor(theme),
          borderRadius: "14px",
          // background: 'red',
          paddingBottom: '14px',
        }}
      >

        {chartData.length !== 0 && (
          <Typography
            variant="h5"
            align="center"
            style={{
              fontSize: "16px",
              color: theme === "black" ? "White" : getTextColor(theme),
              marginTop: '14px',
            }}
          >
            Campaign Status Trend
          </Typography>
        )}

        {/* Filter Options */}
        {chartData.length !== 0 && (
          <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "right",
            width: '100%'
          }}>

            <FormControl sx={{ minWidth: 120 }} >
              <InputLabel style={{
                color: theme === "black" ? "White" : getTextColor(theme),
              }}>Filter By Date Range</InputLabel>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                label="Filter By Date Range"
                style={{
                  width: 'auto',
                  margin: "5px",
                  height: '80%',
                  fontSize: "14px",
                  color: theme === "black" ? "White" : getTextColor(theme),
                  border: '1px solid gray'
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: getLightenedColor(theme),
                      color: getTextColor(theme),
                      border: '2px solid gray'
                    },
                  },
                }}
              >
                <MenuItem value="Last 7 Days">Weekly</MenuItem>
                <MenuItem value="Month">Monthly</MenuItem>
                <MenuItem value="Year">Yearly</MenuItem>
                <MenuItem value="Select Date">Select Date</MenuItem>
              </Select>
            </FormControl>

            {dateRange === "Select Date" && (
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  // background:"red",
                  flexWrap: "wrap",
                  justifyContent: "end",
                  maxWidth: '60%'
                }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: '40%',
                    background: 'transparent',
                  }}
                  sx={{
                    width: 'auto',
                    margin: "5px",
                    height: 'auto',
                    fontSize: "14px",
                    "& .MuiInputBase-root": {
                      borderRadius: "4px", // Adjusts the border radius
                      border: "none", // Removes the border
                    },
                    "& .MuiOutlinedInput-root": {
                      fieldset: {
                        border: "none", // Removes the fieldset outline
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "14px", // Adjust padding if necessary
                      color: theme === "black" ? "White" : getTextColor(theme),
                    },
                  }}
                  InputLabelProps={{
                    // shrink: true,
                    style: { color: theme === "black" ? "White" : getTextColor(theme) }
                  }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: '40%',
                    background: "transparent",
                  }}
                  sx={{
                    width: 'auto',
                    margin: "5px",
                    height: 'auto',
                    fontSize: "14px",
                    "& .MuiInputBase-root": {
                      borderRadius: "4px", // Adjusts the border radius
                      border: "none", // Removes the border
                    },
                    "& .MuiOutlinedInput-root": {
                      fieldset: {
                        border: "none", // Removes the fieldset outline
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "14px", // Adjust padding if necessary
                      color: theme === "black" ? "White" : getTextColor(theme)
                    },
                  }}
                  InputLabelProps={{
                    // shrink: true,
                    style: { color: theme === "black" ? "White" : getTextColor(theme) }
                  }}
                />
              </Box>
            )}
          </Box>
        )}

        {chartData.length === 0 ? (
          <Typography
            variant="h6"
            align="center"
            style={{
              color: getTextColor(theme),
              paddingTop: "40px",
            }}
          >
            No Data Available
          </Typography>
        ) : (
          <ResponsiveContainer width="95%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} horizontal={false} />
              <YAxis stroke={getTextColor(theme)} />
              <XAxis
                dataKey="date"
                stroke={getTextColor(theme)}
                tickFormatter={(tick) => {
                  // If date range is custom (Select Date), show the formatted range
                  if (dateRange === "Select Date") {
                    return `${formatDate(startDate)} to ${formatDate(endDate)}`;
                  }
                  return tick; // Default behavior for other date ranges
                }}
              />

              {/* <Tooltip /> */}
              <Tooltip
                content={({ payload, label, active }) => {
                  if (active) {
                    return (
                      <div
                        style={{
                          // backgroundColor: theme === "dark" ? "gray" : "white",
                          backgroundColor: getLightenedColor(theme),
                          color: getTextColor(theme),
                          padding: "10px",
                          borderRadius: "5px",
                          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
                          fontSize: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "14px",      // Label size (bigger)
                            fontWeight: "bold",    // Label bold
                            marginBottom: "5px",
                          }}
                        >
                          {label}
                        </div>
                        {payload.map((entry) => (
                          <div
                            key={entry.dataKey}
                            style={{
                              color: "white",
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "5px 0",
                            }}
                          >
                            <h2
                              style={{
                                color: getTextColor(theme),
                              }}
                            >{entry.name} :
                            </h2>
                            <h2
                              style={{
                                color: getTextColor(theme),
                              }}
                            >&#160;{entry.value}</h2>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* <Bar dataKey="Complete" stackId="a" fill="Green" />
              <Bar dataKey="Ongoing" stackId="a" fill="Red" />
              <Bar dataKey="Cancelled" stackId="a" fill="Yellow" />
              <Bar dataKey="Failed" stackId="a" fill="Orange" /> */}

              <defs>
                {/* Gradient for "Complete" (Top to Bottom) */}
                <linearGradient id="completeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="10%" stopColor="#0aff0a" />
                  <stop offset="100%" stopColor="#004200" />
                </linearGradient>

                {/* Gradient for "Ongoing" (Top to Bottom) */}
                <linearGradient id="notConnectGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="Orange" />
                  <stop offset="100%" stopColor="#664200" />
                </linearGradient>

                {/* Gradient for "Cancelled" (Top to Bottom) */}
                <linearGradient id="cancelledGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="yellow" />
                  <stop offset="100%" stopColor="#666600" />
                </linearGradient>

                {/* Gradient for "Failed" (Top to Bottom) */}
                <linearGradient id="failedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff8a8a" />
                  <stop offset="100%" stopColor="#660000" />
                </linearGradient>
              </defs>

              <Bar dataKey="Complete" stackId="a" fill="url(#completeGradient)" />
              <Bar dataKey="Ongoing" stackId="a" fill="url(#notConnectGradient)" />
              <Bar dataKey="Cancelled" stackId="a" fill="url(#cancelledGradient)" />
              <Bar dataKey="Failed" stackId="a" fill="url(#failedGradient)" />

              {/* Legend styled horizontally */}
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="top"
                iconSize={5}
                iconType="square"
                content={({ payload }) => (
                  <div
                    style={{
                      fontSize: '12px',
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-around",
                      alignItems: 'center',
                      paddingLeft: "10%",
                      paddingBottom: "5%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {payload.map((entry) => (
                      <div
                        key={entry.value}
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "16px",
                            borderRadius: "5px",
                            height: "15px",
                            background: entry.value === "Complete" ? "green" :
                              entry.value === "Ongoing" ? "Orange" :
                                entry.value === "Cancelled" ? "Yellow" :
                                  entry.value === "Failed" ? "Red" : "White",
                            marginRight: "5px",
                          }}
                        ></div>
                        <div
                          style={{ color: getTextColor(theme) }}
                        >{entry.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              />

            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box >
  );
}

export default CampaignTrends;


