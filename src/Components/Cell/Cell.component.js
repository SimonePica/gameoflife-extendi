import React from 'react';
import styles from "./Cell.module.css";

class Cell extends React.Component {
    constructor(props) {
      super(props);
    }
  
    /**
     * Rappresentazione di una cella
     * 
     * @returns elemento del dom
     */
    render() {
      // la proprietà state definisce se la cella è viva o morta.
      return (
        <div className={this.props.className}>
          <div className={styles.aspectRatio1x1}>
            <span className={this.props.state == "*" ? styles.alive : styles.dead}>{this.props.state == "*" ? "★" : "•"}</span>
          </div>
        </div>
      );
    }
  }

export default Cell;