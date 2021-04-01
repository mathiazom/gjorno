export const filterActivities = (activities, filters) => {

    let filteredActivities = activities;

    for (const filter of filters) {
        filteredActivities = filteredActivities.filter(filter);
    }

    return filteredActivities;

}