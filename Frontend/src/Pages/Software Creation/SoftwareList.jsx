import React, { useState } from "react";
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { format } from "date-fns";
import { CSS_STYLE } from "../../Constants/Constant";
import GetThemeColor from "../../Util/GetThemColor";
import { getTextColor } from "../../Util/GetTextColors"

function SoftwareList({ softwareList, handleDeleteSoftware }) {

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


  return (
    <Box sx={{ marginTop: "26px" }} >
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
              border: "1px solid #6B46C1",
              whiteSpace: "normal", // Allows text to wrap
              wordWrap: "break-word", // Wraps long words
              overflow: "hidden", // Hides overflowing content
              textOverflow: "ellipsis", // Shows ellipsis when content overflows
              maxWidth: "120px", // Optional: Set max width for header cells
            },
          }}
        >
          <TableRow>
            <TableCell>Software ID</TableCell>
            <TableCell>Software Name</TableCell>
            {/* <TableCell>Software ID</TableCell> */}
            <TableCell>Version</TableCell>
            <TableCell>Software Size</TableCell>
            <TableCell>Creation Date</TableCell>
            <TableCell>Action</TableCell>
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
                height: '5px',
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
              <TableCell>{item.softwareId}</TableCell>
              <TableCell>{item.softwareName}</TableCell>
              {/* <TableCell>{item.softwareId}</TableCell> */}
              <TableCell>{item.version}</TableCell>
              <TableCell>{item.softwareSize}</TableCell>
              <TableCell>{format(new Date(item.createdAt), "yyyy-MM-dd HH:mm")}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  // onClick={() => handleSoftwareDeleteStatus(item.softwareId)}
                  onClick={() => {
                    const confirmDelete = window.confirm(`Are You Sure You Want To Delete ${item.softwareName} ?`)
                    if (confirmDelete) {
                      handleDeleteSoftware(item.softwareId)
                    }
                  }}
                >
                  Delete
                </Button>
              </TableCell>

              {/* <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  color="info"
                // onClick={() => handleSoftwareDeleteStatus(item.softwareId)}
                >
                  Details
                </Button>
              </TableCell> */}
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
  );
}

export default SoftwareList;


