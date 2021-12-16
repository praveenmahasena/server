const express = require("express")
const cors = require("cors")
const volleyball = require("volleyball")
const helmet = require("helmet")
const { router: create } = require("./log/Create.js")
const { router: log } = require('./log/log.js')
const app = express()
app.use(express.json({ limit: "10mb" }))
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    })
)

app.use(helmet())
app.use(volleyball)
console.log('go lang is the best')

app.use("/create", create)
app.use("/log", log)

module.exports = {
    app,
};
