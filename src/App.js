import React, { useState } from 'react';
import './App.css';
import Table from './Table';
import Bar from './Bar';

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
let username = '';

const App = () => {
    // const { data, loading } = useFetch('/create', {username: 'uname', projectName: 'pname'});
    const [projectID, setProjectID] = useState('');

    return (
        <div className='App'>
            <Bar
                filename={projectName}
                changeName={(name) => {
                    if (name !== projectName) {
                        console.log('Change in name');
                        projectName = name;
                    }
                }}
                signin={(name) => {
                    console.log('Signed in as ' + name);
                    username = name;
                    fetch(`${url}/users/${username}/projects`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, projectName }),
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log("Created! ID = " + data.id);
                            setProjectID(data.id);
                        });
                }}
            />
            <Table
                data={tableData}
                data2={data2}
                csvData={csvData}
                minColumns={14}
                minRows={30}
                changeData={(data) => {
                    console.log('Change in data');
                    csvData = data;
                    fetch(`${url}/projects/${projectID}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ data: csvData }),
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log("Updated server with output " + JSON.stringify(data));
                        });
                }}
            />
        </div>
    );
}

export default App;
