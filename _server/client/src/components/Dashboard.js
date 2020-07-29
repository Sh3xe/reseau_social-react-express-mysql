import React from "react";

import {UserContext} from "../App.js";

export default function Dashborad() {

    const user = React.useContext(UserContext);

    return (
        <div>
            {`Welcome ${JSON.stringify(user)}`}
        </div>
    );
}