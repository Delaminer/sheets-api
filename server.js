const express = require('express');
const cors = require('cors')
const app = express();
const fs = require('fs');
const port = 5000;

// Use this for CORS (so other sources can use the API)
app.use(cors());

// Use these for JSON input
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let database = {
    users: {},
    projects: {}, //right now each project just has one sheet (no multiple pages)
};

// Helper functions for saving the databases
let saveDatabase = () => {
    fs.writeFile('database.db', JSON.stringify(database, null, 4), error => {
        if (error) {
            console.log('Unable to save database: ' + error)
        }
    });
};

// Load the saved database
fs.readFile('database.db', 'utf8', (error, data) => {
    if (error) {
        console.log('No database found');
        // Make a new one using default values
        saveDatabase();
    }
    else {
        try {
            // Try to parse the data
            database = JSON.parse(data);
        }
        catch (e) {
            console.log('Unable to read database.');
            // Make a new one using default values
            saveDatabase();
        }
    }
});


const getUser = username => {
    if (!database.users[username]) {
        database.users[username] = {
            username: username,
            projects: [],
        };
    }
    return database.users[username];
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Create a new project POST request
app.post('/users/:username/projects', (req, res) => {
    const username = req.params.username;
    // Create the user if needed
    let user = getUser(username);

    // Get a random id with 4 digits
    let id;
    do {
        id = 1000 + Math.round(9000 * Math.random());
    } while (database.projects[id]);

    // Create the project
    let project = {
        id: id,
        name: req.body.name || 'Untitled Project', // Default name
        owner: username,
        data: req.body.data || {}, // There is no data by default
    };
    // Register the project
    database.projects[id] = project;
    // Link it to the player
    user.projects.push(id);

    // Save the database
    saveDatabase();

    // Send back info
    res.status(201).send(JSON.stringify({ id: id, name: project.name }));
});

app.delete('/users/:username/projects/:projectID', (req, res) => {
    const username = req.params.username;
    const id = req.params.projectID;
    // Make sure it exists
    if (database.projects[id] &&
        database.users[username] &&
        database.users[username].projects.includes(parseInt(id))) {
        // Remove from the player's list
        database.users[username].projects.splice(database.users[username].projects.indexOf(id), 1);
        // Delete the project
        delete database.projects[id];
        // Save the database
        saveDatabase();

        res.sendStatus(200);
    }
    else {
        res.sendStatus(404);
    }
});

// Update the information (data, name, etc) of a certain project
app.put('/projects/:projectID', (req, res) => {
    const id = req.params.projectID;
    // Make sure it exists
    if (database.projects[id]) {
        if (req.body.data) {
            database.projects[id].data = req.body.data;
        }
        if (req.body.name) {
            database.projects[id].name = req.body.name;
        }
        // Save the database
        saveDatabase();
        res.status(200).send(JSON.stringify({ id: id }));
    }
    else {
        res.sendStatus(404);
    }
});

// Get the information about a user
app.get('/users/:username', (req, res) => {
    const username = req.params.username;
    // Make sure they exist
    if (database.users[username]) {
        let projectList = database.users[username].projects.map(projectID => ({
            id: projectID,
            name: database.projects[projectID].name,
        }));
        res.status(200).send(JSON.stringify({ ...database.users[username], projects: projectList }));
    }
    else {
        res.sendStatus(404);
    }
});

// Get the data of a certain project
app.get('/projects/:projectID', (req, res) => {
    const id = req.params.projectID;
    // Make sure it exists
    if (database.projects[id]) {
        // The user can provide requirements on which data should be returned
        const requirements = Object.keys(req.query);
        if (requirements.length === 0) {
            // No special requests, send the whole file
            res.status(200).send(JSON.stringify(database.projects[id]));
        }
        else {
            // There are queries, so send only part of the database
            const data = database.projects[id].data;
            const field = requirements[0].toLowerCase();
            const requiredValue = req.query[field];
            const column = Object.keys(data[0]).find(index => data[0][index].toLowerCase() === field);
            // Now go through the other rows, checking if that column contains the correct value
            const validRows = Object.keys(data).filter(row => (
                // Cannot be the first row
                row !== 0 &&
                // The data of this column must have the required value
                data[row][column].includes(requiredValue)
            ))
            // Create a valid data object for this item using the first row as labels
            .map(row => {
                const obj = {};
                const columnsToUse = Object.keys(data[row]);
                columnsToUse.forEach(col => {
                    // Label each property properly
                    const key = data[0][col] || col;
                    obj[key] = data[row][col];
                })
                return obj;
            });
            res.status(200).send(JSON.stringify(validRows));
        }
    }
    else {
        res.sendStatus(404);
    }
});

// Get the data of a certain project as a CSV
app.get('/projects/download/:projectID', (req, res) => {
    const id = req.params.projectID;
    // Make sure it exists
    if (database.projects[id]) {
        const project = database.projects[id].data;
        const output = Object.keys(project).map(row => (
            Object.keys(project[row]).map(column => (
                project[row][column]
            )).join(',')
        )).join('\n');
        res.attachment(`${database.projects[id].name}.csv`);
        res.type('csv');
        res.status(200).send(output);
    }
    else {
        res.sendStatus(404);
    }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});