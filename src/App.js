import React, { Component } from 'react';
import './App.css';
import Screen from './components/Screen';
import Pad from './components/Pad';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formula: '',
      input: '0',
      saved: '',
      negativeFlag: 0,
      operatorFlag: false,
      equalKey: 0,
      prevRes: '',
      arrSigns: []
    }
    this.handleNumber = this.handleNumber.bind(this)
    this.handleOperator = this.handleOperator.bind(this)
    this.handleAC = this.handleAC.bind(this)
    this.handleDEL = this.handleDEL.bind(this)
    this.handleNegative = this.handleNegative.bind(this)
    this.handleDecimal = this.handleDecimal.bind(this)
    this.handleEqual = this.handleEqual.bind(this)
  }
  handleNumber(e) {
    const value = e.target.value;
    const { input, formula, saved } = this.state
    this.setState({
      operatorFlag: false,
      negativeFlag: 0,
      equalKey: 0
    })
    if (!/[1-9.]/.test(input)) { // si el input está en 0, o sea, al iniciar, el texto del input es sustituido por la tecla; o al introducir algunos de los operadores'
      this.setState({
        input: value,
        formula: saved.length === 0 ? value
          : /[*+\-/]$/.test(formula) ? formula + value
          : value === '0' ? formula : formula.slice(0,-1) + value
      })
    } else { // en caso contrario, está introduciendo una serie de numeros, entonces el input se va anexando al valor anterior 
      if (this.state.prevRes !== '') { // cuando marco un numero y el resultado previo no está vacío, sustituye el input y memory por el nuevo numero
        this.setState({
          prevRes: '',
          input: value,
          formula: value
        })
      }
      else {
        this.setState({
          input: input + value,
          formula: formula + value,
          saved: formula + value
        })
      }
    }
  }
  handleOperator(e) {
    const value = e.target.value;
    const { formula, negativeFlag, arrSigns, prevRes } = this.state
    if (/\+|\/|\*/.test(value)) {
      this.setState({
        operatorFlag: true,
        negativeFlag: 0,
        equalKey: 0
      })
    }
    if (value === '-') {
      this.setState({
        negativeFlag: negativeFlag + 1,
        equalKey: 0
      })
    }
    if (prevRes !== '') {
      this.setState({
        input: value,
        formula: prevRes + value,
        saved: prevRes + value,
        prevRes: '',
        arrSigns: arrSigns.concat(value)
      })
    }
    else {
      if (!/[*+\-/]$/.test(formula)) { // si no encuentra ningun operador al final de la memoria, entonces añade el operador al final
        if (formula.length === 0 && /\/|\*/.test(value)) { // evita que se coloque un x o / al inicio
          this.setState({
            input: value,
            formula: '',
            saved: ''
          })
        } else {
          this.setState({
            input: value,
            formula: formula + value,
            saved: formula + value
          })
        }
      }
      else if (/[*+\-/]$/.test(formula)) { // si lo encuentra y presiono otro operador, entonces corta lo que había en la memoria y añade el nuevo input
        if (formula.length === 1 && /\/|\*/.test(value)) { // evita que se coloque un x o / al inicio
          this.setState({
            input: value,
            formula: '',
            saved: ''
          })
        }
        else {
          this.setState({
            input: value,
            formula: formula.slice(0, - 1) + value,
            saved: formula.slice(0, - 1) + value
          })
        }
        if (!/[0-9.]/.test(formula.slice(- 2, - 1)) && negativeFlag > 0 && formula.length > 1) {
          // si el antepenultimo elemento no es un numero y presiono un nuevo operador, entonces se sustituyen los dos operadores consecutivos por el nuevo operador, exceptuando el negativo
          this.setState({
            input: value,
            formula: value !== '-' ? formula.slice(0, - 2) + value : formula,
            saved: value !== '-' ? formula.slice(0, - 2) + value : formula
          })
        }
      }

      if (formula.length > 0 && (arrSigns[arrSigns.length - 2] !== value || arrSigns[arrSigns.length - 1] !== value)) { // restringue no añadir operadores repetidos al arreglo
        this.setState({
          arrSigns: arrSigns.concat(value)
        })
      }
    }
  }
  handleDEL() {
    const { formula, operatorFlag, input } = this.state
    if (formula.length > 1 && !/=/.test(formula)) {
      this.setState({
        input: input.slice(0, -1),
        formula: formula.slice(0, - 1),
        operatorFlag: operatorFlag ? false : false
      })
    } else if (formula.length === 1) {
      this.handleAC();
    }
  }
  handleAC() {
    this.setState({
      formula: '',
      input: '0',
      saved: '',
      negativeFlag: 0,
      operatorFlag: false,
      equalKey: 0,
      prevRes: '',
      arrSigns: []
    })
  }
  handleNegative(e) {
    const value = e.target.value;
    const { formula, arrSigns, operatorFlag, negativeFlag } = this.state
    if (/[0-9.]/.test(formula.slice(- 2, - 1)) && arrSigns.length > 0 && formula.length > 1) { // si el antepenultimo elemento es un numero y se presiona 
      if (operatorFlag) { // si el operador está activado, se añade el nuevo signo negativo
        this.setState({
          input: value,
          formula: formula.slice(0, - 1) + arrSigns[arrSigns.length - 1] + value
        })
      }
      // else if (!operatorFlag && negativeFlag === 0) { // si el operador está en falso, y añado un solo negativo
      //   console.log('también entró aquí')
      //   this.setState({
      //     input: value,
      //     formula: formula.slice(0, - 1) + value
      //   })
      // } 
      else if (!operatorFlag && negativeFlag === 1) { // si añado dos negativos
        this.setState({
          input: value,
          formula: formula.slice(0, - 1) + arrSigns[arrSigns.length - 1] + value
        })
      } // se añade el negativo luego del signo anterior.
    }
  }
  handleDecimal() {
    const { input, formula } = this.state
    this.setState({
      operatorFlag: false,
      negativeFlag: 0,
      equalKey: 0
    })
    if (input === '0' && formula === '') { // si no hay nada en la calculadora
      this.setState({
        input: input + '.',
        formula: formula + '0.',
      })
    } else if (formula.slice(formula.length - 1).search(/\+|-|\/|\*/) === 0) { // si encuntra un operador en el input y se clickea un punto decimal, entonces se sustituye por "0."
      this.setState({
        input: '0.',
        formula: formula + '0.'
      })
    } else if (!input.includes('.')) { // si el input ya incluye un punto entonces no puede agregar otro
      this.setState({
        input: input + '.',
        formula: formula + '.'
      })
    }
  }
  handleEqual() {
    const { formula, equalKey, prevRes } = this.state
    this.setState({
      equalKey: equalKey + 1
    })
    if (formula.length > 0 && !/[*+\-/]$/.test(formula) && equalKey <1) {
      this.setState({
        prevRes: prevRes + this.arithmetic(this.state.formula),
        input: this.arithmetic(this.state.formula),
        formula: formula + '=' + this.arithmetic(this.state.formula)
      })
    }
  }
  arithmetic(str) {
    const rgxAllNums = /([^+\-/*])*/g // todos los numeros sin operadores positivos ni negativos
    const rgxOperator = /([+\-/*])/g // todos los operadores
    let arrNums = str.match(rgxAllNums);
    let arrOper = str.match(rgxOperator);
    arrNums.pop();
    let i = 0;
    let operation = arrNums.map((ele) => {
      if (ele.length !== 0) {
        return parseFloat(ele);
      } else {
        let operator = arrOper[i];
        i++;
        return operator;
      }
    })
    // Expression Logic:
    let acumulador = [];
    let prevPart = [];
    // ciclo for para efectuar división y multiplicación primero
    for (let i = 0; i < operation.length; i++) {
      if (typeof operation[i] === 'string') {
        if (operation[i].search(/\/|\*/g) !== -1) {
          let previous = operation[i - 1]; // tomo el elemento anterior
          let next = operation[i + 1]; // y el siguiente
          let index = i;
          if (previous !== undefined) {
            if (typeof next !== 'string') { // si no es un signo negativo
              acumulador.push(this.operationFunction(previous, next, operation[i]));
            } else { // si es un signo
              next = operation[i + 2]; // incremento la posición del next en 1 para hallar el número
              acumulador.push(this.operationFunction(previous, - next, operation[i]));
              i++; // y sumo uno al ciclo del for
            }
          }
          if (i - 1 < index) { // si no encontró un negativo en el next, entonces serán index será mayor
            prevPart = operation.slice(0, i - 1)
          } else { // esto hace que recorte adecuadamente la porción previa
            prevPart = operation.slice(0, i - 2)
          }
          let actualRes = acumulador[acumulador.length - 1]
          let nextPart;
          if (i + 1 < operation.length) {
            nextPart = operation.slice(i + 2, operation.length);
          }
          operation = prevPart;
          operation.push(actualRes);
          if (nextPart !== undefined) {
            for (let j = 0; j < nextPart.length; j++) { // añade el arreglo de nextpart uno por uno, si existe
              operation.push(nextPart[j]);
            }
          }
          i = 0; // si encontró un * ó / entonces vuelve a iniciar el contador a cero con la nueva longitud
        }
      }
    }
    let indexSum = 0;
    let result = [];
    // ciclo for para completar las operaciones de suma y resta
    if (operation.length === 1) { // si la operacion solo tiene un elemento, significa que solo multiplicó/dividió y lo devuelve
      return operation[0];
    } else if (operation.length !== 2) { // si el largo de los elementos es distinto que 2
      for (let i = 0; i < operation.length; i++) {
        if (typeof operation[i] === 'string') { // si consigo un signo
          let previous = operation[i - 1]; // tomo el elemento anterior
          let next = operation[i + 1]; // y el siguiente
          if (previous !== undefined) {
            if (typeof next !== 'string') { // si no es un signo negativo
              if (result.length === 0) { // acumulo la operación
                result.push(this.operationFunction(previous, next, operation[i]));
              } else if (result.length > 0) { // cuando ya tengo un elemento en el result
                result.push(this.operationFunction(result[indexSum], next, operation[i])); // utilizo ese elemento como previous e incremento para el siguiente caso
                indexSum++;
              }
            }
            else { // si es un signo
              next = operation[i + 2]; // incremento la posición del next en 1 para hallar el número
              if (result.length === 0) {
                result.push(this.operationFunction(previous, - next, operation[i]));
              } else if (result.length > 0) {
                result.push(this.operationFunction(result[indexSum], - next, operation[i]));
                indexSum++;
              }
              i++; // y sumo uno al ciclo del for
            }
          } else {
            previous = operation[i + 1]
            next = operation[i + 3]
            if (operation[i] === '-') {
              if (typeof next !== 'string') { // si no es un signo negativo
                if (result.length === 0) { // acumulo la operación
                  result.push(this.operationFunction(- previous, next, operation[i + 2]));
                }
              } else { // si es un signo
                next = operation[i + 4]; // incremento la posición del next en 1 para hallar el número
                if (result.length === 0) {
                  result.push(this.operationFunction(- previous, - next, operation[i + 2]));
                }
                i++; // y sumo uno al ciclo del for
              }
              i += 2;
            }
          }
        }
      }
    } else { // si es igual a 2, significa que solo es el signo del inicio y un numero
      if (operation[0] === '+') {
        result.push(this.operationFunction(1, operation[1], '*'));
      }
      else if (operation[0] === '-') {
        result.push(this.operationFunction(-1, operation[1], '*'));
      }
    }
    return result[result.length - 1];
  }
  operationFunction(prev, next, action) {
    let result;
    switch (action) {
      case '+':
        result = prev + next;
        break
      case '-':
        result = prev - next;
        break
      case '*':
        result = prev * next;
        break
      case '/':
        result = prev / next;
        break
      default:
        console.log('none');
        break;
    }
    return result;
  }
  render() {
    return (
      <div id="container">
        <Screen formula={this.state.formula} input={this.state.input} />
        <Pad numbers={this.handleNumber} operator={this.handleOperator} handleAC={this.handleAC} handleDEL={this.handleDEL} handleDecimal={this.handleDecimal} handleNegative={this.handleNegative} handleEqual={this.handleEqual} />
      </div>
    );
  }
}

