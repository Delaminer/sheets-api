import React, { useState } from 'react';

const Bar = (props) => {
    const [username, setUsername] = useState('');
    return (
        <div className="menu-bar">
            <div className="logo">SheetsAPI</div>
            <input type="text" className="filename"
                defaultValue={props.filename}
                onBlur={e => props.changeName(e.target.value)}
            />

            <div className="signin">
                <span>Username: </span>
                <input 
                    type="text" placeholder="Enter username"
                    onChange={e => setUsername(e.target.value)}
                />
                <button onClick={() => props.signin(username)}>Sign In</button>
            </div>
        </div>
    );
}

export default Bar;