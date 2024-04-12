const express = require("express");
const axios = require("axios");
const path = require("path");
const pdf = require("html-pdf");
const fs = require("fs");
const pdfs = require("pdf-parse");

const router = express.Router();

async function getPDFTextFromURL(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfs(buffer);
    return data.text;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
const htmlToPdf = (html) => {
  return new Promise((resolve, reject) => {
    pdf
      .create(html, {
        format: "Letter",
        timeout: 100000,
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "/dev/null",
          },
        },
      })
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
    const response = await axios.request(config);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
router.post("/report-generate", async (req, res) => {
  try {
    const { payload } = req.body;
    const generatedFiles = [];
    for (const item of payload) {
      if (item.attachments && item.attachments.length > 0) {
        const pdfURL = item.attachments[0].url;
        await getPDFTextFromURL(pdfURL)
          .then(async (textNode) => {
            const html = `<html><body><h1>Submission Id: ${item.id}</h1><p>${textNode}</p></body></html>`;
            const { filename } = await htmlToPdf(html);
            const fileContent = fs.readFileSync(filename);
            generatedFiles.push(fileContent);
          })
          .catch((error) => {
            res.status(500).json({ error: error });
          });
      } else {
        const html = `<html><body><h1>Submission Id: ${item.id}</h1><p>${item.body}</p></body></html>`;
        const { filename } = await htmlToPdf(html);
        const fileContent = fs.readFileSync(filename);
        generatedFiles.push(fileContent);
      }
    }
    res.status(200).json({ generatedFiles });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
