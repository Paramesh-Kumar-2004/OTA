// Unused Component

import { Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCheckUpdateMutation } from "../../api/api";

function CampaignList() {
  const [checkUpdate, { isLoading }] = useCheckUpdateMutation();
  const [VIN, setVin] = useState("");
  const [VER, setcurrentVersion] = useState("");
  const [data, setData] = useState(null); // Null initially, as no data is fetched
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset previous data and error before fetching new data
    setData(null);
    setError(null);

    checkUpdate({ VIN, VER })
      .unwrap()
      .then((res) => {
        setData(res); // Set response data
      })
      .catch((err) => {
        enqueueSnackbar(err.data.userMessage, { variant: 'error' });
        setError(err.data.userMessage); // Set error message
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>VIN</label>
        <input
          placeholder="vin"
          style={{ height: "30px", display: "block", margin: "10px" }}
          type="text"
          value={VIN}
          onChange={(e) => setVin(e.target.value)}
        />
        <label>Current Version</label>
        <input
          placeholder="currentVersion"
          style={{ height: "30px", display: "block", margin: "10px" }}
          type="text"
          value={VER}
          onChange={(e) => setcurrentVersion(e.target.value)}
        />
        <input
          style={{
            height: "30px",
            display: "block",
            margin: "10px",
            background: "red",
            color: "#fff",
            border: "none",
          }}
          type="submit"
          value="Submit"
        />
      </form>

      {/* Loading Spinner */}
      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ marginTop: "20px", color: "red", textAlign: "center" }}>
          <strong>{error}</strong>
        </div>
      )}

      {/* Data Table */}
      {data && !isLoading && (
        <Table border="2px" cellSpacing="3px" style={{ marginTop: "20px" }}>
          <TableHead>
            <TableRow>
              <TableCell>Is Update Available</TableCell>
              <TableCell>Update Type</TableCell>
              <TableCell>Software URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{data['update-available'] ? "Yes" : "No"}</TableCell>
              <TableCell>{data.updateType}</TableCell>
              <TableCell>
                <Link to={`http://localhost:5000/api/v1/campaign/download/${data.softwarePath}`} target="_blank">
                  {data.softwarePath}
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default CampaignList;

