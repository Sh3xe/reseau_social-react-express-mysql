import React from "react";

import {UserContext} from "../App.js";

export default function Friends() {

    const [friends, setFriends] = React.useState([]);
    const {user} = React.useContext(UserContext);

    React.useEffect(() => {
        fetch(`/api/user/${user.user_id}/friends`)
            .then(res => res.json())
            .then(users => setFriends(users))
    }, [user]);

    return (
        <div> {JSON.stringify(friends)} </div>
    );
}