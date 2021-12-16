const { createTransport } = require("nodemailer");

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: '', //place holder for Email
        pass: '' // place holder for password
    },
});

const MailOptions = (EmailID, subject, text) => {
    const mailOptions = {
        from: "youremail@gmail.com", // place holder
        to: EmailID,
        subject,
        text,
    };
    return mailOptions;
};

async function veryfyMail(EmailID, subject, text) {
    // theres a typo in this function but i dontwanna correct it
    try {
        await transporter.sendMail(MailOptions(EmailID, subject, `Click this link to Verify your Account http://localhost:2264/create/ver/${text}`));
        return [true];
    } catch (err) {
        console.log(err);
        return [false, err];
    }
}


async function passCodeMail(EmailID, subject, text) {
    try {
        await transporter.sendMail(MailOptions(EmailID, subject, `the code to recover your Account ${text}`));
        return [true];
    } catch (err) {
        console.log(err);
        return [false, err];
    }
}

module.exports = {
    veryfyMail,
    passCodeMail
}
