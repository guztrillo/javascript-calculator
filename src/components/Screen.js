import React from 'react';

export default function Screen({formula,input}){
     return (
          <div id="screen">
               <div id="formula">{formula}</div>
               <div id="display">{input}</div>
          </div>
     );
}