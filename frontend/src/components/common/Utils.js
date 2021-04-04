/**
 * Create Date object from ISO date string
 */
export const getDateFromString = (s) => {
    return new Date(s.slice(0, 4), s.slice(5, 7) - 1, s.slice(8, 10), s.slice(11, 13), s.slice(14, 16))
}

/**
 * Check if string is empty or just white-space
 */
export const stringIsBlank = (str) => {
    return str.length === 0 || !str.trim()
}

/**
 * Check if string is positive float
 */
export const stringIsPositiveFloat = (str) => {
    return /^\d+\.?\d*$/.test(str) && parseInt(str) !== 0
}

/**
 * Check if given string is a valid email address
 * @param str
 * @returns true if string is valid email, false otherwise
 */
export const stringIsEmail = (str) => {
    if (str == null || stringIsBlank(str)) {
        return false;
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(str);
}

/**
 * Check if given string is a valid phone number
 * @param str
 * @returns true if string is valid phone number, false otherwise
 */
export const stringIsPhoneNumber = (str) => {
    if (str == null || stringIsBlank(str)) {
        return false;
    }
    return /^(\+47)?[2-9][0-9]?(?:\d\d){0,3}/.test(str);
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

/**
 * Utility function to validate a list of input fields
 * @param formRules: list of rule objects
 *        example:
 *          [
 *              ...
 *              {
                    inputEl: titleInput,
                    [feedbackEl: feedbackElement] // optional feedback element
                    rules: [
                        {
                            isValid: !this.stringIsBlank(titleInput.value),
                            msg: "Title is required"
                        },
                        {
                            isValid: titleInput.value <= 50,
                            msg: "Title can not be longer than 50 characters"
                        }
                    ]
                }
 ...
 ]
 * @param withScroll true (default) if validation should scroll to first invalid element, false otherwise
 * @returns {boolean} true if no rules are violated, false otherwise
 */
export const validateForm = (formRules, withScroll=true) => {

    let formIsValid = true;

    // Validate each input
    for (const validation of formRules){

        let inputIsValid = true;

        // Check validity of each rule, and collect feedback for each violation
        const feedback = [];
        for (const rule of validation.rules) {
            if (!rule.isValid) {
                inputIsValid = false;
                feedback.push(rule.msg);
            }
        }

        // Display feedback if feedback element is provided
        let invalidFeedback = validation.feedbackEl != null ? validation.feedbackEl : validation.inputEl.nextElementSibling;
        if (invalidFeedback != null && invalidFeedback.classList.contains("invalid-feedback")) {
            displayValidationFeedback(feedback, invalidFeedback, withScroll && formIsValid, validation.inputEl);
        }

        if (!inputIsValid) {
            // Update form validity
            formIsValid = false;
            // Style input as invalid
            validation.inputEl.classList.add("is-invalid");
        } else {
            // Remove invalid style from input
            validation.inputEl.classList.remove("is-invalid");
        }

    }

    return formIsValid;

}

/**
 * Display feedback for input rule violation
 * @param msgs list of feedback messages to display
 * @param feedbackEl element to display feedback in
 * @param withScroll should the window scroll to the input element
 * @param inputEl input element to scroll to if withScroll
 */
export const displayValidationFeedback = (msgs, feedbackEl, withScroll=false, inputEl=null) => {
    // Display feedback for this rule (clear any existing text)
    feedbackEl.style.display = "block";
    feedbackEl.innerHTML = "";
    for(const msg of msgs){
        feedbackEl.innerHTML += msg + "<br />";
    }
    if (withScroll && inputEl != null) {
        // Scroll to input with violation
        const scrollTopPadding = document.getElementById("navbar").clientHeight + 100
        window.scroll(0,inputEl.offsetTop - scrollTopPadding);
    }
}
