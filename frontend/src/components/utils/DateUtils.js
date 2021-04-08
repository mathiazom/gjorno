/**
 * Check if the given time is in the future
 * @param time
 * @returns {boolean}
 */
export const isInFuture = (time) => {
    return new Date().getTime() < new Date(time).getTime();
}

/**
 * Create Date object from ISO date string
 */
export const getDateFromString = (s) => {
    return new Date(s.slice(0, 4), s.slice(5, 7) - 1, s.slice(8, 10), s.slice(11, 13), s.slice(14, 16))
}

/**
 * Compares the dates for two activities, based on whether the activity has registration or not (starting_time/log_timestamp).
 * @param {*} a1 first activity
 * @param {*} a2 second activity
 * @returns a positive integer if a1 is before a2, a negative integer if a2 is before a1, or 0 if they have the same time.
 */
export const compareActivityDates = (a1, a2) => {
    const date1 = a1.has_registration ? new Date(a1.starting_time) : new Date(a1.log_timestamp);
    const date2 = a2.has_registration ? new Date(a2.starting_time) : new Date(a2.log_timestamp);
    return date1 - date2;
}