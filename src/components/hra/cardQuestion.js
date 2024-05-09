import React, { useEffect } from "react";
import styled from "styled-components";
import AnswerRadio from "./answerRadio";
import AnswerInput from "./answerInput";
import AnswerMatrix from "./answerMatrix";
import AnswerCheckbox from "./answerCheckbox";
import { useSelector, useDispatch } from "react-redux";
import { setVisitedQuestion } from "../../store/actions";
import { Warning } from "./styles";
import { getQuestionById } from "../../utils/lookup";
import {
  SINGLE_SELECT,
  MULTY_SELECT,
  MATRIX,
  FREE_TEXT,
} from "../../constants/hra-types";

const CardQuestion = ({ isSelected, setIsSelected, setVisible }) => {
  const dispatch = useDispatch();
  const {
    data,
    form: { visited, active },
  } = useSelector((state) => state.hra);
  const hraMemberInfo = useSelector((state) => state.hra.data.memberInfo);

  useEffect(() => {
    // mark question as visited by pushing it into visited array
    if (!visited.includes(active)) {
      dispatch(
        setVisitedQuestion(
          getQuestionById(data.list, active, visited, hraMemberInfo),
          hraMemberInfo,
        ),
      );
    }
    setVisible(true);
  }, [active]);

  const generageAnswers = () => {
    switch (
      getQuestionById(data.list, active, visited, hraMemberInfo).question_type
    ) {
      case SINGLE_SELECT:
        return (
          <AnswerRadio isSelected={isSelected} setIsSelected={setIsSelected} />
        );
      case MATRIX:
        return (
          <AnswerMatrix isSelected={isSelected} setIsSelected={setIsSelected} />
        );
      case FREE_TEXT:
        return (
          <AnswerInput isSelected={isSelected} setIsSelected={setIsSelected} />
        );
      case MULTY_SELECT:
        return (
          <AnswerCheckbox
            isSelected={isSelected}
            setIsSelected={setIsSelected}
          />
        );
      default:
        return null;
    }
  };

  const currentQuestion = getQuestionById(
    data.list,
    active,
    visited,
    hraMemberInfo,
  );

  return (
    <div>
      <Question>
        {
          getQuestionById(data.list, active, visited, hraMemberInfo)
            .question_text
        }
      </Question>
      {generageAnswers()}
      {isSelected === false && currentQuestion.question_type !== MATRIX && (
        <Warning>
          {currentQuestion.question_type === FREE_TEXT
            ? "An input"
            : "A selection"}{" "}
          is required.
        </Warning>
      )}
    </div>
  );
};

const Question = styled.h3`
  margin: 8px 4px 16px 0;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
`;

export default CardQuestion;
