'use strict'

const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 4000;
require('dotenv').config()
require('./app/DBconnection')

const app = express()
app.use(express.json())
app.use(cookieParser());
app.use(cors())

// routers
const authRouter = require('./app/routes/authRoutes')
const accessRouter = require('./app/routes/accessRoutes')
const menuesRoutes = require('./app/routes/menuRoutes')
const campaignRoutes = require('./app/routes/marketingCampaignRoutes')

app.use('/auth',authRouter)
app.use('/access',accessRouter)
app.use('/menues',menuesRoutes)
app.use('/facebook',campaignRoutes)

app.listen(PORT, ()=> {
    console.log(`Server is listening on port:${PORT}`);
  })




