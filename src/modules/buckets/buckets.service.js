import {parseBucketData, parseFileData} from "./buckets.logic"

export const getGoogleCloudBucketList = () => {
  return fetch("/getGoogleCloudBucketList")
    .then((response) => {
      return response.json();
    })
    .then((data) => parseBucketData(data))
    .catch((error) => {
      throw new Error("Get Google Cloud Bucket List failed", error.message);
    })
};

export const getGoogleCloudBucketFiles = (bucketName) => {
  return fetch(`/getGoogleCloudBucketFiles?bucketName=${bucketName}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => parseFileData(data))
    .catch((error) => {
      throw new Error("Get Google Cloud Bucket List failed", error.message);
    })
};

export const getGoogleCloudFile = (bucketName, fileName) => {
  return fetch(`/getGoogleCloudFile?bucketName=${bucketName}&fileName=${fileName}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => parseFileData(data))
    .catch((error) => {
      throw new Error("Get Google Cloud Bucket List failed", error.message);
    })
};

export const downloadFile = (bucketName, fileName, fileType) => {
  return fetch(`/downloadGoogleCloudFile?bucketName=${bucketName}&fileName=${fileName}`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const blob = new Blob([data], {type: fileType});
    const link = document.createElement("a");
    console.log(blob)
    // link.href = window.URL.createObjectURL(blob);
    // link.click();
  })
  .catch((error) => {
    throw new Error("Get Google Cloud Bucket List failed", error.message);
  })
}

export const uploadFile = (bucketName, file) => {
  let body = new FormData();

  // body.append('file', file)
  body.append('bucketName', bucketName)
  body.append('test', file)

  return fetch("/upload", {
    method: 'POST',
    body
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => data)
    .catch((error) => {
      throw new Error("Get Google Cloud Bucket List failed", error.message);
    })
};