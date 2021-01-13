import React from 'react';

export default function Pad ({numbers, operator, handleAC, handleDEL, handleDecimal, handleNegative, handleEqual}){
     return(
          <div id="pad">
               <button className="padkey numbers" id="seven" value="7" onClick={numbers}>7</button>
               <button className="padkey numbers" id="eight" value="8" onClick={numbers}>8</button>
               <button className="padkey numbers" id="nine" value="9" onClick={numbers}>9</button>
               <button className="padkey operator" id="divide" value="/" onClick={operator}>÷</button>
               <button className="padkey numbers" id="four" value="4" onClick={numbers}>4</button>
               <button className="padkey numbers" id="five" value="5" onClick={numbers}>5</button>
               <button className="padkey numbers" id="six" value="6" onClick={numbers}>6</button>
               <button className="padkey operator" id="multiply" value="*" onClick={operator}>×</button>
               <button className="padkey numbers" id="one" value="1" onClick={numbers}>1</button>
               <button className="padkey numbers" id="two" value="2" onClick={numbers}>2</button>
               <button className="padkey numbers" id="three" value="3" onClick={numbers}>3</button>
               <button className="padkey operator" id="subtract" value="-" onClick={(e) => {operator(e); handleNegative(e)}}>-</button>
               <button className="padkey numbers" id="zero" value="0" onClick={numbers}>0</button>
               <button className="padkey operator" id="add" value="+" onClick={operator}>+</button>
               <button className="padkey operator" id="clear" value="AC" onClick={handleAC}>AC</button>
               <button className="padkey operator" id='del' value="DEL" onClick={handleDEL}>DEL</button>
               <button className="padkey operator" id="decimal" value="." onClick={handleDecimal}>.</button>
               <button className="padkey operator" id="equals" value="=" onClick={handleEqual}>=</button>
          </div>
     );
}