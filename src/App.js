import React from 'react';
import './App.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}


class Board extends React.Component { // Renders the actual board
  renderSquare(i) { // Creates each actual square by passing the Square function above with the
    return (        // actual prop value passed in the render function below
      <Square
        value={this.props.squares[i]} // sets the value of the button rendered to equate to a field in the
        onClick={() => this.props.onClick(i)} // array passed into the state in the 'Game' class
      /> // 'onClick' will cause the onClick function to evaluate i in the 'Game' class
    );
  }
  render() {
    return ( // renders the board by passing an integer into the renderSquare function
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }

}

class Game extends React.Component {
  constructor(){
    super(); // initializes the 'Game' class
    this.state = { // initializes state with array named history which tracks the changes to the array squares
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0, // counts how many moves were made
      xIsNext: true, // boolean value that is changed each move to determine whether it is the turn for 'x' or 'o'
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // the array of the states of the squares array
    const current = history[history.length-1]; // integer value of how many clicks have been tracked
    const squares = current.squares.slice(); // creates a copy of the array
    if (calculateWinner(squares) || squares[i]){ // evaluates if there is a winning placement
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'; // sets the
    this.setState({
        history: history.concat([{
            squares: squares, // appends new squares array to the history array
        }]),
        stepNumber: history.length, // sets state of click number to total number of items in history array
        xIsNext: !this.state.xIsNext, // sets state of xIsNext to the opposite of what it was in the previous iteration
    });
  }

  jumpTo(step){ // function that lets you review previous states of the squares array by changing state
    this.setState({
        stepNumber: step,
        xIsNext: (step%2) ? false : true, // if step % 2 == 0 set xIsNext to false, otherwise it's true
    });
  }

  render() { // renders game
    const history = this.state.history; // grabs history from state
    const current = history[this.state.stepNumber]; // grabs squares array using history array and stepNumber from state
    const winner = calculateWinner(current.squares); // evaluates if move causes a winning set up

    const move = history.map((step, move) => { // creates a hash table that maps squares array to moves
        const desc = move ? 'Move #' + move : 'Game start'; // if moves exist write out moves
        return ( // returns move items passed to render below
        <li key={move}> // maps individual li item to move
            <a href='#' onClick={() => this.jumpTo(move)}>{desc}</a> // onClick triggers jumpTo function for move
        </li>
        );
    });

    let status;
    if(winner){ // conditional to check result from winner called which is equal to calculateWinner function above
      status = 'Winner: ' + winner;
    }else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return ( // renders board and passes variables of status & move to be displayed as well
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)} // A click action on the board calls the handleClick for array item clicked
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{move}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) { // function checks board to see if there are any winning positions
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for(let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
    }
  }
  return null;
}





export default Game; // exports 'Game' class to be used by index.js
