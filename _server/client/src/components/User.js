import React from "react";

export default function User(props) {

    const [user, setUser] = React.useState({});

    const {user_id} = props.match.params;

    React.useEffect(() => {
        fetch(`/api/user/${user_id}`)
            .then(res => res.json())
            .then(user => setUser(user))
    }, [user_id]);

    return (
        <div>
            <h1>{user.user_name}</h1>
            <p>{JSON.stringify(user)}</p>
        </div>
    );
}