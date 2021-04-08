/**
 * Serially perform filtering on given activities based on list of filters
 * @param activities
 * @param filters
 * @returns {*}
 */
export const filterActivities = (activities, filters) => {

    let filteredActivities = activities;

    for (const filter of filters) {
        filteredActivities = filteredActivities.filter(filter);
    }

    return filteredActivities;

}