const jwt = require("jsonwebtoken");
const config = require("../config");
const Audit = require("../models/audit");

const saveAuditModel = async (auditType, _id) => {
  const audit = new Audit({
    audit: auditType,
    createdBy: _id,
  });

  await audit.save();
};

const isAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const onlyToken = token.slice(7, token.length);
    jwt.verify(onlyToken, config.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Invalid Token" });
      }
      req.user = decode;
      next();
      return;
    });
  } else {
    return res.status(401).send({ message: "Token is not supplied." });
  }
};

const decodedToken = (req) => {
  try {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(" ");
    const decoded = jwt.verify(token[1], "secretkey");
    return decoded;
  } catch (error) {
    return "";
  }
};

module.exports = {
  isAuth,
  decodedToken,
  saveAuditModel,
};
