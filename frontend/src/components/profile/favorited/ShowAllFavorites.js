import React from 'react';
import FavoriteActivity from './FavoriteActivity';
import axios from 'axios';
import ShowAll from "../ShowAll";

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
            <ShowAll
                title={"Alle favoritter"}
                activities={this.state.activities}
                renderItem={(activity) => (
                    <FavoriteActivity activity={activity} key={activity.id} />
                )}
            />
        )
    }
}
