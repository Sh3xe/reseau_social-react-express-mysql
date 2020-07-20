import React from 'react';

function App() {

    let [post, setPost] = React.useState({});

    const fetchData = function() {
        fetch("/api/post/1")
            .then(res => res.json())
            .then(data => setPost(data));
    }

    return <div>
        <button onClick={fetchData}> Recuperer les données </button>
        <p>{JSON.stringify(post)}</p>
    </div>;
}

export default App;
