import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "../../Navbar/Navbar";
import bye from "../auth/img/bye1.png";

import "../auth/auth.css";
const LogoutPage = () =>
{
    return (
        <>
          <Helmet>
            <title>Logout</title>
          </Helmet>
          <Navbar />
          <div className="container_logout">
            <img
              src={bye}
              alt="Logo"
              className="logo_header"
            />
          </div>
        </>
      );
    };
    
    export default LogoutPage;