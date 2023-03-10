"use strict"

const pool = require("../DBconnection");
const catchAsyncFunction = require('../middlewares/catchAsyncFun');

// add menues Links
exports.addMenuLinks = catchAsyncFunction(async(req,res)=>{
    var user;
    if(req.body.parent_id){
        user = await pool.query(
            'INSERT INTO menues (name,href,slug,parent_id) VALUES ($1,$2,$3,$4) RETURNING *  '
            , [req.body.name,req.body.href,req.body.slug,req.body.parent_id])
    }
    else{
        user = await pool.query(
            'INSERT INTO menues (name,href,slug) VALUES ($1,$2,$3) RETURNING *  '
            , [req.body.name,req.body.href,req.body.slug])
    }

    res.json({
        success:true,
        menue_links:user.rows,
        message:"menue added successfully!"
    })
}); 

// create menues
exports.createMenu = catchAsyncFunction(async(req,res)=>{
    req.body.menue_id.forEach(async(element) => {
        // console.log(element);
        const user = await pool.query(
        // insert into rolePermission (role_id,permission_id) values(1,1);
        'INSERT INTO rolemenue (role_id,role_name,menue_id) VALUES ($1,$2,$3) RETURNING *  '
        , [req.body.role_id,req.body.role_name,element]
    )
    // console.log(user.rows);
      });

    res.json({
        success:true,
        // users:user.rows,
        message:"menue created successfully!"
    })
});

// get menues link
exports.getMenuLinks = catchAsyncFunction(async(req,res)=>{
    const user = await pool.query(
        'select * from menues'
    )
    res.json({
        success:true,
        menue_links:user.rows,
        message:"menue links are following !"
    })
})

// get menues
exports.getMenues = catchAsyncFunction(async(req,res)=>{
    const user = await pool.query(
        'select DISTINCT ON (role_id) * from rolemenue'
    )
    res.json({
        success:true,
        menues:user.rows,
        message:"menues  are following !"
    })
});

// get menue detail
exports.getMenueDetail = catchAsyncFunction(async(req,res)=>{
    const user = await pool.query('select * from rolemenue where role_id = $1',[req.body.role_id])
    res.json({
    success:true,
    menue:user.rows,
    message:"menue details are following !"
})
})



