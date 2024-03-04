import {
  LIST_COURSES_FAIL,
  LIST_COURSES_REQUEST,
  LIST_COURSES_SUCCESS,
  LIST_COURSE_DETAILS_FAIL,
  LIST_COURSE_DETAILS_REQUEST,
  LIST_COURSE_DETAILS_SUCCESS,
  MY_COURSES_FAIL,
  MY_COURSES_REQUEST,
  MY_COURSES_SUCCESS,
  COURSE_UPDATE_REQUEST,
  COURSE_UPDATE_SUCCESS,
  COURSE_UPDATE_FAIL,
  COURSE_DELETE_REQUEST,
  COURSE_DELETE_SUCCESS,
  COURSE_DELETE_FAIL,
  COURSE_CREATE_REQUEST,
  COURSE_CREATE_SUCCESS,
  COURSE_CREATE_FAIL,
  CHECK_STUDENT_REQUEST,
  CHECK_STUDENT_SUCCESS,
  CHECK_STUDENT_FAIL,
  LIST_COURSES_ENROLLED_REQUEST,
  LIST_COURSES_ENROLLED_SUCCESS,
  LIST_COURSES_ENROLLED_FAIL,
  LIST_COURSES_SEARCH_REQUEST,
  LIST_COURSES_SEARCH_SUCCESS,
  LIST_COURSES_SEARCH_FAIL,
  ALL_COURSES_REQUEST,
  ALL_COURSES_SUCCESS,
  ALL_COURSES_FAIL,
  COURSE_ENROLL_REQUEST,
  COURSE_ENROLL_SUCCESS,
  COURSE_ENROLL_FAIL,
} from "../constants/courseconstants";
import axios from "axios";

export const listMyCourses = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: MY_COURSES_REQUEST,
    });
    console.log("before token");

    const { token } = getState();
    console.log("after token");

    console.log(token);
    const config = {
      headers: {
        Authorization: token,
      },
    };

    const { data } = await axios.get(`/courses/Mycourses`, config);
    console.log(data);
    dispatch({
      type: MY_COURSES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: MY_COURSES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const listAllCourses = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ALL_COURSES_REQUEST,
    });
    console.log("before token");

    const { token } = getState();
    console.log("after token");

    console.log(token);
    const config = {
      headers: {
        Authorization: token,
      },
    };

    const { data } = await axios.get(`/courses/Allcourses`, config);
    console.log(data);
    dispatch({
      type: ALL_COURSES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("problem")
    console.log(error);
    dispatch({
      type: ALL_COURSES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listCoursesEnrolled = (page) => async (dispatch, getState) => {
  try {
    dispatch({
      type: LIST_COURSES_ENROLLED_REQUEST,
    });

    const { token } = getState();

    const config = {
      headers: {
        Authorization: token,
      },
    };

    const { data } = await axios.get(
      `/courses/Coursesenrolled?page=${page}`,
      config
    );
    dispatch({
      type: LIST_COURSES_ENROLLED_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LIST_COURSES_ENROLLED_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const CheckStudent = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CHECK_STUDENT_REQUEST,
    });
    const { token } = getState();

    const config = {
      headers: {
        Authorization: token,
      },
    };

    const { data } = await axios.get(
      `/courses/checkmembership?id=${id}`,
      config
    );
    dispatch({
      type: CHECK_STUDENT_SUCCESS,
      payload: data.isStudent,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: CHECK_STUDENT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const ListcoursesSearched = (keyword, page) => async (dispatch) => {
  try {
    dispatch({ type: LIST_COURSES_SEARCH_REQUEST });
    const { data } = await axios.get(
      `/courses/searched?keyword=${keyword}&page=${page}`
    );
    dispatch({ type: LIST_COURSES_SEARCH_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: LIST_COURSES_SEARCH_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const Getcoursedetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: LIST_COURSE_DETAILS_REQUEST });

    const { token } = getState();

    const config = {
      headers: {
        Authorization: token,
      },
    };

    const { data } = await axios.get(`/courses/details/${id}`, config);
    console.log(data);

    dispatch({ type: LIST_COURSE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: LIST_COURSE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const UpdateCourse = (course) => async (dispatch, getState) => {
  try {
    dispatch({ type: COURSE_UPDATE_REQUEST });

    const { token } = getState();
    console.log("token = " + token);

    const config = {
      headers: {
        Authorization: token,
      },
    };

    const { data } = await axios.put(
      `/courses/updatecourse/${course._id}`,
      course,
      config
    );

    dispatch({ type: COURSE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COURSE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const DeleteCourse = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: COURSE_DELETE_REQUEST });

    const { token } = getState();
    console.log("token = " + token);

    const config = {
      headers: {
        Authorization: token,
      },
    };

    const { data } = await axios.delete(`/courses/deletecourse/${id}`, config);

    dispatch({ type: COURSE_DELETE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COURSE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const CreateCourse = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: COURSE_CREATE_REQUEST,
    });
    
    const { token } = getState();

    console.log("token = " + token);

    const config = {
      headers: {
        Authorization: token,
      },
    };
    const { data } = await axios.post(`/courses/addcourse`, {}, config);
    dispatch({
      type: COURSE_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COURSE_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const Enroll = (course) => async (dispatch, getState) => {
  try {
    dispatch({ type: COURSE_ENROLL_REQUEST });

    const { token } = getState();
    console.log("token = " + token);

    const config = {
      headers: {
        Authorization: token,
      },
    };

    const emptyBody = {}

    const { data } = await axios.post(
      `/courses/enroll/${course}`,
      emptyBody,
      config
    )

    dispatch({ type: COURSE_ENROLL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COURSE_ENROLL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
