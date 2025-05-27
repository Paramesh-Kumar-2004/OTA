import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as Chartjs, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';  // Import the plugin
import { useGetCampaignListQuery } from '../../api/api';
import GetThemeColor from "../../Util/GetThemColor";
import { Box, Paper, Typography } from "@mui/material";
import { getTextColor, getLightenedColor } from '../../Util/GetTextColors';


// Register Chart.js components
Chartjs.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels); // Register the plugin

function CampaignTypePieChart() {
    const { theme } = GetThemeColor();

    // State to store pie chart data
    const [pieData, setPieData] = useState({
        labels: [], // Store the labels (e.g., campaign types)
        datasets: [
            {
                label: 'Count',
                data: [], // Store the data (e.g., count of campaigns by type)
                backgroundColor: ['#06D001', '#FF0000'], // Customize the colors
                borderWidth: 1,
                borderColor: 'transparent',
            },
        ],
    });

    // API call to fetch campaign list
    const { data: CampaignList, isLoading: CampaignListLoading } = useGetCampaignListQuery();

    // Effect hook to process the data once it's fetched
    useEffect(() => {
        if (CampaignList && CampaignList.data) {
            // Filter to include only the specified campaign types (Silent, Critical, Normal)
            const filteredCampaigns = CampaignList.data.filter((campaign) =>
                ['Critical', 'Normal'].includes(campaign.campaignType)
            );

            // Count the occurrences of each filtered campaign type
            const campaignTypeCounts = filteredCampaigns.reduce((acc, campaign) => {
                const campaignType = campaign.campaignType; // Extract campaign type
                if (acc[campaignType]) {
                    acc[campaignType] += 1; // Increment count for the existing campaign type
                } else {
                    acc[campaignType] = 1; // Initialize count for a new campaign type
                }
                return acc;
            }, {});

            // Extract the campaign types (labels) and their respective counts (data) for the chart
            const labels = Object.keys(campaignTypeCounts); // Get all unique campaign types
            const data = Object.values(campaignTypeCounts); // Get the count for each campaign type

            // Update pieData state with new labels and data
            setPieData({
                labels: labels,
                datasets: [
                    {
                        ...pieData.datasets[0], // Keep the previous dataset properties
                        data: data, // New data for filtered campaign types
                    },
                ],
            });
        }
    }, [CampaignList]); // Re-run the effect whenever CampaignList data changes

    // Pie chart options with legend customization and data labels plugin options
    const chartOptions = {
        plugins: {
            legend: {
                position: 'top', // Set legend at the top
                labels: {
                    padding: 10,  // Adjust space between legend items
                    usePointStyle: true, // Use circle instead of squares for legends
                    font: {
                        size: 12, // Adjust legend font size
                    },
                    color: theme === "black" ? "White" : getTextColor(theme),
                },
            },
            datalabels: {
                display: true, // Show the data labels
                color: theme === "black" ? "White" : getTextColor(theme),
                font: {
                    weight: 'bold',
                    size: 14,
                },
                formatter: (value) => value, // Display the count value inside each slice
            },
        },
        responsive: true, // Make the chart responsive
        maintainAspectRatio: false, // Allow the chart to resize
    };

    if (CampaignListLoading) {
        return <p>Loading...</p>; // Display loading message while fetching
    }

    return (
        <Box>
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
                    borderRadius: "14px",
                    paddingBottom: '14px',
                    marginBottom: '2%',
                    background: theme === "black" ? 'rgb(58, 57, 57)' : theme === "white" ? "#ededed" : getLightenedColor(theme),
                }}>

                {pieData.labels.length > 0 && (
                    <Typography
                        variant="h5"
                        align="center"
                        style={{
                            fontSize: "16px",
                            color: theme === "black" ? "White" : getTextColor(theme),
                        }}
                    >
                        Campaign Type Distribution
                    </Typography>
                )}


                <div
                    style={{
                        width: '100%',
                        height: '80%',
                        display: 'flex',
                        justifyContent: "center",
                        alignItems: 'center'
                    }}>
                    {pieData.labels.length > 0 ? (
                        <Pie data={pieData} options={chartOptions} />
                    ) : (
                        <Typography
                            variant="h6"
                            align="center"
                            style={{
                                color: theme === "black" ? "White" : getTextColor(theme),
                                paddingTop: "40px",
                            }}
                        >
                            No Data Available
                        </Typography>
                    )}
                </div>
            </Box>
        </Box>
    );
}

export default CampaignTypePieChart;

