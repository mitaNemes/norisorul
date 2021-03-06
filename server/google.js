require("dotenv").config();

const { google } = require("googleapis");
const { Storage } = require("@google-cloud/storage")
const fetch = require("node-fetch");

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URL
);

const googleCloud = new Storage({
    credentials: {
        client_email: process.env.SA_CLIENT_EMAIL,
        private_key: process.env.SA_PRIVATE_KEY.replace(/\\n/g, '\n')
    },
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

async function downloadGoogleCloudFile(bucketName, filename, fileType) {
    const file = googleCloud.bucket(bucketName).file(filename);
    return file.getSignedUrl({
        version: "v4",
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
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
    downloadGoogleCloudFile,
    uploadFile
}