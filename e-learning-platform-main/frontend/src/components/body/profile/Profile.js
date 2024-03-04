import React, { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";

import { useSelector, useDispatch } from "react-redux";
import { isMatch, isLength } from "../../utils/validation/Validation";
import Coursesblock from "../../../pages/CourseFilter/Coursesblock";
import Navbar from "../../Navbar/Navbar";
import { Helmet } from "react-helmet";
import { Radio, Row } from "antd";
import { Popconfirm, message } from "antd";

import {
  showSuccessMsg,
  showErrMsg,
} from "../../utils/notification/Notification";
// Importing toastify module
import {toast} from 'react-toastify';
 
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';

import {
  fetchAllUsers,
  dispatchGetAllUsers,
  dispatchGetAllUsersRequest,
} from "../../../redux/actions/usersAction";
import {
  listAllRoles,
} from "../../../redux/actions/rolesAction";

import axios from "axios";
import HashLoader from "react-spinners/HashLoader";

import "./profile.css";
import { Table, Button, Input, Empty, Pagination, Skeleton } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  RetweetOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";

import {
  listMyCourses,
  DeleteCourse,
  CreateCourse,
  listCoursesEnrolled,
  listAllCourses,
} from "../../../redux/actions/courseActions";
import { Link } from "react-router-dom";
import Error from "../../utils/Error";
import { config } from "@fortawesome/fontawesome-svg-core";
import index from "reactjs-media";
import Item from "antd/lib/list/Item";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
const { Column } = Table;
const Profile = ({ history }) => {
  const [Radiogrp, setRadiogrp] = useState("Users");
  const [page, setpage] = useState(1);
  const [size, setSize] = useState("small");

  const [permissions, setPermissions] = useState(['add-course', 'update-course', 'see-all-courses', 'see-course', 'delete-course', 'enroll-course',
  'see-all-users', 'delete-user', 'update-user']);
  const [newRole, setNewRole] = useState('');
  const [selectedPerm, setSelectedPerm] = useState("");
  const [allRoles, setAllRoles] =  useState([]);
  const [popUp, setPopUp] = useState(false);
  const [idCrt, setIdCrt] = useState("");
  const [new_roles, setNewRoleUser] = useState("");
 
  toast.configure()


  const initialState = {
    name: "",
    email: "",
    description: "",
    headline: "",
    password: "",
    cf_password: "",
  };
  const [avatar, setAvatar] = useState(false);
  const [data, setData] = useState(initialState);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const ListAllCoursesReducer = useSelector(
    (state) => state.ListAllCoursesReducer
  );
  const {
    loading: loadingAdmin,
    courses: coursesAdmin,
    error: errorAdmin,
  } = ListAllCoursesReducer;

  const getAllRoles = () => {
    listAllRoles(token, allRoles).then((res) => {
      for( let index = 0; index < res.data.length; index++)
      {
         allRoles.push(res.data[index].role);
      }
         console.log(allRoles);
       });
  }

   const handleRadioChange = (e) => {
    setRadiogrp(e.target.value);
    switch (e.target.value) {
      case "Users":
        dispatch(dispatchGetAllUsersRequest());
        fetchAllUsers(token).then((res) => {
          dispatch(dispatchGetAllUsers(res));
        });
        break;
      case "Courses":
        dispatch(listAllCourses());
        break;
      default:
        break;
    }
  };

  const {
    name,
    email,
    password,
    cf_password,
    err,
    success,
    description,
    headline,
  } = data;
  const token = useSelector((state) => state.token);
  const auth = useSelector((state) => state.auth);
  const usersInfo = useSelector((state) => state.usersInfo);
  const { loadingtab, users } = usersInfo;
  const [callback, setCallback] = useState(false);
  
  const ListMyCoursesReducer = useSelector(
    (state) => state.ListMyCoursesReducer
  );
  const { loading, courses, error } = ListMyCoursesReducer;
  const courseDeleteReducer = useSelector((state) => state.courseDeleteReducer);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: succDelete,
  } = courseDeleteReducer;

  const courseCreateReducer = useSelector((state) => state.courseCreateReducer);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    course: createdcourse,
  } = courseCreateReducer;

  const listCoursesEnrolledReducer = useSelector(
    (state) => state.listCoursesEnrolledReducer
  );
  const {
    loading: loadingstudent,
    courses: coursesstudent,
    totalcourses,
    error: errorstudent,
  } = listCoursesEnrolledReducer;
  const { isLogged, user, isAdmin } = auth;
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAdmin) {
      getAllRoles();
      dispatch(dispatchGetAllUsersRequest());
      fetchAllUsers(token).then((res) => {
        dispatch(dispatchGetAllUsers(res));
      });
      dispatch(listAllCourses());
    }
    if (successCreate) {
      history.push(`/editcourse/${createdcourse._id}`);
    }
    if (user.roles.includes("teacher")) {
      dispatch(listMyCourses());
    }
    if (user.roles.includes("student")) {
      dispatch(listCoursesEnrolled(page));
    }
   
  }, [
    token,
    auth,
    history,
    dispatch,
    successCreate,
    callback,
    user.roles.includes("teacher"),
    succDelete,
    page,
  ]);

  /* user fun */
  const handleChange = async (e) => {
    setData({ ...data, [e.target.name]: e.target.value, err: "", success: "" });
  };
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

      setLoadingUsers(true);
      const res = await axios.post("/api/upload_avatar", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });

      setLoadingUsers(false);
      setAvatar(res.data.url);
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updateInfor = () => {
    try {
      axios.put(
        "/user/update",
        {
          name: name,
          avatar: avatar,
          description: description,
          headline: headline,
        },
        {
          headers: { Authorization: token },
        }
      );
      setData({ ...data, err: "", success: "Update success !" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };
  
  const updatePassword = () => {
    if (isLength(password))
      return setData({
        ...data,
        err: "Password must be at least 6 characters.",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setData({ ...data, err: "Password did not match", success: "" });

    try {
      axios.post(
        "/user/reset",
        { password },
        {
          headers: { Authorization: token },
        }
      );
      setData({ ...data, err: "", success: "Updated Success!" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };
  const handleUpdate = () => {
    updateInfor();
    if (password) updatePassword();
  };
  const handleDelete = async (id) => {
    console.log(id)
    try {
      if (user._id !== id) {
        setLoadingUsers(true);
        await axios.delete(`/user/delete/${id}`, {
          headers: { Authorization: token },
        });
        setLoadingUsers(false);
        setCallback(!callback);
        message.success("Account deleted");
      }
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  

  const handleDeleteCrs = (id) => {
    dispatch(DeleteCourse(id));
    message.success("Course Deleted");
  };

  

  const createCoursehandler = () => {
    dispatch(CreateCourse());
  };

  const handleSelectPermission = (eventPerm) => {
    console.log(eventPerm);
    setSelectedPerm(eventPerm);
    console.log("selected perm:");
    console.log(selectedPerm);
  }

  const handleSelectRole = (eventRole) => {
    console.log(eventRole);
    setNewRoleUser(eventRole);
    console.log(new_roles)
    
  }

  const onRoleChangeHandler = (event) => {
    setNewRole(event.target.value);
    console.log(event.target.value);
  }

  const onSubmitNewRole = async () => {
                     
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const result = await axios.post(`/roles/add_role`, { 'role': newRole, 'permissions': selectedPerm}, config);

      if(result.data != null) {
        toast("Role added successfully", {position: toast.POSITION.TOP_CENTER})
      } else {
        toast("Something went wrong, please try again", {position: toast.POSITION.TOP_CENTER})
      }
  }
  


  const handleClickOpen = (id) => {
    setPopUp(true);
    setIdCrt(id);
  };

  const handleClose = () => {
    setPopUp(false);
  };

  const handleSubmitNewFoleForUser = async (id) => {
    
    const config = {
      headers: {
        Authorization: token,
      },
    };
    
    const result = await axios.put(`/user/update_roles/${id}`,  {new_roles} , config)
  
    if(result.data != null) {
        toast("Role added successfully for user", {position: toast.POSITION.TOP_CENTER})
      } else {
        toast("Something went wrong, please try again", {position: toast.POSITION.TOP_CENTER})
      }
  
}

  const radioState = user.roles.includes("teacher") ? "Added" : "Enrolled";
  const [RadioCoursegrp, setRadioCoursegrp] = useState(radioState);

  
  const handleRadioCoursesChange = (e) => {
    setRadioCoursegrp(e.target.value);
  };

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <Navbar />
      <div>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
      </div>
      <div className="profile-page">
        <div className="col-left">
          <h2>
            {isAdmin
              ? "Admin's Profile"
              : !user.roles.includes("teacher")
              ? "User's Profile"
              : user.roles.includes("teacher") && "Teacher's Profile"}
          </h2>
          {loadingUsers && (
            <div className="loading">
              <HashLoader color={"#1e1e2c"} loading={loadingUsers} size={40} />
            </div>
          )}
          <div className={loadingUsers ? "disable-avatar" : "avatar"}>
            <img alt="profile_pic" src={avatar ? avatar : user.avatar} />
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
          <div>
            <em style={{ color: "crimson" }}>
              *Choose picture then click update to apply the change
            </em>
          </div>

          <label>Name </label>
          <input
            type="text"
            name="name"
            defaultValue={user.name}
            placeholder="Your name"
            onChange={handleChange}
          />

          <label>Email </label>
          <Input
            type="text"
            name="email"
            value={user.email}
            placeholder="Your email address"
            disabled
          />
          {user.roles.includes("teacher") && (
            <div className="textarea">
              <label>Description </label>
              <textarea
                name="description"
                placeholder="Your Desc"
                onChange={handleChange}
                required
              >
                {user.description}
              </textarea>
              <label>Headline </label>
              <input
                type="text"
                name="headline"
                defaultValue={user.headline}
                placeholder="Your headline"
                onChange={handleChange}
              />
            </div>
          )}
          <div className="form-group">
            <label>New Password </label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Your password"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password </label>
            <input
              type="password"
              name="cf_password"
              value={cf_password}
              placeholder="Confirm password"
              onChange={handleChange}
            />
          </div>
          <>
            <Button
              className="btn-update-profile"
              disabled={loadingUsers}
              shape="round"
              onClick={handleUpdate}
              size="middle"
              type="primary"
            >
              Update <RetweetOutlined />
            </Button>
          </>
        </div>
        <div className="col-right">
            {isAdmin ? (
            <h2>
              <Radio.Group value={Radiogrp} onChange={handleRadioChange}>
                <Radio.Button value="Users">Users</Radio.Button>
                <Radio.Button value="Roles">Roles</Radio.Button>
              </Radio.Group>
            </h2>
            ) : (
              <h2>
              <p>My Courses</p>
              <Radio.Group value={RadioCoursegrp} onChange={handleRadioCoursesChange}>
                {user.roles.includes("teacher") ? (<Radio.Button value="Added">Added</Radio.Button>) : (<div></div>)}
                {user.roles.includes("student") ? (<Radio.Button value="Enrolled">Enrolled</Radio.Button>) : (<div></div>)}
              </Radio.Group>
              </h2>
            )}
          {loadingtab || loadingAdmin ? (
            <Skeleton active />
          ) : isAdmin ? (
            Radiogrp === "Users" ? (
              <Table dataSource={users}>
                <Column title="Id" dataIndex="_id" key="_id" />
                <Column title="Name" dataIndex="name" />
                <Column title="Email" dataIndex="email" />
                {/* <Column
                  title="Admin"
                  dataIndex="role"
                  key="role"
                  render={(role) => (
                    <span>
                      {role === 1 ? (
                        <div className="admin">YES</div>
                      ) : (
                        <div className="notadmin">NO</div>
                      )}
                    </span>
                  )}
                /> */}
                <Column title="Roles" dataIndex="roles" key="roles"
                    render={(roles) => (
                      <span>
                        <div>
                        {roles.map(role=> <p>{role}</p>)}
                        </div>
                      </span>
                      )}
                  />
                  
                <Column
                  title="Action"
                  dataIndex="_id"
                  key="_id"
                  render={(_id) => (
                    <span>
                        <Button
                          className="btn-edit"
                          type="primary"
                          shape="round"
                          icon={<EditOutlined />}
                          size={size}
                          key="_id"
                          onClick={ () => {handleClickOpen(_id)
                          console.log("handleClickOpen "+_id)}}
                        >
                          edit
                        </Button>
                        
                        <Dialog open={popUp} onClose={handleClose} maxWidth="xl">
                          <DialogTitle>Add role</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Please select from the list below
                            </DialogContentText>
                            <Multiselect
                            isObject={false}
                            options={allRoles}
                            onRemove={(event) => {
                              handleSelectRole(event)
                            }}
                            onSelect = { (event) => {
                              handleSelectRole(event)
                        
                    } }
                      // showCheckbox
                      />
                          </DialogContent>
                          <DialogActions>
                            <Button
                                className="btn-update-profile"
                                shape="round"
                                type="primary"
                                size="small"
                                onClick={ () => handleSubmitNewFoleForUser(idCrt)}>
                                Add Role
                              </Button>  
                              <Button className="btn-update-profile"
                                type="primary"
                                shape="round"
                                size="small"
                                onClick={handleClose}>
                                  Cancel
                            </Button>
                          </DialogActions>
                        </Dialog>

                      <Button
                        className="btn-delete"
                        type="danger"
                        shape="round"
                        icon={<DeleteOutlined />}
                        size={size}
                      >
                        <Popconfirm
                          title="Are you sure to delete this user?"
                          onConfirm={() => handleDelete(_id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          delete
                        </Popconfirm>
                      </Button>
                    </span>
                  )}
                />
              </Table>
            ) : (Radiogrp === "Roles" && (
              <div className="roles">
                <h1>Existing Roles</h1>
                <div className="existing_roles"> 
                
                {allRoles.map(role=> <p>{role}</p>)}
              
                </div>
                <div className="new_role"> 
                  <h1>Add a new role</h1>
                  <div className="form_add_role">
                  <form >
                      <input
                      type="text"
                      name="newRole"
                     onChange={onRoleChangeHandler}
                      placeholder="Role"
                    />
                      <Multiselect
                      isObject={false}
                      options={permissions}
                      onRemove={(event) => {
                        handleSelectPermission(event)
                      }}
                      onSelect = { (event) => {
                        handleSelectPermission(event)
                        
                    } }
                      // showCheckbox
                      />
                   
                     <Button
                      className="btn-update-profile"
                      disabled={loadingUsers}
                      shape="round"
                      size="medium"
                      type="primary"
                      onClick={ onSubmitNewRole}>
                      Add 
                    </Button>   
                    
                  </form> 
                  </div>
                </div>
              
              </div>
            )
            )
          ) : loading ? (
            <Skeleton active />
          ) : error ? (
            <Error error={error} />
          ) : user.roles.includes("teacher") && RadioCoursegrp === "Added" ? (
            <>
              {loadingDelete || loadingCreate ? (
                <div className="loading">
                  <HashLoader
                    color={"#1e1e2c"}
                    loading={loadingDelete || loadingCreate}
                    size={40}
                  />
                </div>
              ) : error || errorDelete || errorCreate ? (
                <h1>{error || errorDelete || errorCreate}</h1>
              ) : (
                <>
                  <div className="btn-add">
                    <Button
                      className="btn-update-profile"
                      onClick={createCoursehandler}
                      type="primary"
                      shape="round"
                      icon={<FolderAddOutlined />}
                      size="large"
                    >
                      CREATE NEW COURSE
                    </Button>
                  </div>
                  <Table dataSource={courses}>
                    <Column title="Name" dataIndex="name" key="_id" />
                    <Column title="Description" dataIndex="description" key="_id" />
                    <Column
                      title="Update"
                      dataIndex="_id"
                      key="_id"
                      render={(_id) => (
                        <span>
                          <Link to={`/editcourse/${_id}`}>
                            <Button
                              className="btn-edit"
                              type="primary"
                              shape="round"
                              icon={<EditOutlined />}
                              size="small"
                            >
                              EDIT
                            </Button>
                          </Link>
                          <Button
                            className="btn-delete"
                            type="danger"
                            shape="round"
                            icon={<DeleteOutlined />}
                            size={size}
                          >
                            <Popconfirm
                              title="Are you sure to delete this Course?"
                              onConfirm={() => handleDeleteCrs(_id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              DELETE
                            </Popconfirm>
                          </Button>
                        </span>
                      )}
                    />
                  </Table>
                </>
              )}
            </>
          ) : RadioCoursegrp === "Enrolled" ? loadingstudent ? (
            <Skeleton />
          ) : errorstudent ? (
            <Error error={errorstudent} />
          ) : coursesstudent.length === 0 ? (
            <Empty />
          ) : (
            <>
              {coursesstudent.map((course, index) => (
                <Coursesblock
                  key={course._id}
                  data-index={index}
                  course={course}
                />
              ))}
              <Pagination
                pageSize="6"
                current={page}
                onChange={(current) => setpage(current)}
                total={totalcourses}
              />
            </>
          ) : (<></>)}
        </div>
      </div>
    </>
  );
};

export default Profile;
