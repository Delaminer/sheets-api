import React, { } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useMatch,
    useParams
} from "react-router-dom";

const Test = (props) => {
    return (
        <BrowserRouter>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/projects">Projects</Link>
                </li>
            </ul>
            <Routes>
                <Route path="/about" element={<h1> a</h1>}>
                    {/* <h1> a</h1> */}
                </Route>
                <Route path="/projects" element={<h1> Welcome to the projects page</h1>}>
                    {/* <h1> a</h1> */}
                </Route>
                <Route path="/projects/*" element={<Projects />}>
                    {/* <h1> a1</h1> */}
                </Route>
                <Route path="/" element={<h1> c</h1>}>
                    {/* <h1> a2</h1> */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
const Projects = () => {
    let match = useMatch('/projects/:projectID');
    console.log(match)
    console.log(match.url)
    console.log(match.path)
    return (
        <div>
            <h1>Projects</h1>
            <ul>
                <li>
                    <Link to={`${match.url}/components`}>How to use Components</Link>
                </li>
                <li>
                    <Link to={`${match.url}/props-v-state`}>
                        What are Props and what are States
                    </Link>
                </li>
            </ul>
            <Routes>
                <Route path={`${match.path}/:projectID`} element = {<Project />}>
                    
                </Route>
                <Route path={match.path} element = {<h3>Please select a project.</h3>}>
                    
                </Route>
            </Routes>
        </div>
    );
}

const Project = () => {

    let { projectID } = useParams();
    return (
        <h3>Requested project ID: {projectID}</h3>
    );

}

export default Test;