require("dotenv").config();

const { google } = require("googleapis");
const { Storage } = require("@google-cloud/storage")
const path = require("path")
const fetch = require("node-fetch");

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URL
);

const serviceAccountCredentials = {}
if (process.env.NODE_ENV === "production") {
    serviceAccountCredentials = {
        credentials: JSON.parse(process.env.GC_SERVICE_ACCOUNTE)
    }
} else {
    serviceAccountCredentials = {
        keyFilename: path.join(__dirname, "../server/festive-firefly-349922-731e359cd2e7.json"),

    }
}
const googleCloud = new Storage({
    ...serviceAccountCredentials,
    projectId: process.env.PROJCET_ID
})

function getGoogleAuthURL() {
    const scopes = [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
    ];

    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes
    });
}

async function getGoogleUserAndTokins(code) {
    const { tokens } = await oauth2Client.getToken(code);

    return await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        {
            headers: {
                Authorization: `Bearer ${tokens.id_token}`,
            },
        },
    )
        .then(res => res.json())
        .then(data => ({ ...data, ...tokens }))
        .catch(error => {
            throw new Error(error.message);
        });
}

function getGoogleCloudBuckets() {
    return googleCloud.getBuckets().then(buckets => buckets)
}

function getBucketFiles(bucketName) {
    return googleCloud.bucket(bucketName).getFiles()
}

function getBucketFile(bucketName, prefix) {
    return googleCloud.bucket(bucketName).getFiles({ prefix })
}

function uploadFile({ file, bucketName }) {
    console.log(file)
    // const blob = googleCloud.bucket(bucketName).file(file.originalname);
    // const blobStream = blob.createWriteStream();

    // blobStream.on("error", err => {
    //     return err;
    // });

    // blobStream.on("finish", () => {
    //     // The public URL can be used to directly access the file via HTTP.
    //     return format(
    //         `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    //     );
    // });

    // blobStream.end(req.file.buffer);
}

module.exports = {
    getGoogleAuthURL,
    getGoogleUserAndTokins,
    getGoogleCloudBuckets,
    getBucketFiles,
    getBucketFile,
    uploadFile
}