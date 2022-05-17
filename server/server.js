const express = require("express")
const Multer = require("multer");
const path = require("path")
const { getGoogleAuthURL, getGoogleUserAndTokins, getGoogleCloudBuckets, getBucketFiles, getBucketFile, uploadFile } = require("./google")

const app = express()
const port = process.env.PORT || 5000
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

app.get("/getGoogleConsentUrl", (req, res) => {
  res.send(JSON.stringify(getGoogleAuthURL()))
})

app.get("/getGoogleUser", async (req, res) => {
  const code = req.query.code ?? ""
  const data = await getGoogleUserAndTokins(code)
  res.send(data)
})

app.get("/getGoogleCloudBucketList", async (req, res) => {
  const data = await getGoogleCloudBuckets()
  res.send(data[0])
})

app.get("/getGoogleCloudBucketFiles", async (req, res) => {
  let data = []
  if (req.query.bucketName) {
    data = await getBucketFiles(req.query.bucketName)
  }

  res.send(data[0])
})

app.get("/getGoogleCloudFile", async (req, res) => {
  let data = []

  if (req.query.bucketName && req.query.fileName) {
    data = await getBucketFile(req.query.bucketName, req.query.fileName)
  }

  res.send(data[0])
})

app.post("/upload", multer.single("file"), (req, res) => {
  console.log(req.body)
  const data = uploadFile(req.body)
  res.send(data)
})

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"))
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../build", "index.html"))
  })
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})