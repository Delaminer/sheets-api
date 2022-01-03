import React from 'react';

const Bar = props => {
    return (
        <div className='menu-bar'>
            <div className='logo'>SheetsAPI</div>
            <input type='text' className='filename'
                defaultValue={props.projectName}
                onBlur={e => props.changeProjectName(e.target.value)}
            />
            <button onClick={props.uploadCSV}>Use CSV</button>
            <span className='save-status'>
                {props.saving ? 'Saving...' : 'Saved'}
            </span>

            <div className='account'>
                <span>Signed in as {props.username}</span>
                <button onClick={props.signout}>Sign Out</button>
                <button onClick={props.exitProject}>Back to Projects</button>
            </div>
        </div>
    );
}

export default Bar;