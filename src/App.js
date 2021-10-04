import { Component } from 'react';

import { wrongDestinations } from './data';

import './App.css';

const snake = <div className='block snake'></div>
const food = <div className='block food'>
                <img src='./food-flower.png'
                alt=''></img>
            </div>
const emptyBody = <div className='block empty'></div>
const boardStyle = {
    backgroundImage: 'url("../background.jpg")',
    backgroundSize: 'cover'
}

class App extends Component {
    constructor(props) {
        super(props);
        this.setNewState = this.setNewState.bind(this);
        this.randomCoordinates = this.randomCoordinates.bind(this);
        this.foodEaten = this.foodEaten.bind(this);
        this.clearState = this.clearState.bind(this);
        this.preparation = this.preparation.bind(this);
        this.checkForContradiction = this.checkForContradiction.bind(this);

        this.state = {
            board: [],
            boardSize: 0,
            snakeIndex: [],
            food: [],
            interval: -1,
            continue: false,
            destination: null,
            componentMounted: false,
            points: 0,
            failed: null
        };
    }

    randomCoordinates(size) {
        const rand = () => (Math.random() * (size - 1));
        return [[Number(rand().toFixed()), Number(rand().toFixed())]];
    }

    checkForContradiction(snakeIndex, foodIndex, size) {

        let newFoodIndex = foodIndex;
        snakeIndex.forEach((index) => {
            while ( Number(index[0]) === newFoodIndex[0][0] && Number(index[1]) === newFoodIndex[0][1] ) {
                newFoodIndex = this.randomCoordinates(size);                  
            }
        })

        return newFoodIndex;
    }

    preparation() {

        const size = 20;
        let emptyArray = [];

        let randIndex = this.randomCoordinates(size);
        let foodIndex = this.randomCoordinates(size);
        
        foodIndex = this.checkForContradiction(randIndex, foodIndex, size);        
        
        for ( let x = 0; x < size; x++ ) {
            emptyArray.push([]);
            for ( let i = 0; i < size; i++ ) {
                emptyArray[x].push([0])
            }
        }
        emptyArray[randIndex[0][0]][randIndex[0][1]] = [1];  
        emptyArray[foodIndex[0][0]][foodIndex[0][1]] = [100];
        
        this.setState({
            board: emptyArray,
            snakeIndex: randIndex,
            food: foodIndex,
            destination: null,
            componentMounted: true,
            boardSize: size
        })
    }

    componentDidMount() {

        this.preparation();

        const superComponent = document.querySelector('*');
        superComponent.addEventListener('keyup', (event) => {
            switch ( event.key ) {
                case 'ArrowUp':
                    this.setNewState('Up');
                    break;
                case 'ArrowDown':
                    this.setNewState('Down');
                    break;
                case 'ArrowLeft':
                    this.setNewState('Left');
                    break;
                case 'ArrowRight':
                    this.setNewState('Right');
                    break;
                default:
                    break;
            }
        })
    }

    snakeBodyMismatch(snakeIndices, head) {

        snakeIndices.forEach((indexPair, counter) => {
            if ( counter > 0 && ( indexPair[0] === head[0] && indexPair[1] === head[1] ) ) {
                throw new Error();
            }
        })
    }

