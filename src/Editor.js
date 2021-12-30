import React, { useEffect, useState } from 'react';
import './App.css';
import Table from './Table';
import Bar from './Bar';

const Editor = props => {
    const [projectName, setProjectName] = useState('');
    const [data, setData] = useState({});
    // Status about loading data from the
    const [loaded, setLoaded] = useState(false);

    // Get the project name and data from the API
    useEffect(() => {
        setLoaded(false);
        fetch(`${props.url}/projects/${props.projectID}`)
            .then(res => res.json())
            .then(project => {
                setProjectName(project.name);
                setData(project.data);
                setLoaded(true);
            });
    }, [props.url, props.projectID, setProjectName, setData, setLoaded]);

    return (
        <div>
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
            />
            {loaded ?
                (<Table
                    data={data}
                    minColumns={14}
                    minRows={30}
                    changeData={(newData) => {
                        console.log('Change in data');
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
                    }}
                />)
                : (
                    <div>Please wait to receive data from the server</div>
                )}
        </div>
    )
}

export default Editor;
