import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const mailTransporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.FROM_USER,
		pass: process.env.PASS,
	},
});
const sendEmail = async (email) => {
	email.from = process.env.FROM_USER;
	try {
		await mailTransporter.sendMail(email);
		return "success";
	} catch (e) {
		return e;
	}
};

export default sendEmail;
