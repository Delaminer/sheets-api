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
    // For forcing a re-render
    const [render, setRender] = useState(0);

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
                        // For forcing this to re-render (and re-fetch data)
                        render={render}
                        deleteProject={targetProjectID => {
                            // Delete a project!?!?!
                            fetch(`${url}/users/${username}/projects/${targetProjectID}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({}),
                            })
                                .then(res => {
                                    // Update the list of projects by forcing a re-render
                                    setRender(r => r + 1);
                                })
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
                        signout={() => {
                            // Sign out by clearing the username and projectID
                            setUsername('');
                            setProjectID('');
                        }}
                    />
                ) : (
                    <Editor
                        url={url}
                        projectID={projectID}
                        username={username}
                        signout={() => {
                            // Sign out by clearing the username and projectID
                            setUsername('');
                            setProjectID('');
                        }}
                        exitProject={() => {
                            // Exit the project by clearing the projectID
                            setProjectID('');
                        }}
                    />
                )
            )}
        </div>
    );
}

export default App;
