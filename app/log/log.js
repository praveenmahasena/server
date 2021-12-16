const router = require("express").Router();
const { Server } = require("socket.io");
const { compareSync } = require("bcrypt");
const { User } = require("../db/index.js");
const { createLog } = require("../jwt/index.js");
const { logMiddle } = require("../middle/index.js");

let io = new Server(5054, {
    cors: {
        origin: "*",
        methods: ["POST", "GET"],
    },
});
// console.log("coding garden is the best");

router.post("/", async (req, res) => {
    const { EmailID, password } = req.body;
    if (!EmailID || !password)
        return res.status(400).json({ err: "empty fields arent valid" });

    const user = await User.findOne({ EmailID }).select("EmailID _id Password");
    if (!user) return res.status(400).json({ err: "user does not exist" });

    if (!compareSync(password, user.Password))
        return res.status(400).json({ err: "wrong password" });

    const Jwt = await createLog(EmailID);

    return res.status(200).json(Jwt);
});

router.get("/", logMiddle, async (req, res) => {
    const Uuser = req.headers["Uuser"];
    const user = await User.findOne({ EmailID: Uuser }).select(
        "EmailID UserName ProfilePic ValidEmail Massege"
    );
    res.status(200).json(user);
    io.on("connection", async (stream) => {
        stream.on("send", async (data) => {
            let [msg,]=data
            user.Massege.push(msg)
            user.save()
            io.emit("post", data);
        });
    });
});

// router.post("/msg", logMiddle, async (req, res) => {
//     const { Message, by } = req.body;
//     const EmailID = req.headers["Uuser"];
//     if (!Message || !by)
//         return res.status(400).json({ err: "empty arent valid" });

//     let uuser = await User.findOne({ EmailID }).select("Message");
//     uuser.Message.push({ Message, by });
//     uuser
//         .save()
//         .then((result) => {
//             return res.status(200).json({ msg: "massage has been sent" });
//         })
//         .catch((err) => {
//             console.log(err);
//             return res.status(400).json({ err: "couldnt send it" });
//         });
// });

module.exports = {
    router,
};
