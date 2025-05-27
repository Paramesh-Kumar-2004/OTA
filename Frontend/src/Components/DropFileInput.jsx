import React, { useState, useRef } from "react";
import { PropTypes } from "prop-types";
import {
  Box,
} from "@mui/material";
import uploadIcon from "../images/UploadIcon.png";
import { Typography } from "@mui/material";
import GetThemeColor from "../Util/GetThemColor";
import { getTextColor } from "../Util/GetTextColors";



const DropFileInput = (props) => {

  const { theme } = GetThemeColor();

  const wrapperRef = useRef(null);

  const [fileList, setFileList] = useState([]);


  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      props.onFileChange(updatedList);
    }
  };

  //const fileRemove = (file) => {
  //   const updatedList = [...fileList];
  //   updatedList.splice(fileList.indexOf(file), 1);
  //   setFileList(updatedList);
  //   props.onFileChange([]);
  // };

  return (
    <>
      <Box
        sx={{ borderColor: "primary.main", height: "10%", width: 'auto' }}
        ref={wrapperRef}
        className="drop-file-input"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-file-input__label">
          <img src={uploadIcon} alt="" />
          <Typography variant="subtitle1" component="p"
            style={{
              color: theme === "black" ? "White" : getTextColor(theme),
              fontWeight: 'bolder',
              fontSize: '14px'
            }}
          >
            Drag & Drop or &#160;
            <Typography
              component="span"
              color="primary"
              sx={{ margin: "0px 2px" }}
            >
              Choose File &#160;
            </Typography>
            to upload
          </Typography>
        </div>
        <input type="file" name="softwareFile" value="" onChange={onFileDrop} />
      </Box>


    </>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;


