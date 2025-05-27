

// const GetThemeColor = () => {
//     const theme = localStorage.getItem("theme") || "dark"

//     return { theme };
// };

// export default GetThemeColor;




const GetThemeColor = () => {
    // Get the theme color from localStorage
    const theme = localStorage.getItem("theme");

    // Regular expressions to check for valid color formats
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i; // For Hex colors like #ff0000 or #f00
    const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/; // For RGB colors like rgb(255, 0, 0)
    const rgbaRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d?(\.\d+)?)\)$/; // For RGBA colors like rgba(255, 0, 0, 0.5)
    const colorNameRegex = /^(black|white|red|green|blue|yellow|orange|purple|pink|brown|gray|magenta|gold|cyan|indigo|violet|teal|lime|beige|maroon|navy|olive|charcoal|silver|peach|turquoise|lavender|fuchsia|mint|coral|salmon|ivory|plum|orchid|chocolate|wheat|tan|periwinkle|azure|sapphire|emerald|ruby|amber|rose|lavenderblush|snow|seashell|pearl|mauve|blush|peachpuff|papayawhip|skyblue)$/i;

    // Function to check if the color is valid
    function isValidColor(color) {
        return hexRegex.test(color) || rgbRegex.test(color) || rgbaRegex.test(color) || colorNameRegex.test(color);
    }

    // If theme is not valid, return "black", otherwise return the valid theme
    if (theme && isValidColor(theme)) {
        return { theme };
    } else {
        return { theme: "black" }; // Default to "black" if invalid
    }
};

export default GetThemeColor;
