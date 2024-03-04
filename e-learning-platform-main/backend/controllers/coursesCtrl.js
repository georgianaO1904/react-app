const Courses = require("../models/CourseModel");
const Users = require("../models/userModel");
const User = require("../models/userModel");

const coursesCtrl = {
  getMycourses: async (req, res) => {
    try {
      const courses = await Courses.find({ user: req.user.id });
      res.json(courses);
    } catch (err) {
      console.log("-----------mycourse error-------------");

      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllcourses: async (req, res) => {
    try {
      const courses = await Courses.find({}).populate({ path: "user", model: "Users" });
      res.json(courses);
    } catch (err) {
      console.log("-----------All course error-------------");

      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
  getcoursesenrolled: async (req, res) => {
    try {
      console.log("Find courses enrolled")
      const numcourses = 5;
      const page = Number(req.query.page) || 1;
      const coursesenrolled = await Courses.find({ students: req.user.id }).populate({ path:"user", model: "Users" })
        .limit(numcourses)
        .skip(numcourses * (page - 1));
      const totalcourses = await Courses.countDocuments({
        students: req.user.id,
      });
      console.log(coursesenrolled)
      console.log(totalcourses)
      res.json({ coursesenrolled, totalcourses });
    } catch (err) {
      console.log("-----------getcoursesenrolled error-------------");
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
  studentMembership: async (req, res) => {
    try {
      console.log(req.query.id);
      console.log(req.user.id);
      const coursesenrolled = await Courses.find({
        $and: [{ students: req.user.id }, { _id: req.query.id }],
      });
      console.log(coursesenrolled);
      if (coursesenrolled.length === 0) {
        console.log("notstudent");
        res.json({ isStudent: false });
      } else {
        console.log("student");
        res.json({ isStudent: true });
      }
    } catch (err) {
      console.log("-----------studentMembership error-------------");
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },

  getcoursesSearched: async (req, res) => {
    try {
      let numcourses = 8;
      const page = Number(req.query.page) || 1;
      const keyword = req.query.keyword
        ? {
            name: {
              $regex: req.query.keyword,
              $options: "i",
            },
          }
        : {};
      console.log("Keywooooooord query", req.query.keyword);
      const courses = await Courses.find({ ...keyword })
        .limit(numcourses)
        .skip(numcourses * (page - 1))
        .populate("user", "id name");
      const totalcourses = await Courses.countDocuments({ ...keyword });
      res.json({ courses, totalcourses });
    } catch (error) {
      console.log("-----------course Search error---------");
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  },
  getcoursedetails: async (req, res) => {
    try {
      const courses = await Courses.findById(req.params.id).populate({
        path: "user",
        model: "Users"
        }
      );
      res.json(courses);
      console.log(courses)
    } catch (error) {
      console.log("------------course details error----------");
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  },
  updateCourse: async (req, res) => {
    try {
      const {
        name,
        image,
        description,
        content
      } = req.body;

      console.log(
        "--------------req body-------------",
        req.body.content[0].lectures
      );
      const course = await Courses.findById(req.params.id);
      if (course) {
        course.name = name || course.name;
        course.image = image || course.image;
        course.description = description || course.description;
        course.content = content || course.content;
        console.log(course.content);
        const updatedCourse = await course.save();
        // console.log("updatedCourse" + updatedCourse);
        res.json({ msg: "Update Course Success!" });
      }
    } catch (err) {
      console.log("-----------Update crs error-------------", err);
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCourse: async (req, res) => {
    try {
      await Courses.findByIdAndDelete(req.params.id);

      res.json({ msg: "Deleted Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addCourse: async (req, res) => {
    try {
      const course = new Courses({
        name: "Sample",
        content: [],
        user: req.user.id,
        description: "Sample Description",
        image: "https://i.imgur.com/wCdx6Zs.png",
        students: [],
        numStudents: 0,
      });
      const addCourse = await course.save();
      res.json(addCourse);
    } catch (err) {
      console.log("-----------Add crs error-------------", err);
      return res.status(500).json({ msg: err.message });
    }
  },
  enroll: async (req, res) => {
    try {
      const course = await Courses.findById(req.params.id).populate({
        path: "students",
        model: "Users"
        }
      );
      if (course) {
       course.students.push(req.user.id);
       console.log(course)
       const enroll = await course.save();
       return res.json({ msg: "Enrolled to course successfully!" });
	  }
    } catch (error) {
      console.log("------------enroll error----------");
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  },
};
module.exports = coursesCtrl;
