import React from 'react';
import Cell from "../Cell/Cell.component";
import styles from "./Board.module.css";

class Board extends React.Component {
    constructor(props) {
      super(props);

      this.timerID = null;
      this.state = {board: this.props.board, count: 0};
      this.setNextGeneration = this.nextGeneration.bind(this);
    }
  
    componentDidMount() {
      let currentBoard = this.state.board;
      for(let i=0; i<(this.props.initialGeneration || 0); i++){
        currentBoard = this.nextGeneration(currentBoard);
      }

      this.setState({
        board: currentBoard,
        count: this.props.initialGeneration
      });
    }

    componentDidUpdate(prevProps, prevState) {
      if(prevProps.enable !== this.props.enable && this.props.enable) {
        this.timerID = setInterval(
          () => this.setState((prevState) => ({
            board: this.nextGeneration(),
            count: prevState.count + 1
          })),
          this.props.speed || 100
        );
      } else if(prevProps.enable !== this.props.enable && !this.props.enable) {
        clearInterval(this.timerID);
      }

      if (prevState.count !== this.state.count && typeof this.props.updateCount === "function") 
        this.props.updateCount(this.state.count);
      
    }

    componentWillUnmount() {
      clearInterval(this.timerID);
    }

    /**
     * Genera lo stato successivo della board
     */
    nextGeneration(currentBoard = null) {
      let l_mCurrentBoard = currentBoard || this.state.board;
      let l_mNextBoard = [];

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
        }
        l_mNextBoard.push(l_aNewRow);
      }
      
      return l_mNextBoard;
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