import React, { useState, useEffect, useRef } from 'react';
import { useGetVehicalListQuery } from '../api/api';
import { Checkbox, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import "../Styles/VehicleSelectionPopUp.css";
import GetThemeColor from "../Util/GetThemColor"
import { getTextColor } from '../Util/GetTextColors';



function Popup({ onSelectedVehiclesChange, closeModal }) {
    const { data: vehicleData, isLoading: isVehicleLoading, error: vehicleError } = useGetVehicalListQuery();
    const vehicalList = vehicleData?.data || []; // Default to an empty array if data is undefined
    const [filterName, setFilterName] = useState(""); // State for filter
    const [selectedVehicles, setSelectedVehicles] = useState([]); // State to hold the selected vehicles' vin

    const { theme } = GetThemeColor();

    // Create a reference for the modal container
    const modalRef = useRef();


    // Fetch selected vehicles from sessionStorage when the component mounts
    useEffect(() => {
        const savedSelectedVehicles = JSON.parse(sessionStorage.getItem('selectedVehicles') || '[]');
        setSelectedVehicles(savedSelectedVehicles); // Update state with selected VINs

        // Close the modal if a click is detected outside the modal content
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                if (window.confirm("Are You Sure You Want To Clear The Selected Vehicles ? \nClick 'OK' To Proceed")) {
                    HandleCancel();
                }
            }
        };

        // Add event listener for detecting clicks outside
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeModal]);

    // Handle loading state
    if (isVehicleLoading) {
        return <div>Loading...</div>;
    }

    // Handle error state
    if (vehicleError) {
        return <div>Error: {vehicleError.message}</div>;
    }

    // Handle checkbox selection/deselection
    const handleCheckboxChange = (event, vin) => {
        let updatedSelectedVehicles;
        if (event.target.checked) {
            updatedSelectedVehicles = [...selectedVehicles, vin]; // Add vehicle to selected
        } else {
            updatedSelectedVehicles = selectedVehicles.filter((item) => item !== vin); // Remove vehicle from selected
        }

        setSelectedVehicles(updatedSelectedVehicles); // Update local state

        // Save the updated selected vehicles to sessionStorage
        sessionStorage.setItem('selectedVehicles', JSON.stringify(updatedSelectedVehicles));
    };


    // Handle confirm action
    const handleConfirm = () => {
        // Get selected vehicle details
        const selectedVehicleDetails = vehicalList.filter(vehicle => selectedVehicles.includes(vehicle.vin))
            .map(vehicle => ({
                vin: vehicle.vin,
                brandName: vehicle.brandName,
                modelName: vehicle.modelName,
                modelYear: vehicle.modelYear
            }));

        // Pass the selected vehicle details to the parent component
        onSelectedVehiclesChange(selectedVehicleDetails);
        closeModal(); // Close modal after confirmation
    };

    function HandleCancel() {
        closeModal()
        sessionStorage.removeItem("selectedVehicles")
        onSelectedVehiclesChange([]);
    }

    return (
        <div >
            {/* Modal structure with applied styles */}
            <div className="modal-overlay">
                <div className="modal-content" ref={modalRef}
                    style={{
                        background: (theme === "black" || theme === null || theme === undefined) ? "#1f2129" : "White",
                        padding: '14px'
                    }}>
                    <div
                        style={{
                            display: 'block',
                            background: "transparent",
                            textAlign: 'end',
                            cursor: 'pointer',
                            position: "sticky",
                            top: '0px',
                            paddingBottom: '1px'
                        }}
                        onClick={HandleCancel}
                    >
                        <Button variant='contained' color='error'>X</Button>
                    </div>
                    {/* Table to display vehicle list */}
                    {vehicalList.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead style={{ background: "#6846c7" }}>
                                    <TableRow>
                                        <TableCell className={theme === "black" ? "VehiclePopUpTableHeadCellDark" : "VehiclePopUpTableHeadCellWhite"}
                                        >Select</TableCell>
                                        <TableCell className={theme === "black" ? "VehiclePopUpTableHeadCellDark" : "VehiclePopUpTableHeadCellWhite"}
                                        >VIN</TableCell>
                                        <TableCell className={theme === "black" ? "VehiclePopUpTableHeadCellDark" : "VehiclePopUpTableHeadCellWhite"}
                                        >Brand Name</TableCell>
                                        <TableCell className={theme === "black" ? "VehiclePopUpTableHeadCellDark" : "VehiclePopUpTableHeadCellWhite"}
                                        >Model Name</TableCell>
                                        <TableCell className={theme === "black" ? "VehiclePopUpTableHeadCellDark" : "VehiclePopUpTableHeadCellWhite"}
                                        >Model Year</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{ background: (theme === "black" || theme === null || theme === undefined) ? "#1f2129" : "White" }}>
                                    {vehicalList
                                        .filter((vehicle) => vehicle.modelName.toLowerCase().includes(filterName.toLowerCase()))
                                        .map((vehicle) => (
                                            <TableRow key={vehicle.vin}>
                                                <TableCell className={theme === "black" ? 'VehiclePopUpTableBodyCellDark' : 'VehiclePopUpTableBodyCellWhite'}>
                                                    <Checkbox style={{ color: theme === "black" ? "White" : getTextColor(theme) }}
                                                        checked={selectedVehicles.includes(vehicle.vin)} // Check if vehicle is selected
                                                        onChange={(event) => handleCheckboxChange(event, vehicle.vin)}
                                                    />
                                                </TableCell>
                                                <TableCell className={theme === "black" ? 'VehiclePopUpTableBodyCellDark' : 'VehiclePopUpTableBodyCellWhite'}>
                                                    {vehicle.vin}
                                                </TableCell>
                                                <TableCell className={theme === "black" ? 'VehiclePopUpTableBodyCellDark' : 'VehiclePopUpTableBodyCellWhite'}>
                                                    {vehicle.brandName}
                                                </TableCell>
                                                <TableCell className={theme === "black" ? 'VehiclePopUpTableBodyCellDark' : 'VehiclePopUpTableBodyCellWhite'}>
                                                    {vehicle.modelName}
                                                </TableCell>
                                                <TableCell className={theme === "black" ? 'VehiclePopUpTableBodyCellDark' : 'VehiclePopUpTableBodyCellWhite'}>
                                                    {vehicle.modelYear}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <div>No vehicles found</div>
                    )}

                    {/* Confirm and Cancel buttons */}
                    <div style={{
                        marginTop: "20px",
                        textAlign: "center",
                        display: 'flex',
                        justifyContent: 'space-evenly',
                    }}>
                        <Button
                            className="modal-confirm-btn"
                            variant="contained"
                            color="primary"
                            onClick={handleConfirm}
                            disabled={selectedVehicles.length === 0}
                            style={{ width: '40%' }}
                        >
                            Confirm Selection
                        </Button>
                        <Button
                            className="modal-cancel-btn"
                            variant="contained"
                            color="error"
                            onClick={HandleCancel}
                            style={{ width: '40%' }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Popup;

