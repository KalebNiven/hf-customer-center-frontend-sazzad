import React from 'react'
import InputText from './inputText.js'

const AnswerInput = ({ isSelected, setIsSelected }) => {
    return (
        <div>
            <InputText isSelected={isSelected} setIsSelected={setIsSelected} />
        </div>
    )
}

export default AnswerInput
