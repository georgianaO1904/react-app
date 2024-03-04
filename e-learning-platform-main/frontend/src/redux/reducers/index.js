import { combineReducers } from "redux";
import auth from "./authReducer";
import token from "./tokenReducer";
import {
  ListMyCoursesReducer,
  ListCoursesReducer,
  ListAllCoursesReducer,
  GetCourseDetailsReducer,
  courseUpdateReducer,
  courseCreateReducer,
  courseDeleteReducer,
  CheckStudentReducer,
  listCoursesEnrolledReducer,
  listCourseSearchedreducer,
  courseEnrollReducer,
} from "./courseReducer";
import usersInfo from "./usersInfoReducer";
export default combineReducers({
  auth,
  token,
  ListMyCoursesReducer,
  ListCoursesReducer,
  ListAllCoursesReducer,
  GetCourseDetailsReducer,
  usersInfo,
  courseEnrollReducer,
  courseUpdateReducer,
  courseCreateReducer,
  courseDeleteReducer,
  CheckStudentReducer,
  listCoursesEnrolledReducer,
  listCourseSearchedreducer,
});
