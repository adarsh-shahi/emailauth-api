import RestWave from "restwave";
import { resendOTP, sendOTP, verifyOTP } from "./controller.js";
const app = new RestWave();

const router = RestWave.router();

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

app.printMiddlewares();
app.listen(3000, () => {
	console.log("server listening on 3000");
});
