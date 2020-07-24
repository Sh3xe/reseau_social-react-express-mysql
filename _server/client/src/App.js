import React from 'react';

import {BrowserRouter as Router} from "react-router-dom";

import SiteRouter from "./SiteRouter.js";
import Navigation from "./components/Navigation";

import "./style.css";

function App() {
    return (
        <Router>
            <Navigation />
            <SiteRouter />
        </Router>
    );
}

export default App;