    setNewState(destination) {

        const movementSpeed = 150;
        const currentDestination = this.state.destination;
        const { failed } = this.state;

        if ( wrongDestinations[currentDestination] === destination || failed || currentDestination === destination ) {} else {

        let { interval } = this.state;
        if ( interval >= 0 ) clearInterval(interval)
        else {}

        switch ( destination ) {

            case 'Up':

                interval = setInterval(() => {
                    
                    try {
                        
                        let { 
                            newBoard, 
                            snakeIndices, 
                            head, 
                            olderCoords,
                        } = this.destructSnake(this.state);
                        
                        this.snakeBodyMismatch(snakeIndices, head);

                        for ( let i = snakeIndices.length - 1; i >= 0; i-- ) {

                            snakeIndices.length === 1

                            ? snakeIndices = [[Number(head[0] - 1), Number(head[1])]]
                            : snakeIndices[i] = i > 0 ? snakeIndices[i - 1] : [Number(head[0] - 1), Number(head[1])];

                        }

                        snakeIndices.forEach((indexPair) => {
                            newBoard[indexPair[0]][indexPair[1]] = 1;
                        })
                        newBoard[olderCoords[0]][olderCoords[1]] = 0;

                        
                        if ( head[0] - 1 === -1 ) {
                            throw new Error();
                        }
    
                        this.setState({
                            board: newBoard,
                            snakeIndex: snakeIndices,
                            interval: interval,
                            destination
                        }, () => this.foodEaten(this.state.snakeIndex, this.state.food, olderCoords))
                    } catch (e) {
                        clearInterval(this.state.interval);
                        this.pauseGame();
                    }
                    
                }, movementSpeed);
                this.setState({ interval: interval });

                break;

            case 'Down':

                interval = setInterval(() => {
                    try {

                        let { 
                            newBoard, 
                            snakeIndices,
                            head, 
                            olderCoords,
                            boardSize,
                        } = this.destructSnake(this.state);

                        this.snakeBodyMismatch(snakeIndices, head);
                        
                        for ( let i = snakeIndices.length - 1; i >= 0; i-- ) {

                            snakeIndices.length === 1

                            ? snakeIndices = [[Number(head[0] + 1), Number(head[1])]]
                            : snakeIndices[i] = i > 0 ? snakeIndices[i - 1] : [Number(head[0] + 1), Number(head[1])];

                        }

                        snakeIndices.forEach((indexPair) => {
                            newBoard[indexPair[0]][indexPair[1]] = 1;
                        })
                        newBoard[olderCoords[0]][olderCoords[1]] = 0;
                        
                        if ( head[0] + 1 === boardSize ) {
                            throw new Error();
                        }
    
                        this.setState({
                            board: newBoard,
                            snakeIndex: snakeIndices,
                            interval: interval,
                            destination
                        }, () => this.foodEaten(this.state.snakeIndex, this.state.food, olderCoords))
                    } catch (e) {
                        clearInterval(this.state.interval);
                        this.pauseGame();
                    }
                    
                  }, movementSpeed);
                this.setState({ interval: interval });

                break;

            case 'Left':

                interval = setInterval(() => {
                    try {

                        let { 
                            newBoard,
                            snakeIndices, 
                            head, 
                            olderCoords 
                        } = this.destructSnake(this.state);

                        this.snakeBodyMismatch(snakeIndices, head);
                        
                        for ( let i = snakeIndices.length - 1; i >= 0; i-- ) {

                            snakeIndices.length === 1

                            ? snakeIndices = [[Number(head[0]), Number(head[1] - 1)]]
                            : snakeIndices[i] = i > 0 ? snakeIndices[i - 1] : [Number(head[0]), Number(head[1] - 1)];

                        }

                        snakeIndices.forEach((indexPair) => {
                            newBoard[indexPair[0]][indexPair[1]] = 1;
                        })
                        newBoard[olderCoords[0]][olderCoords[1]] = 0;

                        
                        if ( head[1] - 1 === -1 ) {
                            throw new Error();
                        }
    
                        this.setState({
                            board: newBoard,
                            snakeIndex: snakeIndices,
                            interval: interval,
                            destination
                        }, () => this.foodEaten(this.state.snakeIndex, this.state.food, olderCoords))
                    } catch (e) {
                        clearInterval(this.state.interval);
                        this.pauseGame();
                    }
                    
                }, movementSpeed);
                this.setState({ interval: interval });

                break;

            case 'Right':

                interval = setInterval(() => {

                    try {

                        let { 
                            newBoard, 
                            snakeIndices, 
                            head, 
                            olderCoords,
                            boardSize,
                        } = this.destructSnake(this.state);

                        this.snakeBodyMismatch(snakeIndices, head);
                        
                        for ( let i = snakeIndices.length - 1; i >= 0; i-- ) {

                            snakeIndices.length === 1

                            ? snakeIndices = [[Number(head[0]), Number(head[1] + 1)]]
                            : snakeIndices[i] = i > 0 ? snakeIndices[i - 1] : [Number(head[0]), Number(head[1] + 1)];

                        }

                        snakeIndices.forEach((indexPair) => {
                            newBoard[indexPair[0]][indexPair[1]] = 1;
                        })
                        newBoard[olderCoords[0]][olderCoords[1]] = 0;
                        
                        if ( head[1] + 1 === boardSize ) {
                            throw new Error();
                        }
    
                        this.setState({
                            board: newBoard,
                            snakeIndex: snakeIndices,
                            interval: interval,
                            destination
                        }, () => this.foodEaten(this.state.snakeIndex, this.state.food, olderCoords))
                    } catch (e) {
                        clearInterval(this.state.interval);
                        this.pauseGame();
                    }
                    
                }, movementSpeed);
                this.setState({ interval: interval });

                break;
    
            default:
                break;

        }
    }
    }
    
