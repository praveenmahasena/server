const router = require("express").Router()
const { User } = require("../db/index.js")
const { hash, compareSync } = require("bcrypt")
const { veryfyMail, passCodeMail } = require("../mail/index.js")
const { forMail, toMail } = require("../jwt/index.js")
router.post("/", async (req, res) => {
    const { EmailID, UserName, password, ProfilePic } = req.body
    if (!EmailID || !UserName || !password || !ProfilePic)
        return res.status(400).json({ err: "empty feilds arent allowed" })

    const usertrue = await User.findOne({ EmailID })
    if (usertrue) return res.status(400).json({ err: "user already exists" })

    const newUser = await new User({
        EmailID,
        UserName,
        Password: await hash(password, 10),
        ProfilePic,
    })
    newUser
        .save()
        .then(async (result) => {
            const jwt = await forMail(EmailID)
            const sentResult = await veryfyMail(EmailID, "Verify Your Accont", jwt)
            if (!sentResult[0])
                console.log(res)
                return res
                    .status(400)
                    .json({ err: "there was an err during sending mail to you" })
            // return res.status(200).json({ msg: "validate your email id" })
        })
        .catch((err) => {
            console.log(err)
            return res.json({ err: "there was an err during creating your account" })
        })
})

router.get("/ver/:jwt", async (req, res) => {
    const { jwt } = req.params
    if (!jwt)
        return res.status(404).json({ err: "cannot validate that garbage" })
    const user = await toMail(jwt)
    if (!user[0]) return res.status().json({ err: "pls get another token" })
    User.findOneAndUpdate(user[1].data, { $set: { ValidEmail: true } })
        .then((result) => {
            console.log("changed to true")
        })
        .catch((err) => {
            console.log(err)
        });
    return res.status(200).json({ msg: "congrats you're valid user now" })
});

router.post("/JWT", async (req, res) => {
    const { EmailID } = req.body
    if (!EmailID) return res.status(400).json({ err: "no invalid EmailId " })
    const userEmail = await User.findOne(req.body).select("EmailID")
    if (!userEmail)
        return res.status(400).json({ err: "no such user exist here" })
    const jwt = await forMail(EmailID)
    const sentResult = await veryfyMail(EmailID, "Verify Your Accont", jwt)
    return sentResult[0]
        ? res.status(200).json({ msg: "Mail has been sent to you" })
        : res.status(400).json({
            err: "there was an err during sending you mail pls contect us on given EmailId",
        })
})

router.post("/password", async (req, res) => {
    const { EmailID, password, newPassword } = req.body
    if (!EmailID || !password || !newPassword)
        return res.status(400).json({ err: "thats a empty feild" })

    let userEmail = await User.findOne({ EmailID }).select("Password")
    if (!userEmail)
        return res.status(400).json({ err: "no such user exist here" })
    if (!compareSync(password, userEmail.Password))
        return res.status(400).json({ err: "wrong password" })
    try {
        userEmail.Password = await hash(newPassword, 10)
        userEmail.save()
        res.status(200).json({ msg: "yayaya" })
    } catch (err) {
        console.log(err)
        res.status(400).json({ err })
    }
});

router.post("/passwordNum", async (req, res) => {
    const { EmailID } = req.body
    if (!EmailID) return res.status(400).json({ err: "thats a empty feild" })

    let userEmail = await User.findOne({ EmailID }).select(
        "Password RecoveryNum"
    );
    if (!userEmail)
        return res.status(400).json({ err: "no such user exist here" })

    const randomNum = Math.ceil(Math.random() * 50000)
    try {
        userEmail.RecoveryNum = randomNum
        userEmail.save()
        const sent = await passCodeMail(
            EmailID,
            "code to change your password",
            randomNum
        );
        if (sent[0])
            return res.status(200).json({ msg: "mail has been sent to you" })
        return res
            .status(400)
            .json({ err: "there an err during sending you message" })
    } catch (err) {
        console.log(err)
        res.status(400).json({ err: "couldnt do a request" })
    }
    setTimeout(() => {
        userEmail.RecoveryNum = 0;
        userEmail.save()
        console.log("reseted the number")
    }, 5000);
});

router.post("/repassword", async (req, res) => {
    const { EmailID, password, RecoveryNum } = req.body;
    if (!EmailID || !password || !RecoveryNum)
        return res.status(400).json({ err: "thats a empty " });

    let userEmail = await User.findOne({ EmailID }).select(
        "Password RecoveryNum"
    );
    if (!userEmail)
        return res.status(400).json({ err: "no such user exist here" })
    if (userEmail.RecoveryNum != RecoveryNum)
        return res.status(400).json({
            err: "the code you provided does not match pls try to get another one",
        })
    try {
        userEmail.Password = await hash(password, 10)
        userEmail.save()
        return res.status(200).json({ msg: "password has been changed" })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ err: "couldnt change your password" })
    }
})

module.exports = {
    router,
}
