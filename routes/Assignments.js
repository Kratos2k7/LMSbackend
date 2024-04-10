const express = require("express");
const axios = require("axios");
const path = require("path");
const pdf = require("html-pdf");
const fs = require("fs");

const router = express.Router();
const htmlToPdf = (html) => {
  return new Promise((resolve, reject) => {
    pdf
      .create(html, { format: "Letter", timeout: 100000 })
      .toFile(
        path.join(__dirname, "../templates/receipt.pdf"),
        function (err, filePath) {
          if (err) return reject(err);
          return resolve(filePath);
        }
      );
  });
};
// Route to fetch assignment submissions
router.get("/courses", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.CANVAS_API_URL}users/self/courses`,
      headers: {
        Authorization: `${token}`,
      },
    };

    const response = await axios.request(config);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
router.get("/courses/:courseId/assignments", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { courseId } = req.params;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.CANVAS_API_URL}users/self/courses/${courseId}/assignments`,
      headers: {
        Authorization: `${token}`,
      },
    };
    console.log(config.url);
    const response = await axios.request(config);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/report-generate", async (req, res) => {
  try {
    const {body,id} = req.body;
    const html = `<html><body><h1>Submission Id: ${id}</h1><p>${body}</p></body></html>`;
    const { filename } = await htmlToPdf(html);
    const fileContent = fs.readFileSync(filename);

    res.status(200).json({ fileContent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
