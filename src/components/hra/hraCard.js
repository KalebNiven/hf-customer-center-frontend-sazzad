import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from "react-redux";
import { requestNextQuestion, requestPreviousQuestion, requestHraQuestions, requestSubmitHraSurvey, receiveHraPartials } from '../../store/actions/index';
import CardQuestion from './cardQuestion'
import SurveySuccess from './surveySuccess'
import { getQuestionById, getAnswerById } from '../../utils/lookup'
import { SINGLE_SELECT, MULTY_SELECT, MATRIX, FREE_TEXT } from '../../constants/hra-types'
import { useHistory } from "react-router-dom";
import { getHraPartials, saveHraSurveyResponseToDB } from '../../store/saga/apis'
import { MainContentContainer } from '../common/styles';
import { getHraStatus } from '../../store/saga/apis'

const HRACard = () => {
    const { data, form: { active, selected, pending, visited } } = useSelector((state) => state.hra);
    const hraMemberInfo = useSelector(state => state.hra.data.memberInfo);
    const dispatch = useDispatch();
    const history = useHistory();

    const [surveySuccess, setSurveySuccess] = useState(false);
    const [isSelected, setIsSelected] = useState(null);
    const [visible, setVisible] = useState(false);
    const [stepInProgress, setStepInProgress] = useState(false);
    const [loading, setLoading] = useState(true);
    const [memberId, setMemberId] = useState(null);
    const [surveyStatus, setSurveyStatus] = useState(null);

    useEffect(() => {
        if(!memberId) return;
        getHraStatus(memberId)
        .then(data => {
            setSurveyStatus({ status: data.status, days_from_completion: data.days_from_completion})
        })
        .catch(err => console.log("Error caught: ", err.message)) 
    }, [memberId])
    
    useEffect(() => {
        setMemberId(history.location.pathname.slice(5))
    }, [])

    useEffect(() => {
        if(surveySuccess) setVisible(true);
    }, [surveySuccess])

    useEffect(() => {
        if(!memberId) return
        dispatch(requestHraQuestions(memberId))
    }, [memberId])

    useEffect(() => {
        setIsSelected(null)
        setStepInProgress(false)
    }, [active])

    useEffect(() => {
        if(!memberId || !surveyStatus) return;
        if(surveyStatus.status === "COMPLETE") return setSurveySuccess(true);
        if(Number(surveyStatus.days_from_completion) > 365) return; // we don't need to pull partials at this point

        console.log('surveyStatus: ', surveyStatus)
        setLoading(true);
        getHraPartials(memberId)
        .then((data) => {
            if(data.status === 'Completed') {
                setSurveySuccess(true)
            }
            if(data.status === 'In Progress' && Number(surveyStatus.days_from_completion) < 365) {
                // update selected, pending, visited, active
                const selected = JSON.parse(data.current_answers);
                const pending = JSON.parse(data.pending_questions);
                const visited = JSON.parse(data.visited_questions);
                dispatch(receiveHraPartials({
                    selected,
                    pending,
                    visited,
                    active: visited[visited.length-1]
                }))
            }
        })
        setLoading(false);
        
    }, [memberId, surveyStatus])

    // send partials
    useEffect(() => {
        if(!memberId) return;
        const dbResponseData = {
            "memberId": memberId,
            "questionarePayload": JSON.stringify(data.list),
            "currentAnswers": JSON.stringify(selected),
            "pendingQuestions": JSON.stringify(pending),
            "visitedQuestions": JSON.stringify(visited),
            "status": "In Progress"
        }
        saveHraSurveyResponseToDB(dbResponseData)
    }, [active])

    const generateUserResposes = (data, selected, visited) => {
        let responses = [];

        visited.forEach(questionId => {
            const question_type = getQuestionById(data.list, questionId, visited, hraMemberInfo).question_type;
            // select
            if(question_type === SINGLE_SELECT) {
                const response = {
                    survey_question_num: questionId,
                    answers: []
                }
                const answer = {
                    ans_id: questionId + selected[questionId][0].answer_code,
                    is_select: question_type === SINGLE_SELECT ? true : false,
                    free_text: selected[questionId][0].answer_value || ""
                }
                response.answers.push(answer)
                responses.push(response)
            }
            // text
            if(question_type === FREE_TEXT) {
                const response = {
                    survey_question_num: questionId,
                    answers: []
                }
                const answer = {
                    ans_id: null,
                    is_select: question_type === SINGLE_SELECT ? true : false,
                    free_text: selected[questionId][0].value
                }
                response.answers.push(answer)
                responses.push(response)
            }
            // matrix
            if(question_type === MATRIX) {
                const response = {
                    survey_question_num: questionId,
                    answers: []
                }
                // loop through matrix questions and append user selections
                const matrix_questions = getQuestionById(data.list, questionId, visited, hraMemberInfo).matrix_questions;
                matrix_questions.forEach(question => {
                    const answer = {
                        ans_id: questionId + question.question_id,
                        ans_options: []
                    }

                    const answerIndexs = selected[questionId + '-' + question.question_id];
                    answerIndexs && answerIndexs.forEach(answerIndex => {
                        const option = {
                            ans_id: questionId + question.question_id + '-' + answerIndex.answer_code,
                            is_select: question.question_type === SINGLE_SELECT ? true: false,
                            free_text: (answerIndex.answer_value && answerIndex.answer_value) || ""
                        }
                        answer.ans_options.push(option)
                    })
                    response.answers.push(answer)
                })
                responses.push(response)
            }
            // select
            if(question_type === MULTY_SELECT) {
                const response = {
                    survey_question_num: questionId,
                    answers: []
                }
                selected[questionId].forEach(item => {
                    const answer = {
                        ans_id: questionId + item.answer_code,
                        is_select: question_type === SINGLE_SELECT ? true : false,
                        free_text: (item.answer_value && item.answer_value) || ""
                    }
                    response.answers.push(answer)
                })
                responses.push(response)
            }
        })

        return responses;
    }

    const formSubmit = (data, selected, visited) => {
        let response = {
            member_id: memberId,
            survey_id: null,
            survey_resp: generateUserResposes(data, selected, visited)
        }
        dispatch(requestSubmitHraSurvey(response))
        
        const dbResponseData = {
            "memberId": memberId,
            "questionareId": "01",
            "questionarePayload": JSON.stringify(data.list),
            "currentAnswers": JSON.stringify(selected),
            "pendingQuestions": JSON.stringify(pending),
            "visitedQuestions": JSON.stringify(visited),
            "status": "Completed"
        }
        saveHraSurveyResponseToDB(dbResponseData)
    }

    const getNextQuestion = () => {
        // reset visibility
        setVisible(false);
        // get next question
        setTimeout(() => {
            dispatch(requestNextQuestion({hraMemberInfo}))
        }, 300)
    }

    const validateSelection = () => {
        let isValid = true;

        // validate matrix
        const currentQuestion = getQuestionById(data.list, active, visited, hraMemberInfo);
        const { question_type, matrix_questions } = currentQuestion;
        if(question_type === MATRIX) {
            let allQuestionsSelected = true;
            for(let i = 0; i < matrix_questions.length; i++) {
                const item = matrix_questions[i];
                // if item is required but not marked
                if(!selected[active + '-' + item.question_id] || !selected[active + '-' + item.question_id].length) {
                    allQuestionsSelected = false;
                    setIsSelected(false);
                }
            }
            if(!allQuestionsSelected) isValid = false;
        }

        // validate text
        if(question_type === FREE_TEXT) {
            const selectionEmpty = (selected[active] === undefined) || (selected[active][0].value.trim().length === 0);
            if(selectionEmpty) isValid = false;
        }

        // validate select
        if(question_type === SINGLE_SELECT) {
            if(!selected[active]) isValid = false;
        }

        // validate checkbox
        if(question_type === MULTY_SELECT) {
            if(!selected[active] || selected[active].length === 0) isValid = false;
        }
        
        if(!isValid) setIsSelected(false);
        return isValid;
    }
    
    const handleNextQuestionBtn = () => {    
        const isValid = validateSelection()

        // check if the questions is the last one
        if(isValid) {
            // prevent double click
            if(stepInProgress) {
                return
            } else {
                setStepInProgress(true);
            }

            if(isLastQuestion()) {
                // handle submit and send form
                formSubmit(data, selected, visited)
                setSurveySuccess(true)
            } else {
                getNextQuestion();
            }
        }
    }

    const handlePreviousQuestionBtn = () => {
        // prevent double click
        if(stepInProgress) {
            return
        } else {
            setStepInProgress(true);
        }

        const getPreviousQuestion = () => {
            // reset visibility
            setVisible(false);
            // get previous question
            setTimeout(() => {
                dispatch(requestPreviousQuestion({hraMemberInfo}))
            }, 300)
        }

        getPreviousQuestion()
    }

    const isLastQuestion = () => {
        if(pending.length) return false;
        const currentQuestion = getQuestionById(data.list, active, visited, hraMemberInfo);
        switch (currentQuestion.question_type) {
            case MATRIX: {
                const matrixRootDeps = currentQuestion.question_answers[0].answer_dependencies.length
                if(matrixRootDeps > 0) return false
                let hasDeps = false;
                const questions = currentQuestion.matrix_questions;
                for(let i = 0; i < questions.length; i++) {
                    const question = questions[i];
                    const selectedItem = selected[currentQuestion.question_id + '-' + question.question_id];
                    if(selectedItem && selectedItem.length > 0) {
                        const answerDeps = getAnswerById(question.question_answers, selectedItem[0].id).answer_dependencies;
                        if(answerDeps.length !== 0) {
                            hasDeps = true
                            break;
                        }
                    }
                }
                return hasDeps ? false : true
            }
            case FREE_TEXT: {
                const depsLength = currentQuestion.question_answers[0] && currentQuestion.question_answers[0].answer_dependencies.length
                return depsLength === 0
            }
            case SINGLE_SELECT: {
                const selectedAnswerId = selected[active] && selected[active][0].id;
                const answer = getAnswerById(currentQuestion.question_answers, selectedAnswerId)
                const depsLength = answer ? answer.answer_dependencies.length : null
                return depsLength === 0
            }
            case MULTY_SELECT: {
                const selectedAnswersList = selected[active]
                const hasDeps = selectedAnswersList && selectedAnswersList.find(item => {
                    const answer = getAnswerById(currentQuestion.question_answers, item.id)
                    return answer.answer_dependencies && answer.answer_dependencies.length
                })
                return hasDeps ? false : true
            }
            default:
                return null
        }
    }

    return (
        <HRAWrapper>
            <Breadcrumbs>
                <BreadcrumsbLink href="/communityResources">My Health</BreadcrumsbLink>
                <ArrowIcon alt = "" src="/react/images/icn-arrow-right.svg" />
                <BreadcrumsbLink active>Annual Health Assessment</BreadcrumsbLink>
            </Breadcrumbs>
            <CardWrapper visible={visible}>
                { 
                    <Card>
                        {
                            (surveyStatus?.status === "COMPLETE" || surveySuccess) ? <SurveySuccess /> : 
                            (surveyStatus?.status === "NOT COMPLETE" && data.list.length > 0) ?
                            <>
                                <ProgressBar style={{ width: active === "q01" ? `0%` : `${100 / data.list.length * Number(active.slice(1))}%` }} />
                                <CardQuestion isSelected={isSelected} setIsSelected={setIsSelected} setVisible={setVisible} />
                                <Controls>
                                    <div>
                                        { active !== "q01" && <ChangeStepBtn previous onClick={() => handlePreviousQuestionBtn()}>Previous</ChangeStepBtn> }
                                    </div>
                                    <ChangeStepBtn onClick={() => handleNextQuestionBtn()}>{isLastQuestion() ? 'Submit' : 'Continue'}</ChangeStepBtn>
                                </Controls>
                            </> : null
                        }
                    </Card>
                }
            </CardWrapper>
        </HRAWrapper>
    )
}

