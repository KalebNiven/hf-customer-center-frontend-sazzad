import React from "react";
import { useSelector } from "react-redux";
import InputRadio from "./inputRadio.js";
import InputCheckbox from "./inputCheckbox.js";
import styled from "styled-components";
import { Warning } from "./styles";
import { getQuestionById } from "../../utils/lookup";
import { SINGLE_SELECT, MULTY_SELECT } from "../../constants/hra-types";

const AnswerMatrix = ({ isSelected, setIsSelected }) => {
  const {
    data,
    form: { active, selected, visited },
  } = useSelector((state) => state.hra);
  const hraMemberInfo = useSelector((state) => state.hra.data.memberInfo);

  const selectionIsMissing = (id) => {
    if (selected[active + "-" + id] && !selected[active + "-" + id].length)
      return true;
    if (!selected[active + "-" + id]) return true;
  };

  return (
    <div>
      {data &&
        getQuestionById(
          data.list,
          active,
          visited,
          hraMemberInfo
        ).matrix_questions.map((question) => {
          const {
            question_type,
            question_id,
            question_answers,
            question_text,
          } = question;
          return (
            <AnswerWrapper key={question_id}>
              <Title>{question_text}</Title>
              <AnswerBody type={question_type}>
                {question_answers.map((answer) => {
                  const {
                    id,
                    answer_text,
                    answer_code,
                    answer_with_text,
                  } = answer;
                  const uid = question_id + answer_code;
                  switch (question_type) {
                    case SINGLE_SELECT:
                      return (
                        <InputRadio
                          key={id}
                          id={id}
                          title={answer_text}
                          code={answer_code}
                          depId={active + "-" + question_id}
                          warning={
                            isSelected === false &&
                            selectionIsMissing(question_id)
                          }
                          setIsSelected={setIsSelected}
                          answer_with_text={answer_with_text}
                        />
                      );
                    case MULTY_SELECT:
                      return (
                        <InputCheckbox
                          key={id}
                          id={id}
                          title={answer_text}
                          code={answer_code}
                          depId={active + "-" + question_id}
                          uid={uid}
                          warning={
                            isSelected === false &&
                            selectionIsMissing(question_id)
                          }
                          setIsSelected={setIsSelected}
                          answer_with_text={answer_with_text}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </AnswerBody>
              {isSelected === false && selectionIsMissing(question_id) && (
                <Warning>A selection is required.</Warning>
              )}
            </AnswerWrapper>
          );
        })}
    </div>
  );
};

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #003863;
`;

const AnswerWrapper = styled.div`
  margin-bottom: 14px;
`;

const AnswerBody = styled.div`
  display: ${(props) => props.type === "input" && "flex"};
`;

export default AnswerMatrix;
