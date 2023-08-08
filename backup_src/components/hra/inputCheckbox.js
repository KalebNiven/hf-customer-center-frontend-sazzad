import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { setAnswerSelection } from '../../store/actions/index'
import { MULTY_SELECT, FREE_TEXT } from '../../constants/hra-types'

const InputCheckbox = ({ title, id, code, depId, answer_with_text, isSelected, setIsSelected, warning }) => {
    const dispatch = useDispatch();
    const { data, form: { selected, active } } = useSelector(state => state.hra);
    const [hovered, setHovered] = useState(null);

    const itemId = depId || active;

    const handleCheckboxChange = (e) => {
        setIsSelected(null);
        const info = { id: id, answer_code: code, answer_value: "" }
        dispatch(setAnswerSelection({ id: depId || active, info, type: MULTY_SELECT }))
    }

    const handleTextareaChange = (e) => {
        const info = { id: id, answer_code: code, answer_value: e.target.value ? e.target.value : "" }
        dispatch(setAnswerSelection({ id: depId || active, info, type: FREE_TEXT }))
    }

    const isChecked = selected[itemId] && selected[itemId].some(item => {
        return item.id === id
    })

    const checkedItem = () => {
        let checkedItem = null;
        checkedItem = selected[itemId] && selected[itemId].find(item => item.id === id);
        return checkedItem;
    }

    const checked = checkedItem()

    return (
        <RadioWrapper onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <Label htmlFor={`${itemId}-${code}`}>
                <LabelRadio>
                    <Input type="checkbox" id={`${itemId}-${code}`} checked={isChecked || false} onChange={handleCheckboxChange} />
                    <Radio warning={warning || (isSelected === false)} hovered={hovered} />
                </LabelRadio>
                <LabelText warning={warning || (isSelected === false)}>{title}</LabelText>
            </Label>
                { (isChecked && answer_with_text) && 
                    <TextAreaWrapper>
                        <TextArea placeholder="Enter comment" maxLength="250" onChange={handleTextareaChange} value={checked.answer_value || ""}></TextArea>
                        <TextCount>{(checked.answer_value.length) || 0}/250</TextCount>
                    </TextAreaWrapper> }
        </RadioWrapper>
    )
}

const RadioWrapper = styled.div`
    border-bottom: 1px solid #d8d8d8;
    padding: 3px 0;
    display: flex;
    flex-direction: column;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
`

const Input = styled.input`
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
        background: #003863;
        border: .3em solid #003863;
    }

    &:checked + span::before {
        display: block;
        content: ' ';
        background-image: url('./react/images/icn-checkmark-white.svg');
        background-size: 10px 10px;
        height: 10px;
        width: 10px;
        position: absolute;
    }
`

const Radio = styled.span`
    display: block;
    width: 1.2em;
    height: 1.2em;
    border-radius: 4px;
    border: 0.1em solid #d8d8d8;
    transform: translateY(0.15em);
    margin-right: 10px;
    cursor: pointer;
    border-color: ${props => props.warning && "#a0252c"};
    /* hover */
    border-color: ${props => props.hovered && "#474b55"};
`

const Label = styled.label`
    display: flex;
    cursor: pointer;
`

const LabelRadio = styled.span`
    display: flex;
`

const LabelText = styled.span`
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #474b55;
    cursor: pointer;
    word-break: break-word;
    text-transform: capitalize;
    color: ${props => props.warning && "#a0252c"}
`

const TextAreaWrapper = styled.div`
    margin-left: 30px;
`

const TextArea = styled.textarea`
    resize: none;
    width: 100%;
    padding: 8px 40px 8px 12px;
    border-radius: 4px;
    border: solid 1px #a8abac;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #474b55;
    
    &:focus {
        border-color: #474b55;
    }
`

const TextCount = styled.div`
    font-size: 12px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: 0.4px;
    text-align: right;
    color: #474b55;
`

export default InputCheckbox
