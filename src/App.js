import React, { useState } from 'react';
import './App.css';
import Signin from './Signin';
import ProjectManager from './ProjectManager';
import Editor from './Editor';

const url = 'http://127.0.0.1:5000';

const tableData = { 'Name': ['Alex', 'Bob', 'Mark', 'Joe'], 'Age': ['18', '44', '80', '10'] };

let keys = Object.keys(tableData);
let entries = keys[0].length;
let data2 = [...Array(entries)].map((_, i) => {
    let dataObject = {};
    keys.forEach(key => {
        dataObject[key] = tableData[key][i];
    })
    return dataObject;
});

let csvData = [keys, ...data2.map(entry => keys.map(key => entry[key]))];
let projectName = 'Untitled Project';
// let username = '';

const App = () => {
    const [projectID, setProjectID] = useState('');
    const [username, setUsername] = useState('');

    return (
        <div className='App'>
            {username === '' ? (
                <Signin
                    setUsername={setUsername}
                />
            ) : (
                projectID === '' ? (
                    <ProjectManager
                        url={url}
                        username={username}
                        setProjectID={setProjectID}
                        deleteProject={targetProjectID => {
                            // Delete a project!?!?!
                        }}
                        newProject={() => {
                            // Create a new project
                            fetch(`${url}/users/${username}/projects`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({}),
                            })
                                .then(res => res.json())
                                .then(data => {
                                    // Edit the project just created
                                    setProjectID(data.id);
                                });
                        }}
                    />
                ) : (
                    <Editor
                        url={url}
                        projectID={projectID}
                        username={username}
                        signout={() => {
                            // Sign out by clearing the username
                            setUsername('');
                        }}
                    />
                )
            )}
        </div>
    );
}

export default App;
