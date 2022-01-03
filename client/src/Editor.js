import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Table from './Table';
import Bar from './Bar';

const Editor = props => {
    // The name of the project being edited, in the input field at the top
    const [projectName, setProjectName] = useState('');
    // The data displayed and edited in the editor
    const [data, setData] = useState({});
    // Status about loading data from the
    const [loaded, setLoaded] = useState(false);

    // Status on autosave
    const [scheduledSave, scheduleSave] = useState(null);

    // Get the project name and data from the API
    useEffect(() => {
        // Cannot edit a project if you are not signed in!
        if (props.username === '') {
            props.exitProject();
        }
        setLoaded(false);
        fetch(`${props.url}/projects/${props.projectID}`)
            .then(res => res.json())
            .then(project => {
                // Cannot edit a project if you are not the owner!
                if (props.username !== project.owner) {
                    props.exitProject();
                }
                setProjectName(project.name);
                setData(project.data);
                setLoaded(true);
            });
    }, [props, setProjectName, setData, setLoaded]);

    const fileInput = useRef(null);

    return (
        <div>
            {/* For file input: */}
            <input
                style={{ display: 'none' }}
                ref={fileInput}
                type='file'
                onChange={e => {
                    // Use the uploaded file
                    const fileUploaded = e.target.files[0];
                    // Get the text of the file using FileReader
                    const reader = new FileReader();
                    reader.onload = e => {
                        let text = e.target.result;
                        // Convert text to a data object
                        let newData = text.split('\n').map(line => line.trim().split(','));
                        // Convert from an array of arrays to an object of objects
                        newData = { ...newData.map(line => ({ ...line })) };
                        console.log(newData)
                        setData(newData);
                        fetch(`${props.url}/projects/${props.projectID}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ data: newData }),
                        })
                            .then(res => res.json())
                            .then(resData => {
                                console.log('Updated server with output ' + JSON.stringify(resData));
                            });
                    };
                    reader.readAsText(fileUploaded);
                }}
            ></input>
            <Bar
                projectName={projectName}
                username={props.username}
                changeProjectName={(name) => {
                    if (name !== projectName) {
                        console.log('Change in project name');
                        setProjectName(name);
                        fetch(`${props.url}/projects/${props.projectID}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ name: name }),
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log('Updated server with output ' + JSON.stringify(data));
                            });
                    }
                }}
                signout={props.signout}
                exitProject={props.exitProject}
                uploadCSV={() => {
                    // Click the file input to request an upload
                    fileInput.current.click();
                }}
                saving={!!scheduledSave} // Convert the scheduled save to a boolean (if it exists it is true)
            />
            {loaded ?
                (<Table
                    data={JSON.stringify(data)}
                    minColumns={14}
                    minRows={30}
                    changeData={(newData) => {
                        console.log('Change in data');
                        setData(newData);
                        if (scheduledSave) {
                            // Clear the old save
                            clearTimeout(scheduledSave);
                            scheduleSave(null);
                        }
                        
                        // Request a save in data
                        const autosaveID = setTimeout(() => {
                            // Keep a record of this save
                            const thisSave = scheduleSave;

                            // Save!
                            fetch(`${props.url}/projects/${props.projectID}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ data: newData }),
                            })
                                .then(res => res.json())
                                .then(resData => {
                                    console.log('Updated server with output ' + JSON.stringify(resData));
                                    // Clear the save if there isn't another one in progress
                                    if (thisSave === scheduleSave) {
                                        clearTimeout(scheduledSave);
                                        scheduleSave(null);
                                    }
                                });
                        }, 3000);

                        // Record the ID
                        scheduleSave(autosaveID);
                    }}
                />)
                : (
                    <div>Please wait to receive data from the server</div>
                )}
        </div>
    )
}

export default Editor;
