export const getQuestionById = (dataList, id, visited, customerInfo) => {
  function transformQuestionIdString(questionIdString, accumulator) {
    const startsWithZero = questionIdString[1] === "0" ? true : false;
    const sliceCount = startsWithZero ? 2 : 1;
    const qusetionIdNum =
      Number(questionIdString.slice(sliceCount)) + accumulator;
    const transformedQuestionIdString = `q${
      qusetionIdNum < 10 ? 0 : ""
    }${qusetionIdNum}`;
    return transformedQuestionIdString;
  }

  function isNotValidQuestion(question) {
    let isNotValid = false;
    let { age, gender } = customerInfo;
    gender =
      gender === "F" || gender === "female"
        ? "female"
        : gender === "M" || gender === "male"
        ? "male"
        : "all";
    if (
      question.question_gender !== "all" &&
      question.question_gender !== gender
    )
      isNotValid = true;
    // INCLUSIVE age limits
    if (age > question.question_age_max) isNotValid = true;
    if (age < question.question_age_min) isNotValid = true;
    return isNotValid;
  }

  const allMatchedQuestions = dataList.filter((question) => {
    return question.question_id === id;
  });

  let validQuestion = allMatchedQuestions.find(
    (question) => isNotValidQuestion(question) === false
  );

  if (!validQuestion) {
    const nextQuestionId = transformQuestionIdString(id, 1);

    validQuestion = dataList.find((question) => {
      return question.question_id === nextQuestionId;
    });
  }

  if (isNotValidQuestion(validQuestion) === true) {
    validQuestion = getQuestionById(
      dataList,
      validQuestion.question_id,
      visited,
      customerInfo
    );
  }

  return validQuestion;
};

export const getAnswerById = (answers, id) => {
  return answers.find((asnwer) => {
    return asnwer.id === id;
  });
};
