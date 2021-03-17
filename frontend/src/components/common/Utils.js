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
 * Check if given string is a valid email address
 * @param str
 * @returns true if string is valid email, false otherwise
 */
export const stringIsEmail = (str) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    console.log(str.match(re));
    return str.match(re);
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
 * @returns {boolean} true if no rules are violated, false otherwise
 */
export const validateForm = (formRules) => {

    let formIsValid = true;

    // Validate each input
    for (const validation of formRules){

        let inputIsValid = true

        // Find possible feedback element
        let invalidFeedback = validation.feedbackEl != null ? validation.feedbackEl : validation.inputEl.nextElementSibling;
        if (invalidFeedback == null || !invalidFeedback.classList.contains("invalid-feedback")) {
            // Feedback element is not included, so ignore it
            invalidFeedback = null
        } else {
            // Clear feedback
            invalidFeedback.innerHTML = "";
        }

        // Check validity of each rule, and display feedback for each violation
        for (const rule of validation.rules) {
            if (!rule.isValid) {
                inputIsValid = false;
                // Check if feedback element is provided
                if (invalidFeedback != null) {
                    // Display feedback for this rule
                    invalidFeedback.style.display = "block";
                    invalidFeedback.innerHTML += rule.msg + "<br />";
                    if (formIsValid) {
                        // Scroll to first violation
                        const scrollTopPadding = document.getElementById("navbar").clientHeight + 100
                        window.scroll(0,validation.inputEl.offsetTop - scrollTopPadding);
                    }
                }
            }
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
