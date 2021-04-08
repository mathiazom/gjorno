import React from 'react';
import FavoriteActivity from './FavoriteActivity';
import axios from 'axios';
import ActivitiesList from "../ActivitiesList";

/**
 * Page for all activities favorited by the logged in user
 */
export default class ShowAllFavorites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: []
        }
    }

    componentDidMount() {
        axios.get("http://localhost:8000/api/my_favorite_activities/",
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                this.setState({activities: res.data});
            })
            .catch(error => {
                console.log(error.response);
        });
    }

    render() {
        return (
            <ActivitiesList
                title={"Alle favoritter"}
                activities={this.state.activities}
                renderItem={(activity) => (
                    <FavoriteActivity activity={activity} key={activity.id} />
                )}
            />
        )
    }
}
