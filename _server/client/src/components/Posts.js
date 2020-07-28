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

function PostsContainer({start, posts, onPageChange}) {
    //Hooks
    const [post_el, setPostEl] = React.useState([]);

    //Functions
    const pagePlus = function() {
        if(posts.length > 14)
            onPageChange(1);
    }

    const pageMinus = function() {
        if(start >= 14) 
            onPageChange(-1);
    }

    React.useEffect(() => {
        let new_post_el = [];
        posts.forEach(post => {
            new_post_el.push(<Post key={new_post_el.length} post={post} />);
        });
        if(new_post_el.length === 15) new_post_el.pop();

        setPostEl(new_post_el);
    }, [posts]);


    return (
       <React.Fragment>
        <div className="posts-feed">
            {post_el}
        </div>
        { posts.length > 14 || start >=14 ?
            <div className="page-controller">
                <button className="button norm" onClick={pageMinus}>Page précédente</button>
                <button className="button norm" onClick={pagePlus}>Page suivante</button>
            </div> : ""
        }
        </React.Fragment>
    );
}

export default function Posts() {
    //Hooks
    const [state, setState] = React.useState({
        category: "Tout",
        search: "",
        start: 0,
        step: 15
    });

    const [posts, setPosts] = React.useState([]);
    const [message, setMessage] = React.useState("");

    //Functions
    const handleSearchChange = function(e) {
        const value = e.target.value;

        setState({
            ...state,
            search: value
        });
    }

    const handleCategoryChange = function(new_category) {
        setState({...state, start: 0, category: new_category});
    }

    const handlePageChange = function(value) {
        if(value === -1) {
            setState({ ...state, start: state.start - 14 });
        } else if(value === 1) {
            setState({ ...state, start: state.start + 14 });
        }
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

    React.useEffect(searchPosts, [state]);

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
                {JSON.stringify(message)}
            </div>
            <PostsContainer start={state.start} posts={posts} onPageChange={handlePageChange}/>
        </div>
        </React.Fragment>
    );
}