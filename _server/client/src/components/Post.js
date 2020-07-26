import React from "react";

import {Link} from "react-router-dom";
import {formatDate} from "../utils.js";

function Comments() {
    return (
        <React.Fragment>
        <form class="comment-form">
            <textarea class="input t1"></textarea>
            <button class="button col1">Submit</button>
        </form>
        <div class="comments">
            <div class="comment">
                <div class="comment-header">
                    Par arthur le 20/02/20 à 10H50
                </div>
                <div class="comment-content">
                    On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même.
                </div>
            </div>
            <div class="page-controller">
                <button class="button norm">Page précédente</button>
                <button class="button norm">Page suivante</button>
            </div>
        </div>
        </React.Fragment>
    );
}

function AsideController() {
    return (
        <React.Fragment>
        <button class="button norm">Signaler</button>
        <button class="button norm">Modifier</button>
        <button class="button norm">Supprimer</button>
        </React.Fragment>
    );
}

export default function Post(props) {
    const [post, setPost] = React.useState({});
    const [message, setMessage] = React.useState("");

    console.log(props)

    React.useEffect(() => {
        fetch(`/api/post/${props.match.params.post_id}`)
            .then(res => res.json())
            .then(post => setPost(post))
            .catch(e => setMessage("Ce post n'existe pas"))
    }, [props.match.params.post_id]);
    
    return (
        <React.Fragment>
        <aside class="container-aside post-buttons">
            <AsideController />
            {message}
        </aside>
        <div class="container-content">
            <div class="post">
                <div class="post-header">
                    <img src="https://via.placeholder.com/64.png/09f/fff" alt=""/>
                    <div class="post-infos">
                        <h1 class="post-title"> {post.post_title} </h1>
                        <span class="post-subtitle">
                            Par <strong><Link to={`/user/${post.post_user}`}>{post.user_name}</Link></strong> le {formatDate(new Date(post.post_date))}
                        </span>
                    </div>
                </div>
                <div class="post-content"> {post.post_content} </div>
            </div>
            <hr/>
            <Comments />
        </div>
        </React.Fragment>
    );
}