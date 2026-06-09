var express = require("express");
var { compareHashedPassword } = require("../../utils");
const UsersDatabase = require("../../models/User");
var router = express.Router();
const { authLimiter } = require("../rateLimiter");




router.post("/login", authLimiter, async function (request, response) {
  const { email, password } = request.body;
  /**
   * step1: check if a user exists with that email
   * step2: check if the password to the email is correct
   * step3: if it is correct, return some data
   */

  // step1
  const user = await UsersDatabase.findOne({ email: email });

  if (user) {
    // step2
    const passwordIsCorrect = compareHashedPassword(user.password, password);

    if (passwordIsCorrect) {
      response.status(200).json({ code: "Ok", data: user });
    } else {
      response.status(502).json({ code: "invalid credentials" });
    }
  } else {
    response.status(404).json({ code: "no user found" });
  }
});


router.put("/login/:_id/enable", async (req, res) => {
  const { _id } = req.params; // Use req.params to get the _id from the URL
  try {
    const user = await UsersDatabase.findOne({ _id });

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    // Update the user's "condition" property to "enabled"
    user.condition = "enabled";

    // Save the updated user
    await user.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "User enabled successfully",
      user: user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Internal Server Error",
    });
  }
});


router.put("/login/:_id/disable", async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await UsersDatabase.findOne({ _id });

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    user.condition = "disabled";

    await user.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "User disabled successfully",
      user: user,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Internal Server Error",
    });
  }
});



router.post("/loginadmin", authLimiter, async function (request, response) {
  const { email} = request.body;

  const user = await UsersDatabase.findOne({ email: email });

  if (user) {
      response.status(200).json({ code: "Ok", data: user });
}});



module.exports = router;