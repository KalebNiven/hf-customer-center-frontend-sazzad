import React from "react";
import { useSelector } from "react-redux";
import InputCheckbox from "./inputCheckbox.js";
import { getQuestionById } from "../../utils/lookup";

const AnswerCheckbox = ({ isSelected, setIsSelected }) => {
  const {
    data,
    form: { active, visited },
  } = useSelector((state) => state.hra);
  const hraMemberInfo = useSelector((state) => state.hra.data.memberInfo);

  return (
    <div>
      {data &&
        getQuestionById(
          data.list,
          active,
          visited,
          hraMemberInfo
        ).question_answers.map((answer) => {
          const { id, answer_text, answer_code, answer_with_text } = answer;
          return (
            <InputCheckbox
              key={id}
              id={id}
              title={answer_text}
              code={answer_code}
              answer_with_text={answer_with_text}
              isSelected={isSelected}
              setIsSelected={setIsSelected}
            />
          );
        })}
    </div>
  );
};

export default AnswerCheckbox;
