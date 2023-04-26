import { RestWave, Router } from "restwave";
import { resendOTP, sendOTP, verifyOTP } from "./controller.js";
const app = new RestWave();

app.use((req, res, next) => {
	console.log("Passed throught middleware");
	next();
});

const router = new Router();

router.post("/sendotp", sendOTP);
router.post("/verifyotp", verifyOTP);
router.post("/resendotp", resendOTP);

app.use("/v1", router);

app.use((req, res) => {
	res.json({
		status: "fail",
		message: "endpoint not available",
	});
});

app.listen(3000, () => {
	console.log("server listening on 3000");
});
