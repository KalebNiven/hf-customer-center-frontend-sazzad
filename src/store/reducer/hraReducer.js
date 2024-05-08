import * as actionTypes from "../actions/actionTypes";
import hraData from "../../data/hra-42-45.json";
import { getQuestionById, getAnswerById } from "../../utils/lookup";
import {
  SINGLE_SELECT,
  MULTY_SELECT,
  MATRIX,
  FREE_TEXT,
} from "../../constants/hra-types";

export const initialState = {
  data: {
    list: [],
    loading: false,
    memberInfo: {},
    error: "",
  },
  form: {
    active: "q01",
    selected: {},
    visited: [],
    pending: [],
  },
};

const handleNextQuestion = (state, hraMemberInfo) => {
  const currentQuestionId = state.form.visited[state.form.visited.length - 1];
  const currentQuestion = getQuestionById(
    state.data.list,
    currentQuestionId,
    state.form.visited,
    hraMemberInfo
  );
  const { question_type, matrix_questions, question_answers } = currentQuestion;
  const selected = state.form.selected;
  let pending;

  // select & checkbox
  if (question_type === SINGLE_SELECT) {
    const selectedAnswerId =
      selected[currentQuestionId] && selected[currentQuestionId][0].id;
    pending = [...state.form.pending];
    pending.unshift(
      ...getAnswerById(
        question_answers,
        selectedAnswerId
      ).answer_dependencies.map((item) => item.dependency_uuid.question_id)
    );
  }

  // checkbox
  if (question_type === MULTY_SELECT) {
    pending = [...state.form.pending];
    selected[currentQuestionId] &&
      selected[currentQuestionId].forEach((item) => {
        const currentQ = getQuestionById(
          state.data.list,
          currentQuestionId,
          state.form.visited,
          hraMemberInfo
        );
        const currentQdeps = getAnswerById(
          currentQ.question_answers,
          item.id
        ).answer_dependencies.reduce((items, item) => {
          if (
            !items.includes(item.dependency_uuid.question_id) &&
            !pending.includes(item.dependency_uuid.question_id)
          ) {
            items.push(item.dependency_uuid.question_id);
          }
          return items;
        }, []);
        pending.unshift(...currentQdeps);
      });
  }

  // matrix
  if (question_type === MATRIX) {
    pending = [...state.form.pending];
    // append currentQuestion deps
    pending.unshift(
      ...question_answers[0].answer_dependencies.map(
        (item) => item.dependency_uuid.question_id
      )
    );
    // loop through questions contained in the matrix and append their deps
    for (let i = 0; i < matrix_questions.length; i++) {
      const item = matrix_questions[i];
      const { question_answers, question_id } = item;
      const active = state.form.active;
      const matrixAnswerId = active + "-" + question_id;
      const selectedAnswerId =
        selected[matrixAnswerId] && selected[matrixAnswerId][0].id;
      pending.unshift(
        ...getAnswerById(
          question_answers,
          selectedAnswerId
        ).answer_dependencies.map((item) => item.dependency_uuid.question_id)
      );
    }
  }

  // text
  if (question_type === FREE_TEXT) {
    pending = [...state.form.pending];
    pending.unshift(
      ...question_answers[0].answer_dependencies.map(
        (item) => item.dependency_uuid.question_id
      )
    );
  }

  return pending;
};

const handlePreviousQuestion = (state, hraMemberInfo) => {
  // remove last visited
  const visited = [...state.form.visited];
  visited.pop();
  // remove previously added dependencies
  const activeId = visited[visited.length - 1];
  const currentQuestion = getQuestionById(
    state.data.list,
    activeId,
    state.form.visited,
    hraMemberInfo
  );
  const { question_type, matrix_questions, question_answers } = currentQuestion;
  const selectedAnswer = state.form.selected[activeId];
  const selected = state.form.selected;
  // if matrix or text - run throguh it's dependecies and remove it from pending
  let pending = [...state.form.pending];

  // select
  if (question_type === SINGLE_SELECT) {
    pending = pending.slice(
      getAnswerById(question_answers, selectedAnswer[0].id).answer_dependencies
        .length - 1
    );
  }

  if (question_type === MULTY_SELECT) {
    let deps = [];
    const selectedAnswers = state.form.selected[activeId];
    selectedAnswers.forEach((selected_answer) => {
      const answer = question_answers.find(
        (question_answer) => selected_answer.id === question_answer.id
      );
      deps = [...deps, ...answer.answer_dependencies];
    });
    // remove duplicates from deps
    deps = deps.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.dependency_uuid.question_id === item.dependency_uuid.question_id
        )
    );
    pending = pending.slice(deps.length - 1);
  }

  // matrix
  if (question_type === MATRIX) {
    let isFirst = true;
    // loop through questions contained in the matrix and remove their deps from our 'pending' queue
    for (let i = 0; i < matrix_questions.length; i++) {
      const item = matrix_questions[i];
      const { question_answers, question_id } = item;
      const selectedAnswerId =
        selected[activeId + "-" + question_id] &&
        selected[activeId + "-" + question_id][0].id;
      if (isFirst) {
        pending = pending.slice(
          getAnswerById(question_answers, selectedAnswerId).answer_dependencies
            .length - 1
        );
        isFirst = false;
      } else {
        pending = pending.slice(
          getAnswerById(question_answers, selectedAnswerId).answer_dependencies
            .length
        );
      }
    }
    // remove currentQuestion deps from 'pending' queue
    pending = pending.slice(question_answers[0].answer_dependencies.length);
  }

  // free_text
  if (question_type === FREE_TEXT) {
    // remove currentQuestion deps from 'pending' queue
    pending = pending.slice(question_answers[0].answer_dependencies.length - 1);
  }

  return { visited, active: activeId, pending };
};

