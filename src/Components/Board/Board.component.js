import React from 'react';
import Cell from "../Cell/Cell.component";
import styles from "./Board.module.css";

class Board extends React.Component {
    constructor(props) {
      super(props);

      var currentState = [
        ["*", ".", ".", "*", ".",".", ".", "*","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", ".", ".", "*", ".", "*",".", ".","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", "*", ".", ".", ".", ".",".", ".","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        [".", ".", ".", ".", ".", "*","*",".", ".","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", ".", ".", ".", ".",".", ".", ".","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", ".", ".", "*", ".",".", ".", "*","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", ".", ".", "*", ".", "*",".", ".","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", "*", ".", ".", ".", ".",".", ".","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        [".", ".", ".", ".", ".", "*","*",".", ".","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", ".", ".", ".", ".",".", ".", ".","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"]
      ];
      this.state = {board: currentState, n:0};

      this.setNextGeneration = this.setNextGeneration.bind(this);
    }
  
    componentDidMount() {
      this.timerID = setInterval(
        () => this.setNextGeneration(),
        1000
      );
    }

    componentWillUnmount() {
      clearInterval(this.timerID);
    }

    setNextGeneration() {
      let currentBoard = this.state.board;
      let nextBoard = [];
      var stateIsChanged = false;

      for (let i = 0; i < currentBoard.length; i++) {
        let clearRow = []
        for (let j = 0; j < currentBoard[i].length; j++) {
          let neighbors = [
            (i-1>=0 && j-1>=0 && currentBoard[i-1][j-1] === "*") ? 1 : 0,
            (i-1>=0 && currentBoard[i-1][j] === "*") ? 1 : 0,
            (i-1>=0 && j+1<currentBoard[i-1].length && currentBoard[i-1][j+1] === "*") ? 1 : 0,
            (j-1>=0 && currentBoard[i][j-1] === "*") ? 1 : 0,
            (j+1<currentBoard[i].length && currentBoard[i][j+1] === "*") ? 1 : 0,
            (i+1<currentBoard.length && j-1>=0 && currentBoard[i+1][j-1] === "*") ? 1 : 0,
            (i+1<currentBoard.length && currentBoard[i+1][j] === "*") ? 1 : 0,
            (i+1<currentBoard.length && j+1<currentBoard[i+1].length && currentBoard[i+1][j+1] === "*") ? 1 : 0
          ];
          let aliveNeighbors = neighbors.reduce((sum, value) => sum + value, 0);
          
          
          clearRow.push(
            (currentBoard[i][j] === "*") ? 
              (aliveNeighbors<2 || aliveNeighbors>3 ?  "." : "*") :
              (aliveNeighbors !== 3 ? "." : "*")
          );

          stateIsChanged = stateIsChanged || clearRow[j] != currentBoard[i][j];
        }
        nextBoard.push(clearRow);
      }

      this.setState({
        board: nextBoard,
        n: this.state.n+1
      })

      if(!stateIsChanged) {
        clearInterval(this.timerID);
      }
      console.log(nextBoard);
    }
  
    render() {
        return (
          <div className={styles.board}>
            {
              this.state.board.map(
                (row, index) =>
                  <div className={styles.boardRow} key={index}>
                    {row.map((state, index2)=>
                      <Cell className={styles.boardCell} state={state} key={index2} />
                    )}
                  </div>
              )
            }
          </div>
        );
    }
  }

export default Board;