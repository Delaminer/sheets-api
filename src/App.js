import React, { useState, useRef } from 'react';
import './App.css';
import Signin from './Signin';
import ProjectManager from './ProjectManager';
import Editor from './Editor';

const url = 'http://127.0.0.1:5000';

const App = () => {
    const [projectID, setProjectID] = useState('');
    const [username, setUsername] = useState('');
    // For forcing a re-render
    const [render, setRender] = useState(0);

    // For processing files
    const fileInput = useRef(null);
    const [getFile, setupFileUse] = useState(()=>{});

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
                                        setProjectID(data.id);
                                    });
                            }));

                            // Make the user choose a file
                            fileInput.current.click();
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
