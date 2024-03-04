import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { Button, message, Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  Getcoursedetails,
  UpdateCourse
} from "../../../redux/actions/courseActions";
import { useParams } from "react-router";
import {
  showSuccessMsg,
  showErrMsg,
} from "../../utils/notification/Notification";
import {
  COURSE_CREATE_RESET,
  COURSE_UPDATE_RESET
} from "../../../redux/constants/courseconstants";
import {
  DeleteOutlined,
  RetweetOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";

import "./editcourse.css";
import { produce } from "immer";
import { Tabs } from "antd";
import update from "immutability-helper";
const { TabPane } = Tabs;
const initialState = {
  name: "",
  user_name: "",
  description: "",
  image: "",
  user_headline: ""
};
const initialStateContent = {
  name: "",
  lectures: [{ link: "", name: " " }],
};
const EditCourse = ({ history }) => {
  const [image, setImage] = useState(false);
  const [content, setContent] = useState([initialStateContent]);

  const [data, setData] = useState(initialState);
  const { name, description } = data;

  const [editCourse, setEditCourse] = useState([]);

  const [loading, setLoading] = useState(false);
  const handleChange = async (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const [size, setSize] = useState("middle");

  const dispatch = useDispatch();
  const { id } = useParams();

  const courseUpdateReducer = useSelector((state) => state.courseUpdateReducer);
  const {
    loading: lodingUpdate,
    error: errorUpdate,
    success: succUpdate,
  } = courseUpdateReducer;
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const token = useSelector((state) => state.token);

  const [loadingImage, setLoadingImage] = useState(false);

  const ListMyCoursesReducer = useSelector(
    (state) => state.ListMyCoursesReducer
  );
  const { courses, loading: loadingMycrss } = useSelector(
    (state) => state.ListMyCoursesReducer
  );
  const GetCourseDetailsReducer = useSelector(
    (state) => state.GetCourseDetailsReducer
  );
  const { course, loading: loadingcrs } = useSelector(
    (state) => state.GetCourseDetailsReducer
  );

  const handleUpdate = () => {
    if (content.length === 0) {
      message.error("You must add some content to the course.");
    } else {
      dispatch(
        UpdateCourse({
          _id: id,
          name,
          image,
          description,
          content
        })
      );
    }
  };
  useEffect(() => {
    if (succUpdate) {
      dispatch({ type: COURSE_CREATE_RESET });
      dispatch({ type: COURSE_UPDATE_RESET });
      history.push("/profile");
    } else {
      if (!course/*.name || course._id !== id*/) {
        dispatch(Getcoursedetails(id));
      } else {
        setLoading(true);
        setEditCourse(course);
        setLoading(false);
        setContent(course.content);
        console.log(course.content);
      }
    }
  }, [id, history, succUpdate, course, dispatch]);
 
  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];

      if (!file)
        return setData({
          ...data,
          err: "No files were uploaded.",
          success: "",
        });

      if (file.size > 1024 * 1024)
        return setData({ ...data, err: "Size too large.", success: "" });

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return setData({
          ...data,
          err: "File format is incorrect.",
          success: "",
        });

      let formData = new FormData();
      formData.append("file", file);

      setLoadingImage(true);
      const res = await axios.post("/api/upload_crsimage", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });

      setLoadingImage(false);
      setImage(res.data.url);
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };
  const goback = () => {
    dispatch({ type: COURSE_CREATE_RESET });
    dispatch({ type: COURSE_UPDATE_RESET });
    history.push("/profile");
  };
  return (
    <>
      <Helmet>
        <title>EDIT COURSE</title>
      </Helmet>
      {succUpdate && showSuccessMsg(succUpdate)}
      {errorUpdate && showSuccessMsg(errorUpdate)}
      {loadingcrs ? (
        <div className="loading">
          <HashLoader color={"#1e1e2c"} loading={loadingcrs} size={40} />
        </div>
      ) : (
        <div className="edit-course-page">
          <div className="wrapper">
            <div>
              <div className="inner-wrapper">
                <div className="inner-wrapper-image">
                  <div className="btn-crs">
                    <Button
                      className="btn-back"
                      onClick={goback}
                      size={size}
                      type="primary"
                      shape="round"
                      icon={<ArrowLeftOutlined />}
                    >
                      Go Back
                    </Button>
                    <Popconfirm
                      title="Are you sure fiiled all fields?"
                      onConfirm={handleUpdate}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button shape="round" size="middle" type="primary">
                        Submit <RetweetOutlined />
                      </Button>
                    </Popconfirm>
                  </div>
                  {loadingImage && (
                    <div className="loading">
                      <HashLoader
                        color={"#1e1e2c"}
                        loading={loadingImage}
                        size={40}
                      />
                    </div>
                  )}

                  <h2>Edit Course</h2>
                  <div className={loadingImage ? "disable-avatar" : "avatar"}>
                    <img src={image ? image : editCourse.image} />
                    <span>
                      <i className="fas fa-camera"></i>
                      <p>Change</p>
                      <input
                        type="file"
                        name="file"
                        id="file_up"
                        onChange={changeAvatar}
                      />
                    </span>
                  </div>
                  <a>
                    {" "}
                    <p>
                      {" "}
                      *After choosing a picture, click update to apply the changes{" "}
                    </p>{" "}
                  </a>
                </div>
                <div className="inner-wrapper-form">
                  <div className="form-group-left">
                    <label>Name </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editCourse.name}
                      placeholder="Title"
                      onChange={handleChange}
                      required
                    />

                    <label>Description</label>
                    <textarea
                      name="description"
                      defaultValue={editCourse.description}
                      placeholder="Description"
                      onChange={handleChange}
                      required
                    >
                      {editCourse.description}
                    </textarea>
                  </div>
                  <div className="form-group-center">
                    <Tabs defaultActiveKey="1" centered>
                     
                      <TabPane tab="content" key="5">
                        <div className="form-group-right">
                          <Button
                            className="btn-add-item"
                            type="primary"
                            onClick={() => {
                              setContent((currentContent) => [
                                ...currentContent,
                                {
                                  name: "Section",
                                  lectures: [
                                    { link: "Link", name: "Lecture" },
                                  ],
                                },
                              ]);
                            }}
                          >
                            Add New Content
                          </Button>

                          <Tabs defaultActiveKey="1">
                            {content &&
                              content.map((cont, index) => (
                                <TabPane
                                  tab={`Content :${index + 1}`}
                                  key={index + 1}
                                >
                                  <div key={cont._id}>
                                    <h1>Title </h1>
                                    <Button
                                      className="btn-add-item"
                                      icon={<DeleteOutlined />}
                                      type="danger"
                                      onClick={() => {
                                        setContent((currentContent) =>
                                          currentContent.filter(
                                            (x) => x._id !== cont._id
                                          )
                                        );
                                      }}
                                    >
                                      Delete the Content
                                    </Button>
                                    <input
                                      placeholder="Name"
                                      defaultValue={cont.name}
                                      required
                                      onChange={(e) => {
                                        setContent((currentContent) =>
                                          produce(currentContent, (v) => {
                                            v[index].name = e.target.value;
                                          })
                                        );
                                      }}
                                    />
                               
                                    {cont.lectures.map((lect, indexlec) => (
                                      <div key={lect._id}>
                                        <h1>Content </h1>
                                        <input
                                          required
                                          placeholder="Name"
                                          defaultValue={lect.name}
                                          onChange={(e) => {
                                            setContent((currentContent) =>
                                              produce(currentContent, (v) => {
                                                v[index].lectures[
                                                  indexlec
                                                ].name = e.target.value;
                                              })
                                            );
                                          }}
                                        />
                                        <input
                                          required
                                          placeholder="Link"
                                          defaultValue={lect.link}
                                          onChange={(e) => {
                                            setContent((currentContent) =>
                                              produce(currentContent, (v) => {
                                                v[index].lectures[
                                                  indexlec
                                                ].link = e.target.value;
                                              })
                                            );
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </TabPane>
                              ))}
                          </Tabs>
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditCourse;
