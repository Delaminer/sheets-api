import React, { useState } from 'react';

const Signin = props => {
    const [tempUsername, setTempUsername] = useState('');

    return (
        <div className='signin'>
            <h1>Welcome! Please provide a username to save your projects!</h1>
            <input type='text' value={tempUsername} onChange={e => setTempUsername(e.target.value)}/>
            <button onClick={() => props.setUsername(tempUsername)}>Go!</button>
        </div>
    )
}

export default Signin;
