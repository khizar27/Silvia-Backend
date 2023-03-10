"use strict"

const pool = require("../DBconnection");
const catchAsyncFunction = require('../middlewares/catchAsyncFun');

// add roles
exports.addRole=catchAsyncFunction(async(req,res)=>{
    
    const existRole  = await pool.query('select * from roles where title = $1',[req.body.title])
    // console.log(existRole.rows[0].title);
    if(existRole.rows[0]){
        res.json({
            'success' : false,
            message:'this title is already exist'
        })
    }else{
        console.log( req.body.title);
        const user = await pool.query(
            'INSERT INTO roles (title) VALUES ($1) RETURNING *  '
            , [req.body.title]
        )
        res.json({
            success:true,
            message:"role added successfully!"
        })   
    }      
})

//add permission  
exports.addPermission = catchAsyncFunction(async(req,res)=>{
    const user = await pool.query(
        'INSERT INTO permission  (title) VALUES ($1) RETURNING *  '
        , [req.body.title]
    )
    res.json({
        success:true,
        message:"permission  added successfully!"
    })
})

// get roles
exports.getRoles = catchAsyncFunction(async(req,res)=>{
    const user = await pool.query(
        'select * from roles'
    )
   
    res.json({
        success:true,
        role:user.rows,
        message:"roles  fetched successfully!"
    })
})

//get permission 
exports.getPermission = catchAsyncFunction(async(req,res)=>{
    const user = await pool.query(
        'select * from permission'
    )
   
    res.json({
        success:true,
        role:user.rows,
        message:"permissions  fetched successfully!"
    })
})

// assign role permisions
exports.assignRolePermission = catchAsyncFunction(async(req,res)=>{
    const user = await pool.query(
        // insert into rolePermission (role_id,permission_id) values(1,1);
        'INSERT INTO rolePermission  (role_id,permission_id) VALUES ($1,$2) RETURNING *  '
        , [req.body.role_id,req.body.permission_id]
    )
   
    res.json({
        success:true,
        role:user.rows,
        message:"permissions assign to role successfully!"
    })
})

// get All users
exports.getAllUsers = catchAsyncFunction(async(req,res)=>{
const user = await pool.query(
        'select * from users'
    )
   
    res.json({
        success:true,
        users:user.rows,
        message:"permissions assign to role successfully!"
    })
})

// assign user role
exports.assignUserRole = catchAsyncFunction(async(req,res)=>{
console.log(req.body.role_id);
    req.body.role_id.forEach(async(element) => {
        // console.log(element);
        const user = await pool.query(
        // insert into rolePermission (role_id,permission_id) values(1,1);
        'INSERT INTO roleUser (role_id,user_id) VALUES ($1,$2) RETURNING *  '
        , [element,req.body.user_id]
    )
    // console.log(user.rows);
      });
    
   
    res.json({
        success:true,
        // users:user.rows,
        message:"role assign to user successfully!"
    })
})

// 
exports.getUserRole = catchAsyncFunction(async(req,res)=>{
const user = await pool.query('select * from roleuser where user_id = $1',[req.body.user_id])
    console.log(user.rows);
    res.json({
        success:true,
        users:user.rows,
        message:"user  role are followings!"
    })
})

