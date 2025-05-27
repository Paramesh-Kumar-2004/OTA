



export function getTextColor(backgroundColor) {
    // Function to get RGB from color name or hex
    function colorToRgb(color) {
        const tempElement = document.createElement('div');
        tempElement.style.color = color;
        document.body.appendChild(tempElement);
        const rgb = window.getComputedStyle(tempElement).color;
        document.body.removeChild(tempElement);
        return rgb;
    }

    // Get RGB value from color name or hex
    const rgb = colorToRgb(backgroundColor);
    const rgbArray = rgb.match(/\d+/g); // Extract RGB numbers

    // Calculate luminance using the formula
    const luminance = (0.2126 * rgbArray[0] + 0.7152 * rgbArray[1] + 0.0722 * rgbArray[2]) / 255;

    // Return text color based on luminance
    return luminance < 0.5 ? 'white' : 'black';
}



export function getLightenedColor(color) {
    const lightnessFactor = 0.5; // Adjust this value to control how much lighter the color should be.

    // Create a temporary div to get the computed color
    const tempElement = document.createElement('div');
    tempElement.style.color = color;
    document.body.appendChild(tempElement);
    const rgb = window.getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);

    // Convert RGB to array
    const rgbArray = rgb.match(/\d+/g);

    // Lighten the color
    let r = Math.round(parseInt(rgbArray[0]) + (255 - parseInt(rgbArray[0])) * lightnessFactor);
    let g = Math.round(parseInt(rgbArray[1]) + (255 - parseInt(rgbArray[1])) * lightnessFactor);
    let b = Math.round(parseInt(rgbArray[2]) + (255 - parseInt(rgbArray[2])) * lightnessFactor);

    return `rgb(${r}, ${g}, ${b})`;
}



