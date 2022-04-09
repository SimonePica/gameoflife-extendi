import React from 'react';
import Cell from "../Cell/Cell.component";
import styles from "./Board.module.css";

class Board extends React.Component {
    constructor(props) {
      super(props);

      this.timerID = null;
      var currentState = [
        ["*", ".", ".", "*", ".",".", ".", "*","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", ".", ".", "*", ".", "*",".", ".","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", "*", ".", ".", ".", ".",".", ".","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        [".", ".", ".", ".", ".", "*","*", ".", ".","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", ".", ".", ".", ".",".", ".", ".","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", ".", ".", "*", ".",".", ".", "*","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", ".", ".", "*", ".", "*",".", ".","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", "*", ".", ".", ".", ".",".", ".","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        [".", ".", ".", ".", ".", "*","*", ".", ".","*","*", ".", ".", "*", ".",".", ".", "*","*","*"],
        ["*", ".", ".", ".", ".",".", ".", ".","*","*","*", ".", ".", "*", ".",".", ".", "*","*","*"]
      ];
      this.state = {board: currentState, update: true};
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

    componentDidUpdate() {
      // Interrompe il timer di aggiornamento quando non ci sono ulteriori generazioni
      if(!this.state.update) {
        clearInterval(this.timerID);
      }
    }

    /**
     * Genera lo stato successivo della board
     */
    setNextGeneration() {
      let l_mCurrentBoard = this.state.board;
      let l_mNextBoard = [];
      var l_bBoardStateIsChanged = false;

      // Genero il prossimo stato della board
      for (let i = 0; i < l_mCurrentBoard.length; i++) {
        let l_aNewRow = []
        for (let j = 0; j < l_mCurrentBoard[i].length; j++) {

          // Array binario con lo stato dei vicini
          // 1 => il vicino è vivo
          // 0 => il vicino è morto
          let l_aNeighborsState = [
            // top-left cell
            (i-1>=0 && j-1>=0 && l_mCurrentBoard[i-1][j-1] === "*") ? 1 : 0,
            // top cell
            (i-1>=0 && l_mCurrentBoard[i-1][j] === "*") ? 1 : 0,
            // top-right cell
            (i-1>=0 && j+1<l_mCurrentBoard[i-1].length && l_mCurrentBoard[i-1][j+1] === "*") ? 1 : 0,
            // left cell
            (j-1>=0 && l_mCurrentBoard[i][j-1] === "*") ? 1 : 0,
            // right cell
            (j+1<l_mCurrentBoard[i].length && l_mCurrentBoard[i][j+1] === "*") ? 1 : 0,
            // bottom-left cell
            (i+1<l_mCurrentBoard.length && j-1>=0 && l_mCurrentBoard[i+1][j-1] === "*") ? 1 : 0,
            // bottom cell
            (i+1<l_mCurrentBoard.length && l_mCurrentBoard[i+1][j] === "*") ? 1 : 0,
            // bottom-right cell
            (i+1<l_mCurrentBoard.length && j+1<l_mCurrentBoard[i+1].length && l_mCurrentBoard[i+1][j+1] === "*") ? 1 : 0
          ];

          //Calcolo il numero totale di vicini vivi
          let l_iTotalAlives = l_aNeighborsState.reduce((sum, value) => sum + value, 0);
          
          l_aNewRow.push(
            (l_mCurrentBoard[i][j] === "*") ? 
              (l_iTotalAlives<2 || l_iTotalAlives>3 ?  "." : "*") :
              (l_iTotalAlives !== 3 ? "." : "*")
          );

          l_bBoardStateIsChanged = l_bBoardStateIsChanged || l_aNewRow[j] != l_mCurrentBoard[i][j];
        }
        l_mNextBoard.push(l_aNewRow);
      }
      
      this.setState({
        board: l_mNextBoard,
        update: l_bBoardStateIsChanged
      });
      console.log("A");
    }
  
    /**
     * Rappresentazione della board
     * 
     * @returns elemento del dom
     */
    render() {
        return (
          <div className={styles.board}>
            {
              this.state.board.map
              (
                (row, rowKey) =>
                  <div className={styles.boardRow} key={rowKey}>
                    {
                      row.map
                      (
                        (state, cellKey)=>
                          <Cell className={styles.boardCell} state={state} key={cellKey} />
                      )
                    }
                  </div>
              )
            }
          </div>
        );
    }
  }

export default Board;