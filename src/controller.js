import pool from "./config.js";
import crypto from "crypto";
import sendEmail from "./mailer.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import { QsaveTokenOTP, QgetOTP, QupdateOTP } from "./queries.js";

const generateToken = (email, minutes = 60) => {
	console.log(minutes);
	return jwt.sign({ email }, process.env.JWT_SECRET, {
		expiresIn: 60 * minutes,
	});
};

const getVerificationCode = () => {
	const n = crypto.randomInt(0, 1000000);
	const verificationCode = n.toString().padStart(6, "0");
	return verificationCode;
};

const sendOTP = async (req, res) => {
	try {
		const { email, expiresIn } = req.body;
		if (!email || !validator.isEmail(email))
			throw new Error("please provide valid email");
		const otp = getVerificationCode();
		const mail = {
			to: email,
			subject: "OTP",
			text: otp,
		};

		await sendEmail(mail);
		const token = generateToken(email, expiresIn);
		await pool.query(QsaveTokenOTP(token, otp));
		res.json({ status: "success", message: { token } }, 201);
	} catch (e) {
		res.json(e.message);
	}
};

const verifyOTP = async (req, res) => {
	try {
		console.log("in verify");
		const { token, otp } = req.body;
		if (!token || !otp) throw new Error("please provide token and otp");
		const { email } = jwt.verify(token, process.env.JWT_SECRET);
		if (!email) throw new Error("OTP expired. Send Again");
		console.log("Email: " + email);
		const response = await pool.query(QgetOTP(token));
		const { token: dbToken, otp: dbOTP } = response.rows[0];
		console.log(dbToken);
		console.log(token);
		if (dbToken !== token)
			throw new Error("error occured please generate OTP again");
		else if (otp !== dbOTP)
			res.json({ status: "success", message: { valid: false, email } });
		else res.json({ status: "success", message: { valid: true, email } });
	} catch (e) {
		let msg = e.message;
		if (e.message === "jwt expired")
			msg = "Token expired. sendOTP with new token";
		res.json({
			status: "fail",
			message: msg,
		});
	}
};

const resendOTP = async (req, res) => {
	try {
		const { token } = req.body;
		if (!token) throw new Error("please provide token");
		const { email } = jwt.verify(token, process.env.JWT_SECRET);
		if (!email) throw new Error("OTP expired. Send Again");
		const otp = getVerificationCode();
		const mail = {
			to: email,
			subject: "OTP",
			text: otp,
		};
		await sendEmail(mail);
		await pool.query(QupdateOTP(token, otp));
		res.json({
			status: "success",
			message: {
				email,
				message: "otp sent"
			},
		});
	} catch (e) {
		let msg = e.message;
		if (e.message === "jwt expired")
			msg = "Token expired. sendOTP with new token";
		res.json({
			status: "fail",
			message: msg,
		});
	}
};

export { sendOTP, verifyOTP, resendOTP };
