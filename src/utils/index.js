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
// const getToken = (user) => {
//   return jwt.sign(
//     {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//     },
//     config.JWT_SECRET,
//     {
//       expiresIn: "48h",
//     }
//   );
// };

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

// const isAdmin = (req, res, next) => {
//   console.log(req.user);
//   if (req.user && req.user.isAdmin) {
//     return next();
//   }
//   return res.status(401).send({ message: "Admin Token is not valid." });
// };

module.exports = {
  isAuth,
  decodedToken,
  saveAuditModel,
};

// export { getToken, isAuth, isAdmin };