    clearState() {
        this.setState({
            board: [],
            snakeIndex: [],
            food: [],
            interval: -1,
            continue: false,
            destination: null,
            componentMounted: false
        }, () => this.preparation());
    }

    foodEaten(snakeIndex, foodIndex, olderCoords) {
        
        let newFoodIndex;
        let newSnakeIndex;
        const size = this.state.boardSize;

        if ( snakeIndex[0][0] === foodIndex[0][0] && snakeIndex[0][1] === foodIndex[0][1] ) {
            newFoodIndex = this.randomCoordinates(size);

            newSnakeIndex = snakeIndex;
            newSnakeIndex.push(olderCoords);

            newFoodIndex = this.checkForContradiction(newSnakeIndex, newFoodIndex, size);

            const newBoard = this.state.board;
            newBoard[newFoodIndex[0][0]][newFoodIndex[0][1]] = 100;

            this.setState({
                board: newBoard,
                food: newFoodIndex,
                snakeIndex: newSnakeIndex,
                points: this.state.points + 1
            });
        }

    }

    destructSnake(state) {
        const newBoard = state.board;
        const boardSize = state.boardSize;
  
        let snakeIndices = state.snakeIndex;
        
        let head = snakeIndices[0];
        let olderCoords = snakeIndices[snakeIndices.length - 1];

        return {
            newBoard,
            snakeIndices,
            head,
            olderCoords,
            boardSize,
        };
    }

    pauseGame() {
        this.setState({
            failed: true,
            continue: false
        })
    }

    render() {

        const { failed, points } = this.state;

        const resultLog = [
            failed
            ? <p id='final'>{`You Lost, Your Point Was ${points}.`}</p>
            : <p id='points'>{`Your Point Is: ${points}`}</p>
        ]

        const resultButton = (
            <button
            onClick={() => {
                this.setState(
                { 
                    points: 0,
                    failed: false 
                }, 
                () => this.clearState()
            )
            }}>Play Again!</button>
        )

        const Logs = [
            <div className='LogsSection'>
                <div>
                    { resultLog }
                </div>
                {
                    failed
                    ? resultButton
                    : null
                }
                
            </div>
        ]

        const { board, componentMounted } = this.state;

        if ( componentMounted ) {
          let table = <table>
              { board.map((array, arrayIndex) => {
                  let row = null;
                  try {
                      row = (<tr>
                          { array.map((element, elementIndex) => {
                                if ( Number(element) === 1 ) {
                                  return <td>{ snake }</td>                            
                              } else if ( Number(element) === 100 ) {
                                  return <td>{ food }</td>
                              } else {
                                  return <td>{ emptyBody }</td>
                              }
                          }) }
                      </tr>)
                  } catch (e) {
                      this.pauseGame();
                }
                
                return row;
                
            }) }
          
      </table>
    
      

      return(
          <div className='board' style={boardStyle}>
              { Logs }
              { table }
          </div>
      )
        } else {
          return(
            <div className='board' style={boardStyle}
            ></div>
        )
        }
        
    }
}

export default App;