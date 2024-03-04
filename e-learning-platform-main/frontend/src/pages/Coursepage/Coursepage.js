import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsCheck } from "react-icons/all";
import Collapsible from "./Collapsible";
import { YoutubePlayer } from "reactjs-media";
import { Helmet } from "react-helmet";

import { Empty } from "antd";
import { Skeleton, Input, Button, Rate } from "antd";
import "./Coursepage.css";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckStudent,
  Getcoursedetails,
  Enroll,
} from "../../redux/actions/courseActions";
import Error from "../../components/utils/Error";
import {
  showSuccessMsg,
  showErrMsg,
} from "../../components/utils/notification/Notification";

const Coursepage = ({ match, history }) => {
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const [show, setShow] = useState(0);
  const GetCourseDetailsReducer = useSelector(
    (state) => state.GetCourseDetailsReducer
  );
  const { loading, course, error } = GetCourseDetailsReducer;
  const [add, setAdd] = useState(false);
  const [disable, setDisable] = useState(false);
  const [enroll, setEnroll] = useState(false);
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const CheckStudentReducer = useSelector((state) => state.CheckStudentReducer);

  const {
    loading: loadingstudent,
    isStudent,
    error: errorstudent,
  } = CheckStudentReducer;

  const courseEnrollReducer = useSelector((state) => state.courseEnrollReducer);
  const {
      loading: loadingenrolled,
      enrolled,
      success,
  } = courseEnrollReducer;

  const onChangeBack = () => {
    if (window.scrollY >= 50) {
      setAdd(true);
    } else setAdd(false);
  };
  window.addEventListener("scroll", onChangeBack);

  const Disable = () => {
    if (window.scrollY >= 1600) {
      setDisable(true);
    } else setDisable(false);
  };

  useEffect(() => {
    dispatch(Getcoursedetails(match.params.id));
    if (isLogged) {
      dispatch(CheckStudent(match.params.id));
    }
    if (enroll) {
        setEnroll(false);
        dispatch(Enroll(match.params.id));
    }
    return () => {};
  }, [dispatch, match.params.id, isLogged, enroll]);
  window.addEventListener("scroll", Disable);
  const addToCartHandler = () => {
    setEnroll(true);
  };

  return (
    <>
      {loadingstudent || loading ? (
        <Skeleton active />
      ) : error || errorstudent ? (
        <Error error={error || errorstudent} />
      ) : (
        <div className="coursePage">
          <div>
            <div className="descriptionPart">
              <div className="descriptionPartText">
                <div>
                  <Helmet>
                    <title>{course.name}</title>
                  </Helmet>
                  <h1 className="courseNaame">{course.name}</h1>

                  <div className="informationCourse">
                    {!loading && !error && (
                      <p>
                        Created by {course.user.name}
                      </p>
                    )}
                    <div className="wish-share">
                    { !user.roles.includes("student") || user._id === course.user._id ? (<div></div>) : isStudent ?
                      (<button
                        className="buttonAlreadyEnrolled"
                      >
                        Already Enrolled
                      </button>) :
                      (<button
                        className="buttonsCourse"
                        onClick={addToCartHandler}
                      >
                        Enroll
                      </button>)
                      }
                      <button className="buttonsCourse">
                        <Link className="Link" to="/">
                          See other courses
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="windowToBuy">
                <img
                   src={course.image}
                   alt="course"
                   width={480}
                   height={250}
                 />
              </div>
            </div>
            <div>
              <div className="allAboutCourse">
                <div className="otherInformations">
                    <div className="contenuCours">
                      <h2>Course content</h2>

                      <div className="allCourseContent">
                        {course.content.map((section, index) => (
                          <Collapsible
                            isaccessable={isStudent}
                            section={section}
                          />
                        ))}

                        <div className="descriptionCourse">
                          <h2>Description</h2>
                          <p>{course.description}</p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="bottom-infos">
                <div className="formateur">
                  <div className="formateurName">
                    <h2>Instructor</h2>
                    <div style={{ display: "flex" }}>
                      <img
                        src={course.user.avatar}
                        id="avatar_insrtuctor"
                        alt="avatar"
                      />
                      <div className="name_job">
                        <b>{course.user.name}</b>
                        <p className="instructorProfession">
                          {course.user.headline}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p>{course.user.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Coursepage;
