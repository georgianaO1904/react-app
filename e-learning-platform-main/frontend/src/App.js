import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home/Home";
import "antd/dist/antd.css";
import "slick-carousel/slick/slick.css";

import Login from "./components/body/auth/Login";
import Register from "./components/body/auth/Register";
import axios from "axios";
import {
  dispatchLogin,
  dispatchGetUser,
  fetchUser,
} from "./redux/actions/authAction";

import NotFound from "./components/utils/NotFound/NotFound";
import ResetPass from "./components/body/auth/ResetPassword";
import Coursepage from "./pages/Coursepage/Coursepage";
import "./pages/CourseFilter/CourseFilter.css";
import Profile from "./components/body/profile/Profile";
import EditUser from "./components/body/profile/EditUser";
import EditCourse from "./components/body/profile/EditCourse";
import CourseSeacrh from "./pages/CourseSearch/CourseSeacrh";
import LogoutPage from "./components/body/auth/LogoutPage";
function App() {
  //Get Acces token
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const auth = useSelector((state) => state.auth);
  const { isLogged, user, isAdmin } = auth;

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const getToken = async () => {
        // make post request : hey db get me some data and return it to me
        const res = await axios.post("/user/refresh_token", null);
        dispatch({ type: "GET_TOKEN", payload: res.data.access_token });
      };
      getToken();
    }
  }, [auth.isLogged, dispatch]);
  // when refresh the token exsit but the logged change to false that's we do that

  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin());
        //Get user infor
        return fetchUser(token).then((res) => {
          dispatch(dispatchGetUser(res));
        });
      };
      getUser();
    }
  }, [token, dispatch]);
  return (
    <>
      <div className="main">
        <Router>
          <>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/courses/:id" component={Coursepage} />
              <Route
                exact
                path="/login"
                component={isLogged ? NotFound : Login}
              />
              <Route
                exact
                path="/register"
                component={isLogged ? NotFound : Register}
              />
              <Route
                path="/user/reset/:token"
                component={isLogged ? NotFound : ResetPass}
                exact
              />
              <Route
                path="/profile"
                component={isLogged ? Profile : NotFound}
                exact
              />
              <Route
                path="/edit_user/:id"
                component={isAdmin ? EditUser : NotFound}
                exact
              />
              <Route
                path="/editcourse/:id"
                component={ EditCourse }
                exact
              />
              <Route path="/search/:keyword" component={CourseSeacrh} />
              <Route path="/logout_page"  component={LogoutPage}></Route>

              <Route component={NotFound} />
            </Switch>
          </>
        </Router>
      </div>
    </>
  );
}

export default App;