const HRAWrapper = styled(MainContentContainer)`
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
`

const Breadcrumbs = styled.div`
    margin-left: 16px;
    display: flex;
    margin-bottom: 40px;

    @media only screen and (min-width: 1024px) {
        margin-left: 120px;
    }
`

const ArrowIcon = styled.img`
    margin-right: 5px;
    height: 17px;
    width: 17px;
`

const BreadcrumsbLink = styled.a`
    margin: 0 5px 0 0;
    font-size: 14px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: #474b55;
    font-weight: ${(props) => props.active ? 'bold' : 'normal'};
`

const CardWrapper = styled.div`
    display: flex;
    justify-content: center;

    transition: opacity 300ms ease-in-out;
    opacity: ${props => props.visible ? "1" : "0" };
`

const Card = styled.div`
    position: relative;
    background: #666;
    padding: 24px 32px 32px 32px;
    max-width: 432px;
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 #d8d8d8;
    background-color: #ffffff;
    width: 100%;
    overflow: hidden;
`

const ProgressBar = styled.div`
    position: absolute;
    height: 6px;
    width: 10%;
    background-image: linear-gradient(267deg, #008bbf 100%, #003863 5%);
    left: 0;
    top: 0; 
`

const Controls = styled.div`
    display: flex;
    justify-content: space-between;
`

const ChangeStepBtn = styled.button`
    margin: 40px 0 0 0;
    padding: 8px 16px;
    border: 1.1px solid #3e7128;
    border-radius: 4px;
    background-color: ${(props) => props.previous ? "#ffffff" : "#3e7128"};
    font-size: 18px;
    font-weight: ${(props) => props.previous ? "500" : "bold"};;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: -0.08px;
    text-align: center;
    color: ${(props) => props.previous ? "#3e7128" : "#ffffff"};
    cursor: pointer;
`
export default HRACard
