import pool from "./config.js";
import crypto from "crypto";
import sendEmail from "./mailer.js";
import jwt from "jsonwebtoken";
import { QsaveTokenOTP, QgetOTP, QupdateOTP } from "./queries.js";

const generateToken = (email, expiresIn = "24h") => {
	return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn });
};

const getVerificationCode = () => {
	const n = crypto.randomInt(0, 1000000);
	const verificationCode = n.toString().padStart(6, "0");
	console.log(typeof verificationCode);
	return verificationCode;
};

const sendOTP = async (req, res) => {
	const email = "adarshshahi1009@gmail.com";
	try {
		const mail = {
			to: email,
			subject: "OTP",
			text: getVerificationCode(),
		};

		await sendEmail(mail);
		await pool.query(
			QsaveTokenOTP(generateToken(email), getVerificationCode())
		);
		res.json("email sent.", 201);
	} catch (e) {
		res.json(e);
	}
};

const verifyOTP = () => {};

const resendOTP = () => {};

export { sendOTP, verifyOTP, resendOTP };
