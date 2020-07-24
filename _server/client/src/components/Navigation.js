import React from "react";
import {Link} from "react-router-dom";

export default function() {

    return (
        <header className="site-header">
            <div className="header-container">
                <ul className="site-nav">
                    <li><Link to="/">Accueil</Link></li>
                    <li><Link to="/posts">Posts</Link></li>
                    <li className="dropdown">
                        <Link to="/community">Communauté</Link>
                        <ul className="dropdown-content">
                            <li><Link to="/chatrooms">Salons</Link></li>
                            <li><Link to="/games">Jeux</Link></li>
                        </ul>
                    </li>
                </ul>
                <ul className="site-user">
                    <li className="dropdown">
                        <Link to="/me">Mon compte</Link>
                        <ul className="dropdown-content">
                            <li><Link to="/profil">Profil</Link></li>
                            <li><Link to="/friends">Amis</Link></li>
                            <li><Link to="/logout">Se deconnecter</Link></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </header>
    );
}