import React from 'react'
import {Link } from 'react-router-dom'
const Coursesblock = ({course}) => {
    console.log(course)
    return (
     
        <Link to = {`/courses/${course._id}`}><div className="coursesToBuy" >
                              <div className="coursesPhoto">
                              <img alt="course" src={course.image} className="coursesPhoto1"/>
                              </div>
                              <div className="coursesInformation">

                             
                    
                              <b className="courseTitle">{course.name}</b><br></br>
                              <b className="courseOwner">{course.user.name}</b>
                                  
                              </div>

                              
                          </div></Link>
       
    )
}

export default Coursesblock
