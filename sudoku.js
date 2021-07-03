const BACKGROUND_COLOR = "white"; //Color of the non-active cells
const ACTIVE_CELL_COLOR = "rgb(200,200,210)"; //Color of the current active cell
const CELL_AFFECT_COLOR = "rgb(230,230,240)"; //Color of the row, column, and box of active cell

class Board {
    /* Public */
    constructor() {
        this.#data = Array();
    }

    getData() {
        return this.#data;
    }

    setData(data) {
        this.#data = data.map(inner => inner.slice(0));
    }

    getActiveRowIndex() {
        return this.#activeRowIndex;
    }

    setActiveRowIndex(rowIndex) {
        this.#activeRowIndex = rowIndex;
    }

    getActiveColumnIndex() {
        return this.#activeColumnIndex;
    }

    setActiveColumnIndex(columnIndex) {
        this.#activeColumnIndex = columnIndex;
    }

    draw(table) {
        //reset all cells background color to default
        for(let i = 0; i < this.#data.length; i++) {
            for(let j = 0; j < this.#data[i].length; j++) {
                table.rows[i].cells[j].style.background = BACKGROUND_COLOR;
                table.rows[i].cells[j].style.fontWeight = "normal";
            }
        }

        //change column and row color to lighter than the active cell
        for(let i = 0; i < this.#data.length; i++) {
            table.rows[i].cells[this.#activeColumnIndex].style.background = CELL_AFFECT_COLOR;
            table.rows[this.#activeRowIndex].cells[i].style.background = CELL_AFFECT_COLOR;
        }

        //changes 3 by 3 box of active cell to same color as active row and column
        let boxPos = this.#getBoxPosition(this.#activeRowIndex, this.#activeColumnIndex);
        for(let i = boxPos.rowBegin; i < boxPos.rowEnd; i++) {
            for(let j = boxPos.columnBegin; j < boxPos.columnEnd; j++) {
                table.rows[i].cells[j].style.background = CELL_AFFECT_COLOR;
            }
        }

        //give dark background to active cell and bold the text
        table.rows[this.#activeRowIndex].cells[this.#activeColumnIndex].style.background = ACTIVE_CELL_COLOR;
        table.rows[this.#activeRowIndex].cells[this.#activeColumnIndex].style.fontWeight = "bold";
    }

    updateCurrentCellValue(table, value) {
        if(this.#activeRowIndex != null && this.#activeColumnIndex != null){
            console.log(this.isValid(this.#activeRowIndex, this.#activeColumnIndex, value, this.#data));
            //update board data
            this.#data[this.#activeRowIndex][this.#activeColumnIndex] = value;
            //update table cells
            table.rows[this.#activeRowIndex].cells[this.#activeColumnIndex].innerHTML = value.toString();
            table.rows[this.#activeRowIndex].cells[this.#activeColumnIndex].style.color = this.isValid(this.#activeRowIndex, this.#activeColumnIndex, value, this.#data) ? "blue" : "red";
        }
    }

    deleteCurrentCellValue(table) {
        if(this.#activeRowIndex != null && this.#activeColumnIndex != null) {
            this.#data[this.#activeRowIndex][this.#activeColumnIndex] = 0;
            table.rows[this.#activeRowIndex].cells[this.#activeColumnIndex].innerHTML = "&nbsp";
        }
    }

    getRow(index) {
        return this.#data[index];
    }

    getColumn(index) {
        let column;
        this.#data.forEach(row => {
            column.push(row[index]);
        });
        return column;
    }

    isValid(rowIndex, columnIndex, value, data){
        //check if value is row and column valid
        for(let i = 0; i < 9; i++) {
            if((data[rowIndex][i] == value && i != columnIndex) || (data[i][columnIndex] == value && i != rowIndex)) {
                return false;
            }
        }

        //check if value is box valid
        let boxPos = this.#getBoxPosition(rowIndex, columnIndex);
        for(let i = boxPos.rowBegin; i < boxPos.rowEnd; i++) {
            for(let j = boxPos.columnBegin; j < boxPos.columnEnd; j++) {
                if(data[i][j] == value && i != rowIndex && j != columnIndex){
                    return false;
                }
            }
        }

        return true;
    }

    isSolved(data) {
        //go through board and check if every cell is valid
        for(let i = 0; i < data.length; i++) {
            for(let j = 0; j < data[i].length; j++) {
                if(!this.isValid(i, j, data[i][j], data)) {
                    return false;
                }
            }
        }
        return true;
    }

    solveBoard(data) {

        //backtracking algorithm used to solve
        let solvedBoard = this.#solveEmptyBoard(data, 0, 0);
        //console.log("done");
        console.log(this.isSolved(solvedBoard));

        return solvedBoard;
    }

    /* Private */
    #data;
    #activeRowIndex;
    #activeColumnIndex;

    #getTableRow(table, index) {
        return table.rows[index];
    }

    #getTableColumn(table, index) {
        let columns = Array();
        for(let i = 0; i < this.#data.length; i++) {
            columns.push(table.rows[index].cells[i]);
        }
        return columns;
    }

    #getBoxPosition(rowIndex, columnIndex) {
        let rowBegin;
        let rowEnd;
        let columnBegin;
        let columnEnd;
        //find where the row begins and ends
        if(rowIndex < 3) {
            //one of the 3 boxes from the top row
            rowBegin = 0;
            rowEnd = 3;
        }
        else if(rowIndex >= 3 && rowIndex < 6) {
            //one of the 3 boxes from the middle row
            rowBegin = 3;
            rowEnd = 6;
        }
        else if(rowIndex > 5) {
            //one of the 3 boxes from the bottom row
            rowBegin = 6;
            rowEnd = 9;
        }

        //find where the column begins and ends
        if(columnIndex < 3) {
            //one of the 3 boxes in the left column
            columnBegin = 0;
            columnEnd = 3;
        }
        else if(columnIndex >= 3 && columnIndex < 6) {
            //one of the 3 boxes in the middle column
            columnBegin = 3;
            columnEnd = 6;
        }
        else if(columnIndex > 5) {
            //one of the 3 boxes in the right column
            columnBegin = 6;
            columnEnd = 9;
        }

        return {
            rowBegin,
            rowEnd,
            columnBegin,
            columnEnd
        }
    }

    solve(data, rowIndex, columnIndex, solutions){
        //we've reached the end of the board
        if(rowIndex > 8) {
            return data;
        }

        //reached the end of the row so go to new row
        if(columnIndex > 8) {
            rowIndex++;
            return this.solve(data, rowIndex, 0, solutions);
        }

        //if current cell has a value go to next cell
        if(data[rowIndex][columnIndex] != 0) {
            columnIndex++;
            return this.solve(data, rowIndex, columnIndex, solutions);
        }

        //for every digit 1-9 try placing it in the empty cell and recursively solve the board
        let possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for(let i = 0; i < 9; i++) {
            if(this.isValid(rowIndex, columnIndex, possibleValues[i], data)) {
                //save old values
                //let oldCellVal = data[rowIndex][columnIndex];
                let oldRowIndex = rowIndex;
                let oldColumnIndex = columnIndex;
                let oldData = data.map(inner => inner.slice(0));
                
                //recursively solve using this cell value
                data[rowIndex][columnIndex] = possibleValues[i];
                columnIndex++;
                let result = this.solve(data, rowIndex, columnIndex, solutions);
                if(result != null) {
                    //it has reached a solution
                    solutions.push(data);
                    //return result;
                }
                
                //set old values and try different cell value
                rowIndex = oldRowIndex;
                columnIndex = oldColumnIndex;
                //data[rowIndex][columnIndex] = oldCellVal;
                data = oldData.map(inner => inner.slice(0));
            }
        }
        //if all digits have been attempted then return
        return null;
    }

    #solveEmptyBoard(data, rowIndex, columnIndex) {
        //we've reached the end of the board
        if(rowIndex > 8) {
            return data;
        }

        //reached the end of the row so go to new row
        if(columnIndex > 8) {
            rowIndex++;
            return this.#solveEmptyBoard(data, rowIndex, 0);
        }

        //if current cell has a value go to next cell
        if(data[rowIndex][columnIndex] != 0) {
            columnIndex++;
            return this.#solveEmptyBoard(data, rowIndex, columnIndex);
        }

        //for every digit 1-9 try placing it in the empty cell and recursively solve the board
        let possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const shuffle = array => array.sort(() => 0.5 - Math.random());
        shuffle(possibleValues);
        for(let i = 0; i < 9; i++) {
            if(this.isValid(rowIndex, columnIndex, possibleValues[i], data)) {
                //save old values in case they are needed again
                let oldCellVal = data[rowIndex][columnIndex];
                let oldRowIndex = rowIndex;
                let oldColumnIndex = columnIndex;
                
                //recursively solve using this cell value
                data[rowIndex][columnIndex] = possibleValues[i];
                columnIndex++;
                let result = this.#solveEmptyBoard(data, rowIndex, columnIndex);
                if(result != null) {
                    //it has reached a solution
                    return result;
                }
                
                //no solution was found so set old values and try different cell value
                rowIndex = oldRowIndex;
                columnIndex = oldColumnIndex;
                data[rowIndex][columnIndex] = oldCellVal;
            }
        }

        //if all digits have been attempted then no solution is possible
        return null;
    }
}

class Game {
    /* Public */
    static startGame() {
        this.#table = document.getElementById("sudoku-table");
        this.#initializeGame();
    }

    static newBoard() {
        //first delete the old board
        for(let i = 0; i < 9; i++) {
            this.#table.deleteRow(0);
        }
        this.#initializeGame();
    };

    static reset() {
        //first delete the old board
        for(let i = 0; i < 9; i++) {
            this.#table.deleteRow(0);
        }

        this.#gameBoard.setData(this.#initialBoard);
        //create sudoku grid in table
        for(let i = 0; i < 9; i++) {
            let row = this.#table.insertRow();
            for(let j = 0; j < 9; j++) {
                let cell = row.insertCell();
                if(this.#initialBoard[i][j] == 0) {
                    cell.innerHTML = "&nbsp";
                }
                else {
                    cell.innerHTML = this.#initialBoard[i][j].toString();
                }
                cell.onclick = this.#changeActiveCell.bind(this);
            }
        }
    };

    /* Private */
    static #table;
    static #gameBoard;
    static #sudokuSolver;
    static #initialBoard;

    static #initializeGame() {
        //generate game board
        this.#initialBoard = this.#generateSudokuBoard();
        this.#gameBoard = new Board();
        this.#gameBoard.setData(this.#initialBoard);

        //create sudoku grid in table
        for(let i = 0; i < 9; i++) {
            let row = this.#table.insertRow();
            for(let j = 0; j < 9; j++) {
                let cell = row.insertCell();
                if(this.#initialBoard[i][j] == 0) {
                    cell.innerHTML = "&nbsp";
                }
                else {
                    cell.innerHTML = this.#initialBoard[i][j].toString();
                }
                cell.onclick = this.#changeActiveCell.bind(this);
            }
        }

        //initialize key event listener
        document.addEventListener('keydown', this.#handleInput.bind(this));
    }

    static #generateSudokuBoard() {
        console.log("generating sudoku board...");
        //0 represents an empty space
        let emptyBoard = [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]
        ];

        let board = new Board();
        let finishedGrid = board.solveBoard(emptyBoard);

        let grid = finishedGrid.map(inner => inner.slice(0));

        //Remove cells from the finish grid as long as there is still only one solution
        let numRemovedCells = 30;
        while(numRemovedCells > 0) {
            //Pick random row and column indices
            let rowIndex = Math.floor(Math.random() * 9);
            let columnIndex = Math.floor(Math.random() * 9);

            if(grid[rowIndex][columnIndex] == 0) {
                //already changed this to an empty cell
                continue;
            }

            //copy grid, remove cell, and find solutions
            let gridCopy = grid.map(inner => inner.slice(0));
            gridCopy[rowIndex][columnIndex] = 0;
            let solutions = [[[]]];
            board.solve(gridCopy, 0, 0, solutions);
            if(solutions.length == 2) {
                //only found one solution not including the empty array
                grid[rowIndex][columnIndex] = 0;
                numRemovedCells--;
                continue;
            }
        }
        return grid;
    };

    static #handleInput(event) {
        if(
            this.#gameBoard.getActiveRowIndex() != null &&
            this.#gameBoard.getActiveColumnIndex() != null &&
            this.#initialBoard[this.#gameBoard.getActiveRowIndex()][this.#gameBoard.getActiveColumnIndex()] == 0
        ) {
            //only allow changing of cell value if not initially given cell
            if (isFinite(event.key) && event.key != 0) {
                //1-9 keys only
                console.log(event.key);
                if(this.#initialBoard[this.#gameBoard.getActiveRowIndex()][this.#gameBoard.getActiveColumnIndex()] == 0) {
                    this.#gameBoard.updateCurrentCellValue(this.#table, parseInt(event.key));
                }
            }
            else if(event.key == "Backspace" || event.key == "Delete"){
                this.#gameBoard.deleteCurrentCellValue(this.#table);
            }
        }

    };

    static #changeActiveCell(e) {
        let rowIndex = e.path[1].rowIndex;
        let cellIndex = e.path[0].cellIndex;
        this.#gameBoard.setActiveRowIndex(rowIndex);
        this.#gameBoard.setActiveColumnIndex(cellIndex);
        this.#gameBoard.draw(this.#table);
    }
}