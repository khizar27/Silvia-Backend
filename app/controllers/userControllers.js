"use strict";

const express = require("express");
const router = express.Router();
router.use(express.json());
const pool = require("../DBconnection"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const catchAsyncFunction = require('../middlewares/catchAsyncFun')
let app = express();
let bodyParser = require("body-parser");
const { query } = require("express");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

///////////////////////////////////
///////////Create user/////////////
exports.signup = catchAsyncFunction(async (req, res) => {
  try {

    if (!(req.body.firstname && req.body.email && req.body.password && req.body.businessname)) {
      return res.status(401).json({ 'success':false,error: "please fill all the credentials" })
    } else {
      // user exist or not
      const VerifyUser = await pool.query('select * from users where email = $1', [req.body.email])
      console.log(VerifyUser.rows[0])

      if (VerifyUser.rows[0]) return res.status(401).json({ 'success':false,error: "this user is already existed" });

      // create new user
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await pool.query(
        //     'INSERT INTO users (firstname,lastname,email,Password,businessname,industry,province) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *  '
        // ,   [req.body.firstname,req.body.lastname,req.body.email,hashedPassword,req.body.businessname,req.body.industry,req.body.province])

        'INSERT INTO users (firstname,lastname,email,password,businessname,industry,province) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *  '
        , [req.body.firstname, req.body.lastname, req.body.email, hashedPassword, req.body.businessname, req.body.industry, req.body.province]

      )
      const user_id = await pool.query('select id from users order by id desc limit 1');
      const hashedlink = await bcrypt.hash(req.body.email, 10);
      // console.log(hashedlink);
      const user_token = await pool.query(
        'INSERT INTO users_varify_token (user_id,token) VALUES ($1,$2)', [user_id.rows[0].id, hashedlink]
      )
      var transporter = nodemailer.createTransport({
        host: "engcoders.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'testing@engcoders.com',
          pass: 'n!),kFItvacp'
        }
      });
      var link = "http://localhost:4000/auth/verify-account?id=" + hashedlink;
      var mailOptions = {
        from: 'testing@engcoders.com',
        to: req.body.email,
        subject: 'Welcome to Silivia',
        html: "<p>Kindly varify your account by clicking on click here button</p><a href=" + link + ">Click here</a>",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      console.log(user.rows[0])
      const token = authToken(user.rows[0])
      res.json({
        'success':true,
        message:'Email send to your Account please verify',
        token: token,
        user: user.rows[0]
      })


    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})





/////////////////////////////////
////////// Login user////////////


exports.login = catchAsyncFunction(async (req, res) => {
  console.log("123");
  const user = await pool.query("select * from users where email = $1", [
    req.body.email,
  ]);
  console.log(user.rows[0], "userRole")
  
  if (!user.rows[0]) {
    return res.json({
      'success':false,
      message: "invalid credentials" });
  } else {
    // return res.json({message:'good'})
    console.log(user.rows[0].password, "password");
    const validPassword = bcrypt.compareSync(
      req.body.password,
      user.rows[0].password
    );
    console.log(validPassword, "2sra");
    if (!validPassword) {
      return res.json({ 
        'success':false,
        message: "invalid credentials" });
    } else {
      const userVerified = await pool.query(
        "select email_varified_at from users where email = $1 ",
        [req.body.email]
      );
      const userRole = await pool.query('select roles.title from roleuser join roles on roleuser.role_id = roles.id where roleuser.user_id =$1', [user.rows[0].id])
      console.log(userRole.rows, "role");
      if (!userVerified.rows[0].email_varified_at) {
        return res.json({ 
          'success':false,
          message: "need user verification" });
      } else {
        console.log(user.rows[0]);
        const token = authToken(user.rows[0]);
        res.json({
          'success':true,
          message:'user login successfully!',
          token: token,
          user: user.rows[0],
          'Role': userRole.rows
        });
      }
    }
  }
})

// Account verification
exports.accountVerify = catchAsyncFunction(async (req, res) => {
  const user_id_token = await pool.query(
    "select user_id from users_varify_token  where token = $1",
    [req.query.id]
  );
  const varify_email = await pool.query(
    "UPDATE users SET email_varified_at=CURRENT_TIMESTAMP WHERE id=$1;",
    [user_id_token.rows[0].user_id]
  );
  res.json({
    success: true,
    message: "account varified",
  });
})

// Chnage password
exports.changePassword = catchAsyncFunction(async (req, res) => {
  let user = await pool.query("select * from users where _id = $1", [
    req.params.id,
  ]);
  console.log(user.rows[0]);
  if (!user.rows[0]) {
    return res.json({ message: "user not found" });
  }
  console.log(user.rows[0].password, "pass");
  let { password, newpassword, confirmpassword } = req.body;
  if (!bcrypt.compareSync(password, user.rows[0].password)) {
    return res.json({ message: "oldpassword does not match" });
  }
  if (newpassword != confirmpassword) {
    return res.json({ message: "newpassword does not match" });
  }

  const hashedPassword = await bcrypt.hash(newpassword, 10);
  console.log(hashedPassword, "newhasehd");

  user.rows[0].password = hashedPassword;

  console.log(user.rows[0], "updated user");
  await pool.query("update users set password = $1 where _id =$2", [
    hashedPassword,
    req.params.id,
  ]);
  res.json({
    message: "Password changed successfully",
  });
})

const authToken = (user) => {
  return jwt.sign(
    {
      // email: user.email,
      id: user.id,
      // role: user.role
    },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.TOKEN_EXPIRY_TIME,
    }
  );
};


