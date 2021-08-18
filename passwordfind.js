const express = require("express");
const router = express.Router();
const nodemailer = require(`nodemailer`);

// node.js 실행하기

var http = require("http");
var fs = require("fs");
var app = http.createServer(function (request, response) {
  var url = request.url;
  if (url == "/") {
    url = "/index2.html";
  }
  response.writeHead(200);
  response.end(fs.readFileSync(__dirname + url));
});
app.listen(3000);

// mysql 연동

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "34ji1900",
  database: "neonadle",
});

connection.connect();

/*
connection.query("SELECT * FROM members", function (error, results, fields) {
  if (error) {
    console.log(error);
  }
  console.log(results);
});*/

function button1_click() {
  var emailinput = document.getElementById("mail").value;
  if (email_check(emailinput)) {
    alert("이메일 보내기 성공");
  }
}

// 메일 보내기 기능

// nodemailer transport 생성
const transporter = nodemailer.createTransport({
  service: `gmail`,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: `ji00inlove@gmail.com`,
    pass: `wbymbxtsgakagpce`,
  },
});
const emailOptions = {
  // 옵션값 설정
  from: `ji00inlove@gmail.com`,
  to: `ji00inlove@naver.com`,
  subject: `너나들이 임시 비밀번호 발송`,
  html: `임시 비밀번호는 다음과 같습니다.
      password: 12345678`,
};

// 전송
transporter.sendMail(emailOptions, (err, res) => {
  if (err) {
    console.log(`failed... => `, err);
  } else {
    console.log(`succeed... => `, res);
  }
  transporter.close();
});
