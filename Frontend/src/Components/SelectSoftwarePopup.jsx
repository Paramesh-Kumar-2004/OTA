import React, { useState, useEffect, useRef } from 'react';
import { useGetSoftwareListQuery } from '../api/api';  // Fetch software list data
import { Checkbox, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import "../Styles/VehicleSelectionPopUp.css";  // Keep the existing CSS
import GetThemeColor from "../Util/GetThemColor";
import { getTextColor } from '../Util/GetTextColors';



function SelectSoftwarePopup({ onSelectedSoftwareChange, closeModal }) {
    const { data: softwareData, isLoading: isSoftwareLoading, error: softwareError } = useGetSoftwareListQuery();
    const softwareList = softwareData?.data || [];  // Default to an empty array if data is undefined
    // const [filterName, setFilterName] = useState("");  // State for filter
    const filterName = ""
    const [selectedSoftware, setSelectedSoftware] = useState('');  // State to hold the selected software's softwareId

    const { theme } = GetThemeColor();

    // Create a reference for the modal container
    const modalRef = useRef();

    // Fetch selected software from sessionStorage when the component mounts
    useEffect(() => {
        const savedSelectedSoftware = sessionStorage.getItem('selectedSoftware');
        if (savedSelectedSoftware) {
            setSelectedSoftware(savedSelectedSoftware);  // Update state with saved selected softwareId
        }

        // Close the modal if a click is detected outside the modal content
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                if (window.confirm("Are You Sure You Want To Clear The Selected Software ? \nClick 'OK' To Proceed")) {
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
    if (isSoftwareLoading) {
        return <div>Loading...</div>;
    }

    // Handle error state
    if (softwareError) {
        return <div>Error: {softwareError.message}</div>;
    }

    // Handle checkbox change
    const handleCheckboxChange = (event, softwareId) => {
        let updatedSelectedSoftware;

        if (event.target.checked) {
            updatedSelectedSoftware = softwareId; // Store the selected softwareId
        } else {
            updatedSelectedSoftware = ""; // Reset to null when unchecked
        }

        setSelectedSoftware(updatedSelectedSoftware); // Update local state

        // Save the updated selected softwareId to sessionStorage (store as a single value)
        sessionStorage.setItem('selectedSoftware', updatedSelectedSoftware);
    };

    // Handle confirm action
    const handleConfirm = () => {
        // Get selected software details
        const selectedSoftwareDetails = softwareList.find(software => software.softwareId === selectedSoftware);

        // Pass the selected software details to the parent component
        onSelectedSoftwareChange(selectedSoftwareDetails);
        closeModal();  // Close modal after confirmation
    };

    function HandleCancel() {
        onSelectedSoftwareChange('');
        closeModal();
        sessionStorage.removeItem("selectedSoftware")
    }

    return (
        <div>
            {/* Modal structure with applied styles */}
            <div className="modal-overlay">
                <div className="modal-content" ref={modalRef}
                    style={{
                        background: (theme === "black" || theme === null || theme === undefined) ? "#1f2129" : theme,
                    }}>

                    {softwareList.length > 0 ? (
                        <div>
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

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead style={{ background: "#6846c7" }}>
                                        <TableRow>
                                            <TableCell className={theme === "black" ? "VehiclePopUpTableHeadCellDark" : "VehiclePopUpTableHeadCellWhite"}>
                                                Select
                                            </TableCell>
                                            <TableCell className={theme === "black" ? "VehiclePopUpTableHeadCellDark" : "VehiclePopUpTableHeadCellWhite"}>
                                                Software ID
                                            </TableCell>
                                            <TableCell className={theme === "black" ? "VehiclePopUpTableHeadCellDark" : "VehiclePopUpTableHeadCellWhite"}>
                                                Software Name
                                            </TableCell>
                                            <TableCell className={theme === "black" ? "VehiclePopUpTableHeadCellDark" : "VehiclePopUpTableHeadCellWhite"}>
                                                Software Version
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody style={{ background: "white" }}>
                                        {softwareList
                                            .filter((software) => software.softwareName?.toLowerCase().includes(filterName.toLowerCase()))
                                            .map((software) => (
                                                <TableRow key={software.softwareId}>
                                                    <TableCell className={theme === "black" ? 'VehiclePopUpTableBodyCellDark' : 'VehiclePopUpTableBodyCellWhite'}>
                                                        <Checkbox
                                                            style={{ color: theme === "black" ? "White" : getTextColor(theme) }}
                                                            checked={selectedSoftware === software.softwareId} // Check if the softwareId matches the selected one
                                                            onChange={(event) => handleCheckboxChange(event, software.softwareId)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className={theme === "black" ? 'VehiclePopUpTableBodyCellDark' : 'VehiclePopUpTableBodyCellWhite'}>
                                                        {software.softwareId}
                                                    </TableCell>
                                                    <TableCell className={theme === "black" ? 'VehiclePopUpTableBodyCellDark' : 'VehiclePopUpTableBodyCellWhite'}>
                                                        {software.softwareName}
                                                    </TableCell>
                                                    <TableCell className={theme === "black" ? 'VehiclePopUpTableBodyCellDark' : 'VehiclePopUpTableBodyCellWhite'}>
                                                        {software.version}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                    ) : (
                        <div>No software found</div>
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
                            disabled={selectedSoftware.length === 0}  // Disable confirm button if no software is selected
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

export default SelectSoftwarePopup;
