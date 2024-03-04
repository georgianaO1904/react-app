import { Card } from "antd";
import React, { useEffect, useRef } from "react";
import { Empty } from "antd";
import { Helmet } from "react-helmet";
import axios from "axios";
import Slider from "react-slick";
import { Skeleton } from "antd";
import "./Home.css";
import CourseCard from "../../components/CourseCard/CourseCard";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import {
  dispatchLogin,
  dispatchGetUser,
  fetchUser,
} from "../../redux/actions/authAction";
import { listAllCourses } from "../../redux/actions/courseActions";
import Error from "../../components/utils/Error";
import bye from "../../components/body/auth/img/bye1.png";

const Home = () => {
  const dispatch = useDispatch();
  const ListAllCoursesReducer = useSelector((state) => state.ListAllCoursesReducer);
  const { loading, courses, error } = ListAllCoursesReducer;

  const token = useSelector((state) => state.token);
  const auth = useSelector((state) => state.auth);
  
  var settings = {
    dots: false,
    infinite: true,
    // speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };
  
  useEffect(() => {
    const getToken = async () => {
      const res = await axios.post("/user/refresh_token", null);
      dispatch({
        type: "GET_TOKEN",
        payload: res.data.access_token,
      });
    };
    getToken();
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin());
        // Get user information
        return fetchUser(token).then((res) => {
          dispatch(dispatchGetUser(res));
        });
      };
      getUser();
    }
    // Get all courses
    dispatch(listAllCourses());
  }, [auth.isLogged, token, dispatch]);

  return (
    <div>
      <Helmet>
        <title>E-learning Platform</title>
      </Helmet>

      <Navbar />
      <section className="All_Courses" >
        <h2>All Courses </h2>
        {auth.isLogged ? 
        (
        <div className="coursecards">
          {loading ? (
            <Skeleton />
          ) : error ? (
            <Error error={error} />
          ) : courses.length === 0 ? (
            <Empty />
          ) : (
            <Slider {...settings}>
              {courses.map((course, index) => (
                <>
                  <CourseCard
                    key={course._id}
                    data-index={index}
                    course={course}
                  />
                </>
              ))}
            </Slider>
          )}
        </div>
        ) : 
        (
        <div className="container_logout">
            <img
              src={bye}
              alt="Logo"
              className="logo_header"
            />
          </div>
        )
        }
      </section>
    </div>
  );
};

export default Home;