const generageAnswerList = ({ id, info, type }, state) => {
  // handle checkbox
  if (
    (state.form.selected[id] && type === MULTY_SELECT) ||
    (state.form.selected[id] && type === FREE_TEXT)
  ) {
    // checkbox click
    if (type === MULTY_SELECT) {
      // uncheck (if it's already exist)
      if (
        state.form.selected[id].some(
          (item) => item.answer_code === info.answer_code
        )
      ) {
        return [
          ...state.form.selected[id].filter(
            (item) => item.answer_code !== info.answer_code
          ),
        ];
      } else {
        // check (if not exist)
        return [...state.form.selected[id], info];
      }
    }
    // checkbox text input
    if (type === FREE_TEXT) {
      const answers = [...state.form.selected[id]];
      answers.find((answer) => {
        if (answer.answer_code === info.answer_code) {
          answer.answer_value = info.answer_value;
        }
      });
      return answers;
    }
  }
  // handle everything else
  return [info];
};

export default function hra(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_NEXT_QUESTION: {
      const pending = handleNextQuestion(state, action.payload.hraMemberInfo);
      // pop first item in the 'pending' queue and assign it to 'active'
      let active = pending.shift();
      return {
        ...state,
        form: {
          ...state.form,
          active: active,
          pending: pending,
        },
      };
    }
    case actionTypes.REQUEST_PREVIOUS_QUESTION: {
      const { visited, active, pending } = handlePreviousQuestion(
        state,
        action.payload.hraMemberInfo
      );
      return {
        ...state,
        form: {
          ...state.form,
          visited: visited,
          active: active,
          pending: pending,
        },
      };
    }
    case actionTypes.SET_ANSWER_SELECTION: {
      // handling everything, but not MULTY_SELECT
      const { id } = action.payload;
      return {
        ...state,
        form: {
          ...state.form,
          selected: {
            ...state.form.selected,
            [id]: generageAnswerList(action.payload, state),
          },
        },
      };
    }
    case actionTypes.SET_VISITED_QUESTION: {
      let currentQuestion = getQuestionById(
        state.data.list,
        state.form.active,
        state.form.visited,
        action.payload.userInfo
      );
      const visitedQuestion = [currentQuestion.question_id];

      return {
        ...state,
        form: {
          ...state.form,
          visited: [...state.form.visited, ...visitedQuestion],
          active: currentQuestion.question_id,
        },
      };
    }
    case actionTypes.REQUEST_HRA_QUESTIONS: {
      return {
        ...state,
        data: {
          ...state.data,
          list: [],
          memberInfo: {},
        },
      };
    }
    case actionTypes.RECEIVE_HRA_QUESTIONS: {
      return {
        ...state,
        data: {
          ...state.data,
          // list: action.payload,
          list: action.payload.hra_survey_questions.sort((a, b) =>
            a.question_id > b.question_id ? 1 : -1
          ),
          memberInfo: { ...action.payload.memberInfo },
          error: "",
        },
      };
    }
    case actionTypes.ERROR_HRA_QUESTIONS: {
      return {
        ...state,
        data: {
          ...state.data,
          list: [],
          memberInfo: {},
          error: action.payload,
        },
      };
    }
    case actionTypes.RECEIVE_HRA_PARTIALS: {
      return {
        ...state,
        form: {
          ...state.form,
          visited: action.payload.visited,
          selected: action.payload.selected,
          pending: action.payload.pending,
          active: action.payload.active,
        },
      };
    }
    default:
      return state;
  }
}
