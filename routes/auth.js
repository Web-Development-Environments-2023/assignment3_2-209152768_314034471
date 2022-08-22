var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");

router.post("/Register", async (req, res, next) => {
  try {
    if (
      !req.body.firstname ||
      !req.body.lastname ||
      !req.body.email ||
      !req.body.username ||
      !req.body.password ||
      !req.body.country
    ) {
      throw { status: 500, message: "one or more of the details is missing" };
    }
    let user_details = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      country: req.body.country,
      password: req.body.password,
      email: req.body.email
    }
    let users = [];
    users = await DButils.execQuery("SELECT username from users");

    if (users.find((x) => x.username === user_details.username))
      throw { status: 409, message: "Please select a different username!" };
    if(req.body.password != req.body.confirmation_password) {
      console.log("pwd validation", req.body.password, req.body.confirmation_password);
      throw { status: 500, message: "The password is wrong!" };
    }
    // add the new username
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO users(username, first_name, last_name, country, password, email) 
      VALUES ('${user_details.username}', '${user_details.firstname}', '${user_details.lastname}',
      '${user_details.country}', '${hash_password}', '${user_details.email}')`
    );
    res.status(200).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    if (req.session && req.session.user_id)
    {
      res.send({ success: false, status: 200, message: "User is already login!"});
      return;
    }
    // check that username exists
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = '${req.body.username}'`
      )
    )[0];

    if (!user)
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.id;

    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;