import React from "react";

import {Link} from "react-router-dom";
import {formatDate} from "../utils.js";
import {UserContext} from "../App.js";

function Comments() {
    return (
        <React.Fragment>
        <form className="comment-form">
            <textarea className="input t1"></textarea>
            <button className="button col1">Submit</button>
        </form>
        <div className="comments">
            <div className="comment">
                <div className="comment-header">
                    Par arthur le 20/02/20 à 10H50
                </div>
                <div className="comment-content">
                    On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même.
                </div>
            </div>
            <div className="page-controller">
                <button className="button norm">Page précédente</button>
                <button className="button norm">Page suivante</button>
            </div>
        </div>
        </React.Fragment>
    );
}

function AsideController({curr_user, post_user}) {
    return (
        <React.Fragment>
        <button className="button norm">Signaler</button>
        { curr_user.user_id === post_user ?
            <React.Fragment>
            <button className="button norm">Modifier</button>
            <button className="button norm">Supprimer</button>
            </React.Fragment> : ""
        }
        </React.Fragment>
    );
}

export default function Post(props) {
    const [post, setPost] = React.useState({});
    const [message, setMessage] = React.useState("");
    
    const {user} = React.useContext(UserContext);

    const {post_id} = props.match.params;

    React.useEffect(() => {
        fetch(`/api/post/${post_id}`)
            .then(res => res.json())
            .then(post => setPost(post))
            .catch(e => setMessage("Ce post n'existe pas"))
    }, [post_id]);
    
    return (
        <React.Fragment>
        <aside className="container-aside post-buttons">
            <AsideController post_user={post.post_user} curr_user={user}/>
            {message}
        </aside>
        <div className="container-content">
            <div className="post">
                <div className="post-header">
                    <img src="https://via.placeholder.com/64.png/09f/fff" alt=""/>
                    <div className="post-infos">
                        <h1 className="post-title"> {post.post_title} </h1>
                        <span className="post-subtitle">
                            Par <strong><Link to={`/user/${post.post_user}`}>{post.user_name}</Link></strong> le {formatDate(new Date(post.post_date))}
                        </span>
                    </div>
                </div>
                <div className="post-content"> {post.post_content} </div>
            </div>
            <hr/>
            <Comments />
        </div>
        </React.Fragment>
    );
}