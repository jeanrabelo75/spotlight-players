import AWS from "aws-sdk";

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID || "";
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || "";

const s3 = new AWS.S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
});

module.exports = s3;
