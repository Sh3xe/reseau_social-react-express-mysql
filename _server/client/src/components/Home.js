import React from "react";

export default function Home() {
    return (
        <div>
            <h1>Home page.</h1>
            <p>Informations et docs du site.</p>
            <ul>
                <li> 
                    <h2>Doc à faire</h2>
                    <ul>
                        <li>Utilisation parsing</li>
                        <li>Différentes pages</li>
                        <li>Utilisation des Emojis</li>
                    </ul>
                </li>
                <li>
                    <h2>Liste des bugs connus</h2>
                </li>
                <li>
                    <h2>Prochainement</h2>
                    <ul>
                        <li>Jeux...</li>
                        <li>Data...</li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}