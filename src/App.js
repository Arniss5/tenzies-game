import React, {useState, useEffect} from "react";
import Die from './Die';
import { nanoid } from 'nanoid'
import Confetti from 'react-dom-confetti';


function App() {

  //React useState => to hold Dice Array
  const [diceArray, setDiceArray] = useState(getNewNumbers())
  //=> to check if game is won
  const [tenzies, setTenzies] = useState(false)
  //=> roll counter
  const [rollCounter, setRollCounter] = useState(0)
  //=> timer
  const [timer, setTimer] = useState(0)

  //create dice-objects array
  function getNewNumbers() {
    let diceElements = []

    for(let i=0; i < 10; i++) {
      diceElements.push(
        {
          id: nanoid(), 
          value: Math.ceil(Math.random() * 6),
          isHeld: false,
        }
      )
    }
    return diceElements
  }

//set timer, stop it when game is won and set it to 0 when game starts
  useEffect(() => {
    let interval
    if(!tenzies) {
      interval = setInterval(() => {
        setTimer(prevTime=> prevTime + 1);
      }, 1000)
    }
    
    else if (tenzies) {
      setTimer(prevTime=> prevTime)
      clearInterval(interval)
    }
    return () => clearInterval(interval);
  }, [tenzies]);
  
  

  function reroll() {
    if(tenzies) {
      
      setTenzies(false)
      setDiceArray(getNewNumbers())
      setRollCounter(0)
      setTimer(0)
    } else {

      setDiceArray(prevArray => {
        return prevArray.map(element => 
          element.isHeld ? 
          element : {...element, value: Math.ceil(Math.random() * 6)}
        )
        
      })
      setRollCounter(prevValue => prevValue + 1)
    }
  }

  //function to hold die
  function holdDice(id) {
    setDiceArray(prevArray => {
      return prevArray.map(element => 
        element.id === id ? 
        {...element, isHeld: !element.isHeld} : element)}
    )
  }

  //check is tenzies is true and game is won
  useEffect(()=>{
    const allHeld = diceArray.every(element => element.isHeld === true)
    const valuesTheSame = diceArray.every(element=> element.value===diceArray[0].value)
    if (allHeld && valuesTheSame) {
      setTenzies(true)
    }
  }, [diceArray])


  
 // 10 Dice components
  const diceComponents = diceArray.map(die => {
    return (
      <Die 
        key= {die.id}
        value = {die.value}
        isHeld = {die.isHeld}
        holdDice = {()=> holdDice(die.id)}
      />
    )
  })

  //confetti config
  const config = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

  return (
    <main>
      <Confetti active={tenzies} config={ config } className="confetti"/>
      
      <h1>Tenzies</h1>
      <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>

      <div className="dice-container">
        {diceComponents}
      </div>
      <button className="roll-btn" onClick={reroll}>{tenzies? "New game" : "Roll"}</button>
      <div className="counters-container">
        <div className="time-counter">Time: {timer} {timer === 1 ?" sec ":" secs"}</div>
        <div className="roll-counter">Number of rolls: {rollCounter}</div>
      </div>
    </main>
  );
}

export default App;
