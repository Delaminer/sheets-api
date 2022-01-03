import React, { useState, useRef } from 'react';
import './App.css';
import Signin from './Signin';
import ProjectManager from './ProjectManager';
import Editor from './Editor';
import { Routes, Route, useMatch, useNavigate } from 'react-router-dom';

const url = '/api';
// const url = 'https://sheets-api-server.herokuapp.com/api';

const App = () => {
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    // For forcing a re-render
    const [render, setRender] = useState(0);

    // For processing files
    const fileInput = useRef(null);
    const [getFile, setupFileUse] = useState(() => { });
    let match = useMatch('/edit/projects/:projectID');
    let navigate = useNavigate();

    if (match && username === '') {
        // Cannot edit a project if you are not signed in!
        navigate('/', { replace: false });
    }

    return (
        <div className='App'>
            <Routes>
                <Route path='/edit/projects/*' element={
                    match && (
                        <Editor
                            url={url}
                            projectID={match.params.projectID}
                            username={username}
                            signout={() => {
                                // Sign out by clearing the username and going back to the home page
                                setUsername('');
                                localStorage.removeItem('username');
                                navigate('/', { replace: false });
                            }}
                            exitProject={() => {
                                // Exit the project by going back to the home page
                                navigate('/', { replace: false });
                            }}
                        />
                    )
                }>
                </Route>
                <Route path='/' element={
                    (username === '' ? (
                        <Signin
                            setUsername={newUsername => {
                                setUsername(newUsername);
                                localStorage.setItem('username', newUsername);
                            }}
                        />
                    ) : (
                        <ProjectManager
                            url={url}
                            username={username}
                            editProject={projectID => navigate(`/edit/projects/${projectID}`, { replace: false })}
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
                                        navigate(`/edit/projects/${data.id}`, { replace: false });
                                    });
                            }}
                            newCSVProject={() => {
                                // Create a new project using a CSV file

                                // Use the file to get text
                                setupFileUse(() => ((text, filename) => {
                                    console.log(`file ${filename} Got back data ${text}`)
                                    // Convert text to a data object
                                    let newData = text.split('\n').map(line => line.trim().split(','));
                                    // Convert from an array of arrays to an object of objects
                                    newData = { ...newData.map(line => ({ ...line })) };
                                    // Create a new project with this as the data and project name
                                    fetch(`${url}/users/${username}/projects`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ data: newData, name: filename }),
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            // Edit the project just created
                                            navigate(`/edit/projects/${data.id}`, { replace: false });
                                        });
                                }));

                                // Make the user choose a file
                                fileInput.current.click();
                            }}
                            signout={() => {
                                // Sign out by clearing the username and projectID
                                setUsername('');
                                localStorage.removeItem('username');
                                navigate('/', { replace: false });
                            }}
                        />))
                }>
                </Route>
            </Routes>
            {/* For file input: */}
            <input
                style={{ display: 'none' }}
                ref={fileInput}
                type='file'
                onChange={e => {
                    // Use the uploaded file
                    const fileUploaded = e.target.files[0];
                    const fileName = fileUploaded.name;
                    // Get the text of the file using FileReader
                    const reader = new FileReader();
                    reader.onload = e => {
                        const text = e.target.result;
                        if (getFile) {
                            getFile(text, fileName);
                        }
                    };
                    reader.readAsText(fileUploaded);
                }}
            ></input>
        </div>
    );
}

export default App;
