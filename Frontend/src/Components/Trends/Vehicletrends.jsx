import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField
} from "@mui/material";
// Recharts imports for BarChart
import { BarChart, Legend, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetVehicalListQuery } from "../../api/api";  // API query to get vehicle list
import GetThemeColor from "../../Util/GetThemColor";
import { getTextColor } from "../../Util/GetTextColors";



function VehicleTrends() {

  const { theme } = GetThemeColor();

  const { data } = useGetVehicalListQuery(); // Fetch vehicle list from the API
  const [vehicalList, setVehicalList] = useState(data ? data.data : []); // Local state for vehicle list
  const [filterType, setFilterType] = useState("brandName"); // Filter type: modelName, modelYear, or brandName
  const [chartData, setChartData] = useState([]); // Chart data
  const [startYear, setStartYear] = useState(""); // Start year for range filter
  const [endYear, setEndYear] = useState(""); // End year for range filter

  useEffect(() => {
    if (data && data.data) {
      setVehicalList(data.data); // Sync the local vehicle list with API data
    }
  }, [data]);


  // Prepare data for chart based on filter type (modelName, modelYear, brandName)
  const getChartData = (filter) => {
    const countData = {};
    let filteredVehicles = vehicalList;

    // If filtering by year range, filter the vehicles
    if (filter === "year" && startYear && endYear) {
      filteredVehicles = filteredVehicles.filter(
        (item) => item.modelYear >= parseInt(startYear) && item.modelYear <= parseInt(endYear)
      );
    }

    // Aggregate vehicle count based on selected filter (modelName, modelYear, brandName)
    filteredVehicles.forEach((item) => {
      const filterValue = filter === "year" ? item.modelYear : item[filter]; // dynamic filter based on modelName, modelYear, or brandName
      if (countData[filterValue]) {
        countData[filterValue] += 1;
      } else {
        countData[filterValue] = 1;
      }
    });

    // Convert the object into an array suitable for the chart
    const formattedData = Object.keys(countData).map((key) => ({
      [filter]: key,
      count: countData[key],
    }));

    return formattedData;
  };

  // Recalculate chart data when filter type, vehicles, or year range changes
  useEffect(() => {
    setChartData(getChartData(filterType));
  }, [filterType, vehicalList, startYear, endYear]); // Recalculate chart data on filter type, vehicle list, or year range change

  // Get the maximum count for Y-axis scaling
  const maxCount = Math.max(...chartData.map((item) => item.count));



  return (
    <Box>
      <Paper
        sx={{
          pb: 0,
          boxShadow: "none",
          marginTop: '2%',
          height: "100%",
          borderRadius: '14px',
          background: theme === "black" ? 'rgb(58, 57, 57)' : "#ededed",
        }}
        elevation={0}
      >

        {/* Vehicle Trend BarChart */}
        <Box
          style={{
            display: 'flex',
            flexDirection: "column",
            height: '300px',
            gap: '2px',
            border: "2px solid rgba(0, 0, 0, 0.144)",
            borderRadius: "14px",
            paddingBottom: '14px',
          }}>

          <Typography variant="h5"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              // background: 'pink',
              fontSize: "14px",
              color: theme === "black" ? "White" : getTextColor(theme),
            }}>Vehicle Variant Trend</Typography>

          <div
            style={{
              width: '100%',
              display: "flex",
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: '4px'
            }}
          >
            {/* Dropdown to select filter type (Model Name, Year, or Brand) */}
            <Box
              style={{
                borderRadius: '5px'
              }}
            >
              <FormControl>
                <InputLabel
                  style={{
                    color: theme === "black" ? "White" : getTextColor(theme),
                  }}
                >Filter By</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Filter By"
                  style={{
                    width: 'auto',
                    // minWidth: '100px',
                    fontSize: "10px",
                    color: theme === "black" ? "White" : getTextColor(theme),
                    border: '1px solid gray'
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: theme === "black" ? "#444" : "#f5f5f5",  // Background color of the dropdown menu
                        color: theme === "black" ? "White" : getTextColor(theme),  // Text color of the dropdown menu
                        border: '2px solid gray'
                      },
                    },
                  }}
                >
                  <MenuItem value="brandName">Brand Name</MenuItem>
                  <MenuItem value="modelYear">Model Year</MenuItem>
                  <MenuItem value="modelName">Model Name</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {filterType === "year" && (
              <Box
                style={{
                  display: 'flex',
                  gap: '4px',
                  // border: `1px solid ${theme === "black" ? "Black" : "White"}`,
                  borderRadius: '5px'
                }}
              >
                <TextField
                  type="number"
                  label="Start Year"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  variant="outlined"
                  size="small"
                  style={{ width: '100px', marginBottom: '5px', background: 'transparent' }}
                  sx={{
                    // width: 'auto',
                    // margin: "5px",
                    height: '95%',
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
                      color: theme === "black" ? "White" : getTextColor(theme),
                    },
                  }}
                  InputLabelProps={{
                    // shrink: true,
                    style: { color: theme === "black" ? "White" : getTextColor(theme), }
                  }}
                />
                <TextField
                  type="number"
                  label="End Year"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  variant="outlined"
                  size="small"
                  style={{ width: '100px', marginBottom: '5px', background: 'transparent' }}
                  sx={{
                    // width: 'auto',
                    // margin: "5px",
                    height: '95%',
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
                      color: theme === "black" ? "White" : getTextColor(theme),
                    },
                  }}
                  InputLabelProps={{
                    // shrink: true,
                    style: { color: theme === "black" ? "White" : getTextColor(theme) }
                  }}
                />
              </Box>
            )}

          </div>


          <ResponsiveContainer width="95%" height="80%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} horizontal={false} />
              <XAxis
                dataKey={filterType} // Use the selected filter for X-axis
                tickFormatter={(value) => `${value}`} // Format X-axis labels
                strokeWidth={2} // Adjust the stroke width (thickness) of the X-axis line
                style={{ fontSize: "12px" }}
                tickSize={5}
                stroke={theme === "black" ? "white" : "black"}
              />
              <YAxis
                domain={[0, maxCount + 1]} // Ensure Y-axis starts at 0 and ends at the max count value
                tickFormatter={(value) => Math.floor(value)} // Ensure Y-axis shows whole numbers only
                ticks={Array.from({ length: Math.floor(maxCount / 2) + 1 }, (_, index) => index * 2)} // Generate ticks
                strokeWidth={2} // Adjust the stroke width (thickness) of the Y-axis line
                style={{ fontSize: "12px" }}
                tickSize={5}
                stroke={theme === "black" ? "white" : "black"}
              />

              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="top"
                iconSize={15}
                iconType="square"
                content={({ payload }) => (
                  <div
                    style={{
                      fontSize: '12px',
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-around",
                      paddingLeft: "10%",
                      paddingBottom: "5%",
                      whiteSpace: "nowrap",
                      color: theme === "black" ? "White" : getTextColor(theme),
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
                            width: "20px",
                            borderRadius: "5px",
                            height: "15px",
                            backgroundColor: "#ffd700",
                            marginRight: "5px",
                          }}
                        ></div>
                        <div>{entry.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              />

              {/* <Tooltip /> */}
              <Tooltip
                content={({ payload, label, active }) => {
                  if (active) {
                    return (
                      <div
                        style={{
                          backgroundColor: theme === "black" ? "gray" : "white",
                          color: theme === "black" ? "White" : getTextColor(theme),
                          padding: "10px",
                          borderRadius: "5px",
                          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "14px",      // Label size (bigger)
                            // fontWeight: "bold",    // Label bold
                            marginBottom: "5px",
                          }}
                        >
                          {label}
                        </div>
                        {payload.map((entry) => (
                          <div
                            key={entry.dataKey}
                            style={{
                              color: theme === "black" ? "White" : getTextColor(theme),
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "5px 0",
                            }}
                          >
                            <h2>{entry.name} :</h2>
                            <h2>&#160;{entry.value}</h2>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />


              <defs>
                {/* Gradient for "Complete" (Top to Bottom) */}
                <linearGradient id="VehicleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="10%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#665700" />
                </linearGradient>
              </defs>

              {/* <Bar dataKey="count" fill="#FFC300" radius={[14, 14, 0, 0]} /> */}
              <Bar dataKey="count" fill="url(#VehicleGradient)" radius={[10, 10, 0, 0]} />

            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}

export default VehicleTrends;


