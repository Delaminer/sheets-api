import React, { useState, useEffect } from 'react';

const ProjectManager = props => {
    const [projects, setProjects] = useState([]);
    // Get the list of projects from the server
    useEffect(() => {
        fetch(`${props.url}/users/${props.username}`)
            .then(res => res.json())
            .then(userData => {
                setProjects(userData.projects);
            });
    }, [props.url, props.username]);

    return (
        <div className='project-manager'>
            <h1>Here are your projects:</h1>
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        {project.name} ({project.id})
                        <button onClick={() => props.setProjectID(project.id)}>Edit</button>
                        <button onClick={() => props.deleteProject(project.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={props.newProject}>New Project</button>
            <p>Signed in as {props.username}</p>
        </div >
    )
}

export default ProjectManager;
