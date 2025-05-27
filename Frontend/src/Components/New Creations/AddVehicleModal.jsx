import React, { useState } from 'react';
import { Modal, Box, TextField, Typography, Button, FormLabel } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useRegisterVehicalMutation } from '../../api/api';



const AddVehicleModal = ({ open, onClose, onVehicleAdded, theme }) => {

    const [newVehicle, setNewVehicle] = useState({
        vin: '',
        modelYear: '',
        modelName: '',
        brandName: '',
    });

    const [registerVehical] = useRegisterVehicalMutation();

    const handleAddVehicle = () => {
        registerVehical({
            vin: newVehicle.vin,
            modelYear: newVehicle.modelYear,
            modelName: newVehicle.modelName,
            brandName: newVehicle.brandName,
        })
            .unwrap()
            .then(() => {
                enqueueSnackbar("Vehicle added successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    },
                    autoHideDuration: 2000,
                });
                onVehicleAdded(newVehicle.vin); // Call the function passed as prop
                setNewVehicle({ vin: '', modelYear: '', modelName: '', brandName: '' }); // Reset fields
                onClose(); // Close modal after successful addition
            })
            .catch(() => {
                enqueueSnackbar("Please Enter All Fields Correctly", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    },
                    autoHideDuration: 2000,
                });
            });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: (theme === "black" || theme === null || theme === undefined) ? "#1f2129" : "White",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "400px"
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6"
                        style={{ color: theme === "black" ? "White" : "black" }}
                    >Create New Vehicle</Typography>
                    {/* <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton> */}
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

                <FormLabel
                    style={{
                        color: theme === "black" ? "White" : "black",
                    }}
                >VIN</FormLabel>
                <TextField
                    fullWidth
                    size='small'
                    required
                    // label="VIN"
                    value={newVehicle.vin}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                    sx={{ marginBottom: "20px" }}
                />

                <FormLabel
                    style={{ color: theme === "black" ? "White" : "black" }}
                >Brand Name</FormLabel>
                <TextField
                    fullWidth
                    size='small'
                    required
                    // label="Brand Name"
                    value={newVehicle.brandName}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brandName: e.target.value })}
                    sx={{ marginBottom: "20px" }}
                />

                <FormLabel
                    style={{ color: theme === "black" ? "White" : "black" }}
                >Model Year</FormLabel>
                <TextField
                    size='small'
                    fullWidth
                    // label="Model Year"
                    value={newVehicle.modelYear}
                    onChange={(e) => setNewVehicle({ ...newVehicle, modelYear: e.target.value })}
                    sx={{ marginBottom: "20px" }}
                />

                <FormLabel
                    style={{ color: theme === "black" ? "White" : "black" }}
                >Model Name</FormLabel>
                <TextField
                    fullWidth
                    size='small'
                    // label="Model Name"
                    value={newVehicle.modelName}
                    onChange={(e) => setNewVehicle({ ...newVehicle, modelName: e.target.value })}
                    sx={{ marginBottom: "20px" }}
                />

                <Button fullWidth onClick={handleAddVehicle} variant="contained" color="primary">
                    Add Vehicle
                </Button>
            </Box>
        </Modal >
    );
};

export default AddVehicleModal;



