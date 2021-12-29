import React, { useState, useRef, useEffect } from 'react';

// Simple helper function for getting a letter in the alphabet
const letter = index => String.fromCharCode('A'.charCodeAt(0) + index);

const Table = (props) => {

    // Keep track of what cell is actively being edited
    const [activeCell, setActiveCell] = useState({ row: -1, column: -1 });
    // Keep a state for the table of values of what cell is actively being edited
    const [a, setData] = useState(JSON.stringify(props.csvData));//() => props.csvData
    const data = JSON.parse(a);
    // Keep a reference to the data editor input field
    const textInput = useRef(null);

    let textInputValue = '';
    if (data[activeCell.row] && data[activeCell.row][activeCell.column]) {
        textInputValue = data[activeCell.row][activeCell.column];
    }

    // Helper function for moving cell
    const moveCell = (changeRow, changeColumn) => {
        // Must be in editing mode
        if (activeCell.row !== -1) {
            // Lower the active cell by one
            setActiveCell({
                row: Math.max(0, activeCell.row + changeRow),
                column: Math.max(0, activeCell.column + changeColumn)
            });
            // Focus on the text input to allow editing of the cell
            textInput.current.focus();
        }
    };

    // Add listeners for arrow keys and enter to move the active cell
    useEffect(() => {
        const events = {
            'Enter': () => { moveCell(1, 0); },
            'ArrowUp': () => { moveCell(-1, 0); },
            'ArrowDown': () => { moveCell(1, 0); },
            'ArrowLeft': () => { moveCell(0, -1); },
            'ArrowRight': () => { moveCell(0, 1); },
            'Delete': () => {
                // Delete the data here if there is any
                if (data[activeCell.row]) {
                    data[activeCell.row][activeCell.column] = '';
                    setData(JSON.stringify(data));
                    // Notify the app of the change
                    props.changeData(data);
                }
            }
        };
        const moveCellOnKeyPress = e => {
            if (events[e.code] !== undefined) {
                // We have an event for this!
                events[e.code]();
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', moveCellOnKeyPress);
        
        return () => {
            // Cleanup
            window.removeEventListener('keydown', moveCellOnKeyPress);
        };
    });

    const rows = props.minRows;
    const columns = props.minColumns;

    // Add the column headers
    const columnHeaders = [];
    for (let column = 0; column < columns; column++) {
        let contents = letter(column)
        columnHeaders.push(
            <div
                key={'c' + column}
                className='grid-item column-header'
                style={{ gridRow: 1, gridColumn: column + 2 }}
            >
                {contents}
            </div>
        );
    }
    // Add the rows of data
    const dataRows = [];
    for (let row = 0; row < rows; row++) {
        // Add the beginning of the column
        dataRows.push(
            <div
                key={'r' + row}
                className='grid-item row-header'
                style={{ gridRow: row + 2, gridColumn: 1 }}
            >
                {row + 1}
            </div>
        );
        for (let column = 0; column < columns; column++) {
            let contents = '';
            if (data[row] && data[row][column]) {
                contents = data[row][column];
            }
            let className = 'grid-item content';
            if (activeCell.row === row && activeCell.column === column) {
                // This is the active cell!
                className += ' active';
            }
            dataRows.push(
                <div
                    key={row + ',' + column}
                    className={className}
                    style={{ gridRow: row + 2, gridColumn: column + 2 }}
                    onClick={() => {
                        // Change the active cell
                        setActiveCell({ row: row, column: column });
                        // Focus on the text input to allow editing of the cell
                        textInput.current.focus();
                    }}
                >
                    {contents}
                </div>
            );
        }
    }
    return (
        <div className='editor'>
            <div className='name-bar'>
                <span>Value: </span>
                <input type='text' ref={textInput} value={textInputValue}
                    onChange={(e) => {
                        // Change the data
                        if (!data[activeCell.row]) {
                            data[activeCell.row] = {};
                        }
                        data[activeCell.row][activeCell.column] = e.target.value;
                        setData(JSON.stringify(data));

                        // Notify the app of the change
                        props.changeData(data);
                    }}
                />
            </div>
            <div className='data-table'>
                <div className='grid' style={{ width: 50 + columns * 100 }}>
                    {/* Edge piece */}
                    <div key='edge' className='grid-item corner' style={{ gridRow: 1, gridColumn: 1 }}></div>
                    {/* Column Headers */}
                    {columnHeaders}
                    {/* Rows */}
                    {dataRows}
                </div>
            </div>
        </div>
    );
}

export default Table;