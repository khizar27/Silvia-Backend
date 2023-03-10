'use strict'

const express = require('express');
const catchAsyncFun = require('../middlewares/catchAsyncFun');
const adsSdk = require('facebook-nodejs-business-sdk');
const accessToken = 'EAAHmNXZAFU44BAPeX3r9ZCZBs4F9I8VdNZAMKk7Ej28UPg410dPT40wgBQM7LhktrrvMCZBzffgf10El29xFg2wHwt8ZAlYQG5GgOWnOWcj264w25MZCR2pnFO9XmiyIjE9DxoUQLlTOyZAVRq7ZAc0u2TZB22gD7alfZCEpH22yphmaQZDZD';
const router = express.Router()
const pool = require("../DBconnection");
const { query } = require('express');


// get Add categories
exports.getAdCategory = catchAsyncFun(async (req, res) => {
  const user = await pool.query('select * from special_ad_categories')
  res.json({
    success: true,
    menue: user.rows,
    message: "ad-categories are following !"
  })
})

// insert data in categories
exports.insertAdCategory = catchAsyncFun(async (req, res) => {
  const user = await pool.query('INSERT INTO special_ad_categories (name) VALUES ($1) RETURNING *  '
    , [req.body.name])
  res.json({
    success: true,
    menue: user.rows,
    message: "ad-categories added succesfully !"
  })
})

// get Ad Object
exports.getAdObjects = catchAsyncFun(async (req, res) => {
  const user = await pool.query('select * from objective')
  res.json({
    success: true,
    menue: user.rows,
    message: "ad-objective are following !"
  })
})

// insert ad object
exports.insertAdObject = catchAsyncFun(async (req, res) => {
  const user = await pool.query('INSERT INTO objective (name) VALUES ($1) RETURNING *  '
    , [req.body.name])
  res.json({
    success: true,
    menue: user.rows,
    message: "ad-objects added succesfully !"
  })
})

// create campaign on facebook
exports.campaign = catchAsyncFun(async (req, res) => {
  const api = adsSdk.FacebookAdsApi.init(accessToken);
  const AdAccount = adsSdk.AdAccount;
  const Campaign = adsSdk.Campaign;
  const account = new AdAccount('act_1191355258442414');

  console.log(account.id) // fields can be accessed as properties
  account
    .createCampaign(
      [Campaign.Fields.Id],
      {
        [Campaign.Fields.name]: req.body.name, // Each object contains a fields map with a list of fields supported on that object.
        [Campaign.Fields.status]: req.body.status,
        // [Campaign.Fields.objective]: Campaign.Objective.page_likes
        [Campaign.Fields.special_ad_categories]: req.body.special_ad_categories,
        [Campaign.Fields.objective]: req.body.objective,
      }
    )
    .then(async (result) => {
      console.log(result);
      const data = await pool.query(
        'insert into fb_campaigns (name,campaign_id,special_ad_categories,objective,status,user_id) values ($1,$2,$3,$4,$5,$6) RETURNING *',
        [

          req.body.name,
          result._data.id,
          req.body.status,
          req.body.special_ad_categories,
          req.body.objective,
          req.body.user_id
        ]
      )
      res.json({
        message: 'success',
        result
      })
    })
    .catch((error) => {
      console.log(error);
    });
})

// campign list from database
exports.listOfcampaigns = catchAsyncFun(async (req, res) => {
  let campaign = await pool.query(
    'select * from fb_campaigns'
  )
  res.json({
    message: 'success',
    "camapign": campaign.rows
  })
})

// create add set of facebook
exports.AdSet = catchAsyncFun(async (req, res) => {
  // console.log(req.body);
  const api = adsSdk.FacebookAdsApi.init(accessToken);
  const AdAccount = adsSdk.AdAccount;
  const AdSet = adsSdk.AdSet;
  const account = new AdAccount('act_1191355258442414');

  // console.log(account.id)
  const c_id = await pool.query(
    'select campaign_id from fb_campaigns where id=($1)',
    [
      req.body.campaign_id,
    ]
  )
  // console.log(c_id.rows[0].campaign_id);

  account
    .createAdSet(
      [AdSet.Fields.Id],
      {
        [AdSet.Fields.name]: req.body.name, // Each object contains a fields map with a list of fields supported on that object.
        [AdSet.Fields.lifetime_budget]: req.body.lifetime_budget,
        [AdSet.Fields.start_time]: req.body.start_time,
        [AdSet.Fields.end_time]: req.body.end_time,
        [AdSet.Fields.campaign_id]: c_id.rows[0].campaign_id,
        [AdSet.Fields.bid_amount]: req.body.bid_amount,
        [AdSet.Fields.billing_event]: req.body.billing_event,
        [AdSet.Fields.optimization_goal]: req.body.optimization_goal,
        [AdSet.Fields.targeting]: { 'age_min': req.body.age_min, 'age_max': req.body.age_max, 'genders': [1], 'geo_locations': { 'cities': [{ 'key': '777934', 'radius': 10, 'distance_unit': 'mile' }] } },
        [AdSet.Fields.status]: req.body.status
      })
    .then(async (result) => {
      console.log(result);
      const data = await pool.query(
        'insert into fb_ad_sets(name,campaign_id,lifetime_budget,start_time,end_time,bid_amount,billing_event,optimization_goal,status,age_min,age_max,genders,geo_locations) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
        [
          req.body.name,
          req.body.campaign_id,
          req.body.lifetime_budget,
          req.body.start_time,
          req.body.end_time,
          req.body.bid_amount,
          req.body.billing_event,
          req.body.optimization_goal,
          req.body.status,
          req.body.age_min,
          req.body.age_max,
          req.body.genders,
          req.body.geo_locations
        ]
      )
      res.json({
        message: 'success',
        data: data.rows[0]
      })
    })
    .catch((error) => {
      console.log(error);
    });
})


