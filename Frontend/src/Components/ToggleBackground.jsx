import React, { useState } from 'react';
import GetThemeColor from '../Util/GetThemColor.js';
import "../Styles/ToggleBackground.css"



const ThemeToggleButton = ({ onToggle }) => {

    const { theme } = GetThemeColor();

    // Set the initial state based on storedBackground value
    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        if (theme === "black") {
            return true; // Dark theme
        }
        else if (theme !== "black") {
            return false; // Light theme
        }
        return true; // Default to dark theme if no data exists
    });


    const toggleTheme = () => {
        setIsDarkTheme((prevState) => !prevState);
        // Additional logic to change theme globally if needed
        document.body.classList.toggle('dark-theme', !isDarkTheme);

        const newTheme = !isDarkTheme;  // Toggle the theme (dark <-> light)
        setIsDarkTheme(newTheme);       // Update the state

        console.log(`Current Theme: ${newTheme ? 'black' : theme}`);

        // Call the onToggle function passed as a prop when theme is toggled
        if (onToggle) {
            onToggle(); // This will call the `fun` function from App.jsx
        }
    };

    return (
        <label className="switch">
            <input
                type="checkbox"
                checked={isDarkTheme}
                onChange={toggleTheme}
                id="input"
            />
            <div className="slider round">
                <div className="sun-moon">
                    {/* <svg id="moon-dot-1" className="moon-dot" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="moon-dot-2" className="moon-dot" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="moon-dot-3" className="moon-dot" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg> */}
                    <svg id="light-ray-1" className="light-ray" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="light-ray-2" className="light-ray" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="light-ray-3" className="light-ray" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>

                    {/* <svg id="cloud-1" className="cloud-dark" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="cloud-2" className="cloud-dark" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="cloud-3" className="cloud-dark" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="cloud-4" className="cloud-light" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="cloud-5" className="cloud-light" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg> 
                    <svg id="cloud-6" className="cloud-light" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg> */}
                </div>
                {/* <div className="stars">
                    <svg id="star-1" className="star" viewBox="0 0 20 20">
                        <path
                            d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                        ></path>
                    </svg>
                    <svg id="star-2" className="star" viewBox="0 0 20 20">
                        <path
                            d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                        ></path>
                    </svg>
                    <svg id="star-3" className="star" viewBox="0 0 20 20">
                        <path
                            d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                        ></path>
                    </svg>
                    <svg id="star-4" className="star" viewBox="0 0 20 20">
                        <path
                            d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                        ></path>
                    </svg>
                </div> */}
            </div>
        </label>
    );
};

export default ThemeToggleButton;
