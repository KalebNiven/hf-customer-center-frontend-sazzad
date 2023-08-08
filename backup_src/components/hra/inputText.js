import React from 'react'
import styled from 'styled-components'
import { setAnswerSelection } from '../../store/actions/index'
import { useSelector, useDispatch } from 'react-redux'

const InputText = ({ isSelected, setIsSelected, inputType }) => {
    const dispatch = useDispatch();
    const { form: { selected, active } } = useSelector(state => state.hra)

    const handleChange = (e) => {
        const value = e.target.value;
        setIsSelected(null);
        const info = { value };
        dispatch(setAnswerSelection({ id: active, info }))
    }

    return (
        <InputTextWrapper>
            <Input value={selected[active] ? selected[active][0].value.trim() : ""} onChange={handleChange} type={inputType} warning={isSelected === false} myWidth={selected[active] ? selected[active][0].value.length * 4 : 20} />
        </InputTextWrapper>
    )
}

const InputTextWrapper = styled.div`
    margin: 8px 8px 8px 0;
    display: ${props => props.inline ? "inline-block" : "block"};
`

const Title = styled.h3`
    width: 49px;
    height: 24px;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #474b55;
    margin-bottom: 5px;
    text-transform: capitalize;
    color: ${props => props.warning && "#a0252c"};
`

const Input = styled.input`
    min-height: 40px;
    width: ${props => props.myWidth > 20 ? `${props.myWidth}%` : `20%` };
    max-width: 100%;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #474b55;
    padding: 0 16px;
    border: 1px solid #474b55;
    border-radius: 4px;
    border: solid 1px #a8abac;
    border-color: ${props => props.warning && "#a0252c"};

    &[type=number]::-webkit-inner-spin-button, 
    &[type=number]::-webkit-outer-spin-button {  
        display: none;
    }

    &:focus {
        border-color: #474b55;
    }
`


export default InputText
