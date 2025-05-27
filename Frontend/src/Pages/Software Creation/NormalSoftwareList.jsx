import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { useGetSoftwareListQuery } from "../../api/api";
import GetThemeColor from "../../Util/GetThemColor";
import { CSS_STYLE } from "../../Constants/Constant";
import Header from "../../Components/Header/Header";
import { getTextColor } from "../../Util/GetTextColors";




function NormalSoftwareList() {

  const { data: softwareData, isloading: isLoadingsoftware } = useGetSoftwareListQuery()
  const softwareList = softwareData ? softwareData.data : [];  // Fallback to empty array if undefined
  const { theme } = GetThemeColor();

  const [currentPage, setCurrentPage] = useState(1);
  // const [dataPerPage, setDataPerPage] = useState(10);
  const dataPerPage = 10

  const indexoflastpost = currentPage * dataPerPage
  const indexoffirstpost = indexoflastpost - dataPerPage

  const totalpage = Math.ceil(softwareList.length / dataPerPage)

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
  const currentData = softwareList.slice(indexoffirstpost, indexoflastpost)

  if (isLoadingsoftware) {
    return (
      <div style={{ display: "flex" }}>
        <div style={{ marginTop: "5px" }}>Loading Softwares</div>
        <div className="spinner"></div>
      </div>
    ); // Display loading message while fetching data
  }


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
            zIndex: 1
          }}>
          <Header title={"Software Management"} />
        </div>

        <Box sx={{ width: "100%", marginTop: "40px" }}>

          <Button
            color="primary"
            size="large"
            style={{
              color: theme === "black" ? "White" : getTextColor(theme),
              border: '2px solid gray',
              borderRadius: '0px',
              background: '#6946c6',
            }}
          >Software List</Button>

          <Box sx={{ marginTop: "4%" }} >
            <Table>
              <TableHead
                sx={{
                  borderRadius: "8px 8px 0px 0px",
                  background: CSS_STYLE.Table_Head,
                  "& th": {
                    textAlign: "center",
                    color: theme === "black" ? "White" : getTextColor(theme),
                    fontSize: "14px",
                    fontWeight: "500",
                    letterSpacing: "1.32px",
                    borderRight: "1px solid #fff",
                    whiteSpace: "normal", // Allows text to wrap
                    wordWrap: "break-word", // Wraps long words
                    overflow: "hidden", // Hides overflowing content
                    textOverflow: "ellipsis", // Shows ellipsis when content overflows
                    maxWidth: "120px", // Optional: Set max width for header cells
                  },
                }}
              >
                <TableRow>
                  <TableCell>Softwares</TableCell>
                  <TableCell>Software Name</TableCell>
                  <TableCell>Software Size</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell>Creation Date</TableCell>
                </TableRow>
              </TableHead>

              <TableBody
                sx={{ background: CSS_STYLE.Table_Body }}
              >
                {currentData.map((item) => (
                  <TableRow key={item.softwareId}
                    sx={{
                      "&:last-child tr": {
                        borderRadius: "0px 0px 10px 10px",
                      },
                      "& td": {
                        // background: CSS_STYLE.Table_Body,
                        margin: "1px",
                        borderRight: "1px solid #fff",
                        borderBottom: "1px solid #fff",
                        textAlign: "center",
                        overflow: "hidden", // Hide content overflow in body
                        textOverflow: "ellipsis", // Truncate content with ellipsis if necessary
                      },
                    }}
                  >
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.softwareName}</TableCell>
                    <TableCell>{item.softwareSize}</TableCell>
                    <TableCell>{item.version}</TableCell>
                    <TableCell>{format(new Date(item.createdAt), "yyyy-MM-dd HH:mm")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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

            {/* <DeletedSoftwareHistory /> */}
          </Box>
        </Box>
      </Paper>
      {/* <DeletedSoftwareHistory /> */}
    </Box>
  );
}

export default NormalSoftwareList

