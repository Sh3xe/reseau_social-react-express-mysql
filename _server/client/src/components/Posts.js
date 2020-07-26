import React from "react";

import {formatDate, getUrlQuery} from "../utils.js";
import {Link} from "react-router-dom";

// post_id, post_title, post_content, post_user, post_date, post_edit_date, post_category, user_name
function Post({post}) {
    return (
        <div className="post">
            <div className="post-header">
                <img src="https://via.placeholder.com/64.png/09f/fff" alt=""/>
                <div className="post-infos">
                    <span className="post-subtitle">
                        Par <strong><Link to={`/user/${post.post_user}`}>{post.user_name}</Link></strong> le {formatDate(new Date(post.post_date))}
                    </span>
                </div>
            </div>
            <div className="post-preview">
                <Link className="post-preview-content" to={`/post/${post.post_id}`}>{post.post_title}</Link>
            </div>
        </div>
    );
}

function CategorySelector({category, changeCategory}) {

    const handleCategoryChange = function(e) {
        e.preventDefault();
        changeCategory(e.target.innerText);
    }

    const categories = ["Tout", "Jeux vidéos", "Memes"];
    
    let categories_el = [];
    categories.forEach(e => {
        categories_el.push(
        <li key={e} className={e === category ? "selected" : ""}>
            <a href="/" onClick={handleCategoryChange}>{e}</a>
        </li>);
    });

    return (
        <React.Fragment>
            <h1>Catégories</h1>
            <ul>
				{categories_el}
            </ul>
        </React.Fragment>
    );
}

function PostsContainer({posts}) {
    let posts_el = [];
    posts.forEach(post => {
        posts_el.push(<Post key={posts_el.length} post={post} />);
    });

    return (
       <React.Fragment>
        <div className="posts-feed">
            {posts_el}
        </div>
        {posts.length >= 16 ?<div className="page-controller">
            <button className="button norm">Page précédente</button>
            <button className="button norm">Page suivante</button>
        </div> : ""}
        </React.Fragment>
    );
}

export default function Posts() {
    
    //Hooks
    const [state, setState] = React.useState({
        category: "Tout",
        search: "",
        start: 0,
        step: 16,
        search_timeout: 0
    });

    const [posts, setPosts] = React.useState([]);
    const [message, setMessage] = React.useState("");

    //Functions
    const handleSearchChange = function(e) {
        const value = e.target.value;

        if(state.search_timeout) {
            clearTimeout(state.search_timeout);
        }

        setState({
            ...state,
            search: value,
            search_timeout: setTimeout(() => {
                searchPosts()
            }, 5000)
        });
    }

    const handleCategoryChange = function(new_category) {
        setState({...state, category: new_category});
    }
    
    const searchPosts = function() {

        const url_query = getUrlQuery({
            start: state.start,
            search: state.search,
            step: state.step,
            category: state.category
        }); // returns a "?key1=value1&key2=val2"

        const url = "api/posts?" + url_query;

        fetch(url)
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(error => setMessage(error));
    };

    React.useEffect(searchPosts, [state.category]);

    React.useEffect(() => {
        if(state.search_timeout) {
            clearTimeout(state.search_timeout);
        }

        setState( {
            ...state,
            search_timeout: setTimeout(() => {
                searchPosts();
            }, 500)
        });

    }, [state.search]);

    //Page
    return (
        <React.Fragment>
        <aside className="container-aside">
            <CategorySelector changeCategory={handleCategoryChange} category={state.category}/>
        </aside>
        <div className="container-content">
            <form action="" method="get" className="search-bar">
                <input 
                    type="text" className="input t2" placeholder="Rechercher" 
                    onChange={handleSearchChange}
                />
            </form>
            <div>
                {message}
            </div>
            <PostsContainer posts={posts} />
        </div>
        </React.Fragment>
    );
}