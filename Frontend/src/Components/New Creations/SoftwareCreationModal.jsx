import React, { useState } from "react";
import { Modal, Box, Button, FormLabel, TextField, Typography} from "@mui/material";
import DropFileInput from "../DropFileInput";
import { useCreateSoftwareMutation } from "../../api/api";
import { v4 as uuidv4 } from "uuid";
import { enqueueSnackbar } from "notistack";
import GetThemeColor from "../../Util/GetThemColor";



const SoftwareCreationModal = ({ open, onClose }) => {


  const { theme } = GetThemeColor()
  
  const [softwareName, setSoftwareName] = useState("");
  const [version, setVersion] = useState("");
  const [files, setFiles] = useState(null);

  const generateShortUuid = () => {
    return uuidv4().split('-')[0].substring(0, 8);
  };

  const [softwareId] = useState(generateShortUuid());

  const [createSoftware] = useCreateSoftwareMutation();

  const onFileChange = (myfiles) => {
    setFiles(myfiles[0]);
  };

  const handleSoftwareCreation = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("softwareId", softwareId);
    formData.append("softwareName", softwareName);
    formData.append("version", version);
    formData.append("softwareFile", files);

    createSoftware(formData)
      .unwrap()
      .then(() => {
        enqueueSnackbar("Software created successfully", { variant: "success" });
        handleReset();
        onClose(); // Close modal after successful creation
      })
      .catch(() => {
        enqueueSnackbar("Failed to create software", { variant: "error" });
      });
  };

  const handleReset = () => {
    setFiles(null);
    setSoftwareName("");
    setVersion("");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: "absolute", 
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: (theme === "black" || theme === null || theme === undefined) ? "#1f2129" : "White",
        padding: "20px",
        borderRadius: "10px",
        width: "400px",
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" 
          style={{
            color: theme === "black" ? "White" : "black",
          }}
          >Create New Software</Typography>
          {/* <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton> */}
            {/* <div
            style={{
              color: theme === "black" ? "White" : "black",
              cursor:'pointer',
              fontSize:'24px'
            }}
            onClick={onClose}
            >X</div> */}

            <div
                style={{
                    display: 'block',
                    background: "transparent",
                    textAlign: 'end',
                }}
                onClick={onClose}
            >
                <Button variant='contained' color='error'>X</Button>
            </div>
        </Box>

        <form onSubmit={handleSoftwareCreation}>
          <div style={{ gap: "14px" }}>
            <div>
              <FormLabel
              style={{
                color:theme === "black" ? "White" : "black",
              }}
              >Software ID</FormLabel>
              <TextField
                fullWidth
                size="small"
                value={softwareId}
                disabled
                required
              />
            </div>
            <div>
              <FormLabel
              style={{
                color:theme === "black" ? "White" : "black",
              }}
              >Software Name</FormLabel>
              <TextField
                fullWidth
                size="small"
                value={softwareName}
                onChange={(e) => setSoftwareName(e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel
              style={{
                color:theme === "black" ? "White" : "black",
              }}
              >Version</FormLabel>
              <TextField
                fullWidth
                size="small"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                required
              />
            </div>
          </div>

          <DropFileInput onFileChange={onFileChange} />

          {files && (
            <Typography 
            style={{
              color: theme === "black" ? "White" : "black",
              fontWeight: 'bolder',
              fontSize: '20px',
              padding: '0.5%'
            }}>File ready to upload: {files.name}</Typography>
          )}

          <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
            <Button type="submit" variant="outlined" style={{
              width: "50%",
              backgroundColor: "#7656f7",
              color: "white",
              borderRadius: "10px"
            }}>
              Create Software
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default SoftwareCreationModal;


 


// import React, { useState } from "react";
// import { Modal, Box, Button, FormLabel, TextField, Typography, IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import DropFileInput from "../DropFileInput";
// import { useCreateSoftwareMutation } from "../../api/api";
// import { v4 as uuidv4 } from "uuid";
// import { enqueueSnackbar } from "notistack";

// const SoftwareCreationModal = ({ open, onClose, onSoftwareCreated }) => {
//   const [softwareName, setSoftwareName] = useState("");
//   const [version, setVersion] = useState("");
//   const [files, setFiles] = useState(null);

//   const generateShortUuid = () => {
//     return uuidv4().split('-')[0].substring(0, 8);
//   };

//   const [softwareId] = useState(generateShortUuid());
//   const [createSoftware] = useCreateSoftwareMutation();

//   const onFileChange = (myfiles) => {
//     setFiles(myfiles[0]);
//   };

//   const handleSoftwareCreation = (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append("softwareId", softwareId);
//     formData.append("softwareName", softwareName);
//     formData.append("version", version);
//     formData.append("softwareFile", files);

//     createSoftware(formData)
//       .unwrap()
//       .then(() => {
//         enqueueSnackbar("Software created successfully", { variant: "success" });
//         handleReset();
//         onSoftwareCreated({
//           softwareId,
//           softwareName,
//           version
//         }); // Pass the created software to the parent component
//         onClose(); // Close modal after successful creation
//       })
//       .catch(() => {
//         enqueueSnackbar("Failed to create software", { variant: "error" });
//       });
//   };

//   const handleReset = () => {
//     setFiles(null);
//     setSoftwareName("");
//     setVersion("");
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={{
//         position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
//         backgroundColor: "white", padding: "20px", borderRadius: "10px", width: "400px"
//       }}>
//         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Typography variant="h6">Create New Software</Typography>
//           <IconButton onClick={onClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
        
//         <form onSubmit={handleSoftwareCreation}>
//           <div style={{ gap: "14px" }}>
//             <div>
//               <FormLabel>Software ID</FormLabel>
//               <TextField
//                 fullWidth
//                 size="small"
//                 value={softwareId}
//                 disabled
//                 required
//               />
//             </div>
//             <div>
//               <FormLabel>Software Name</FormLabel>
//               <TextField
//                 fullWidth
//                 size="small"
//                 value={softwareName}
//                 onChange={(e) => setSoftwareName(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <FormLabel>Version</FormLabel>
//               <TextField
//                 fullWidth
//                 size="small"
//                 value={version}
//                 onChange={(e) => setVersion(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <DropFileInput onFileChange={onFileChange} />

//           {files && (
//             <Typography>File ready to upload: {files.name}</Typography>
//           )}

//           <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
//             <Button type="submit" variant="outlined" style={{
//               width: "50%",
//               backgroundColor: "#7656f7",
//               color: "white",
//               borderRadius: "10px"
//             }}>
//               OK
//             </Button>
//           </div>
//         </form>
//       </Box>
//     </Modal>
//   );
// };

// export default SoftwareCreationModal;
