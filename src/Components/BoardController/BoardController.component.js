import React from 'react';
import Board from '../Board/Board.component';
import styles from "./BoardController.module.css";

let BOARD_STATE = Object.freeze({RUN: Symbol("RUN"), STOP: Symbol("STOP"), NOT_LOAD: Symbol("NOT_LOAD"), INVALID_FILE: Symbol("INVALID_FILE")});

class BoardController extends React.Component {
    constructor(props) {
      super(props);

      this.timerID = null;
      this.state = {
            speed: 500,
            board: null,
            boardKey: "0000000",
            generationCount: 0,
            controllerState: BOARD_STATE.NOT_LOAD
      }
      this.loadFile = this.loadFile.bind(this);
      this.start = this.start.bind(this);
      this.stop = this.stop.bind(this);
      this.setSpeed = this.setSpeed.bind(this);
      this.setCount = this.setCount.bind(this);
    }
    
    setCount(c = 0) {
        this.setState({
            generationCount: c
        });
    }

    setSpeed(e) {
        this.setState((prevState) => ({
            speed: e.target.value,
            controllerState: prevState.controllerState === BOARD_STATE.RUN ? BOARD_STATE.STOP : prevState.controllerState
        }));
    }

    start() {
        this.setState({
            controllerState: BOARD_STATE.RUN
        });
    }

    stop() {
        this.setState({
            controllerState: BOARD_STATE.STOP
        });
    }

    loadFile(e) {
        if(this.state.controllerState === BOARD_STATE.RUN)
            this.stop();

        const l_oFileReader = new FileReader();
        l_oFileReader.readAsText(e.target.files[0], "UTF-8");
        l_oFileReader.onload = e => {
            let l_oJSON = JSON.parse(e.target.result);

            let l_iRowLength = (l_oJSON.board || [[]])[0].length;
            if(l_iRowLength) {
                for(let i=0; i<l_oJSON.board.length || 0; i++) {
                    if(l_iRowLength !== l_oJSON.board[i].length) {
                        l_iRowLength = 0;
                        break;
                    }
                    for(let j=0; j<l_oJSON.board[i].length || 0; j++) {
                        if(l_oJSON.board[i][j] === "*" || l_oJSON.board[i][j] === ".") {
                            continue;
                        }
                        l_iRowLength = 0;
                        break;
                    }
                }
            }
            
            this.setState({
                boardKey: 'id' + (new Date()).getTime(),
                board: l_oJSON.board,
                generationCount: l_oJSON.initialGeneration,
                controllerState: isNaN(l_oJSON.initialGeneration) || !l_iRowLength ? BOARD_STATE.INVALID_FILE : BOARD_STATE.STOP
            });
        };
    }
  
    render() {
        return (
            <div className={styles.wrapper}>
            <aside>
                <header className={styles.logo}>
                    <div className={styles.group}>
                    <span className={styles.g}>G</span>
                    <span>ame<div><span className={styles.of}>OF</span> life</div></span>
                    </div>
                </header>
                <section>
                    <div className={styles.title}>
                    <h1>Conway's Game of Life<span>Prova Tecnica</span></h1>
                    <div className={styles.counter}><span>{this.state.generationCount}</span></div>
                    </div>
                    <label htmlFor="loadFile">File di configurazione</label>
                    <input type="file" name="loadFile" id="loadFile" onChange={this.loadFile} accept="application/JSON"/>
                    <label htmlFor="setSpeed">Velocità di esecuzione</label>
                    <input type="number" min="100" step="100" placeholder="500" name="setSpeed" id="setSpeed" onChange={this.setSpeed} />
                    <i>{this.state.speed < 100 ? "I valori inferiori a 100 saranno riportati al valore minimo" : ""}</i>
                    <div className={styles.buttons}>
                    <button className={styles.startButton} onClick={this.start} disabled={this.state.controllerState === BOARD_STATE.STOP ? "" : "disabled"}>Start</button>
                    <button className={styles.stopButton} onClick={this.stop} disabled={this.state.controllerState === BOARD_STATE.RUN ? "" : "disabled"}>Stop</button>
                    </div>
                </section>
            </aside>
            <main>
                {
                this.state.controllerState === BOARD_STATE.NOT_LOAD ? 
                    <div className={styles.messageWrapper}>
                        <div className={styles.message}>
                            <div className={styles.icon}>📂</div>
                            <span>Caricare un file di configurazione iniziale</span>
                        </div>
                    </div>
                :
                (
                    this.state.controllerState === BOARD_STATE.INVALID_FILE ?
                        <div className={styles.messageWrapper}>
                            <div className={styles.message}>
                                <div className={styles.icon}>❌</div>
                                <span>Il file di configurazione non è valido</span>
                            </div>
                        </div>
                    :
                        <Board key={this.state.boardKey} enable={this.state.controllerState === BOARD_STATE.RUN} board={this.state.board} speed={Math.max(this.state.speed, 100)} initialGeneration={this.state.generationCount} updateCount={this.setCount} />
                )
                }
            </main>
        </div>
        );
    }
  }

export default BoardController;