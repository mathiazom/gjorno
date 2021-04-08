/**
 * Update HTML document title with GjørNo suffix
 */
export const updatePageTitle = (prefix) => {
    document.title = prefix + " · GjørNo";
}

/**
 * Format phone number to [+47] XX XX XX XX
 * @param str
 * @returns {*}
 */
export const formatPhoneNumber = (str) => {
    return str.replaceAll(" ","").match(/\+?..?/g).join(" ");
}

/**
 * Decide if text should be light or dark based on background color
 * @param bgColor
 * @param lightColor
 * @param darkColor
 * @returns {*}
 */
export const getTextColorBasedOnBgColor = (bgColor, lightColor, darkColor) => {
    const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16); // hexToR
    const g = parseInt(color.substring(2, 4), 16); // hexToG
    const b = parseInt(color.substring(4, 6), 16); // hexToB
    return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
        darkColor : lightColor;
}
