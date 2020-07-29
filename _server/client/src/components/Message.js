import React from "react";

export default function Message({messages}) {
    let messages_el = [];

    for(let i = 0; i < messages.length; i++) {
        const class_name = `log-message ${messages[i].col}`;
        messages_el.push(
        <div className={class_name} key={i}>
            {messages[i].content}
        </div>);
    }

    return (
        <div>
            {messages_el}
        </div>
    );
}