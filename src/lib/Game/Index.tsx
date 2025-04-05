
import React from 'react'
import { BoxGame } from './BoxGame'
import { SortGame } from './SortGame'
import { ColorUpGame } from './ColorUpGame'
import EquationGame from './DivisionGame'

function Game() {
    return (
        <>
            <EquationGame 
                shape="apple"
                operand1={3}
                operand2={2}
                operation="+"
                result={5}
                isCorrect={false}
                setIsCorrect={() => {}}
            />
        </>
    )
}

export default Game
