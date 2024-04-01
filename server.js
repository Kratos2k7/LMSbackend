const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to fetch assignment submissions
app.post("/api/submissions/:courseId/:assignmentId", async (req, res) => {
  try {
    const token = req.query.token;
    const { courseId, assignmentId } = req.params;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.CANVAS_API_URL}courses/${
        courseId ? courseId : "1"
      }/assignments/${
        assignmentId ? assignmentId : "1"
      }/submissions?include[]=submission_comments`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.request(config);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assignment submissions" });
  }
});
app.post(
  "/api/submissions/:courseId/:assignmentId/:userId/files",
  async (req, res) => {
    try {
      const { courseId, assignmentId, userId } = req.params;
      const { token, ...data } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.CANVAS_API_URL}courses/${
          courseId ? courseId : "1"
        }/assignments/${
          assignmentId ? assignmentId : "1"
        }/submissions/${userId}/comments/files`,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(config.url);
      const response = await axios.request(config);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);
app.put(
  "/api/submissions/:courseId/:assignmentId/:userId",
  async (req, res) => {
    try {
      const { token, comment } = req.query;
      const { courseId, assignmentId, userId } = req.params;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }
      const config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${process.env.CANVAS_API_URL}courses/${
          courseId ? courseId : "1"
        }/assignments/${assignmentId ? assignmentId : "1"}/submissions/${
          userId ? userId : "1"
        }?comment[text_comment]=${comment}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.request(config);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);
app.put(
  "/api/submissions/:courseId/:assignmentId/:userId/upload",
  async (req, res) => {
    try {
      const { token, comment } = req.query;
      const { courseId, assignmentId, userId } = req.params;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }
      const config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${process.env.CANVAS_API_URL}courses/${
          courseId ? courseId : "1"
        }/assignments/${assignmentId ? assignmentId : "1"}/submissions/${
          userId ? userId : "1"
        }?comment[file_ids][]=${comment}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.request(config);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);
app.put(
  "/api/submissions/:courseId/:assignmentId/:userId/grade",
  async (req, res) => {
    try {
      const { token, grade } = req.query;
      const { courseId, assignmentId, userId } = req.params;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }
      const config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${process.env.CANVAS_API_URL}courses/${
          courseId ? courseId : "1"
        }/assignments/${assignmentId ? assignmentId : "1"}/submissions/${
          userId ? userId : "1"
        }?submission[posted_grade]=${grade}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(config.url);
      const response = await axios.request(config);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);
app.put(
  "/api/submissions/:courseId/:assignmentId/:userId/:commentId",
  async (req, res) => {
    try {
      const { token, comment } = req.query;
      const { courseId, assignmentId, userId, commentId } = req.params;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }
      const config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${process.env.CANVAS_API_URL}courses/${
          courseId ? courseId : "1"
        }/assignments/${assignmentId ? assignmentId : "1"}/submissions/${
          userId ? userId : "1"
        }/comments/${commentId}?comment=${comment}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(config.url);
      const response = await axios.request(config);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);
app.delete(
  "/api/submissions/:courseId/:assignmentId/:submissionId/:commentId",
  async (req, res) => {
    try {
      const token = req.query.token;
      const { courseId, assignmentId, submissionId, commentId } = req.params;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }
      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${process.env.CANVAS_API_URL}courses/${
          courseId ? courseId : "1"
        }/assignments/${assignmentId ? assignmentId : "1"}/submissions/${
          submissionId ? submissionId : "1"
        }/comments/${commentId ? commentId : "1"}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.request(config);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
