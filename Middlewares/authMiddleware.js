const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
   // console.log('Token before ',req.headers);
    const token = req.headers["authorization"].split(" ")[1];
   // console.log('Token ',token);
    JWT.verify(token, process.env.TOKEN_SECRET, (err, decode) => {
      if (err) {
        return res.status(200).send({
          message: "Auth Fialed",
          success: false,
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Auth Failed",
      success: false,
    });
  }
};