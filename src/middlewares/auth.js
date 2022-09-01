/* eslint-disable no-undef */

module.exports = function authenticateReq(req, res, next) {
  if (req.headers["x-key"]) {
    if (
      req.headers["x-key"] === "cfd95e5924e46c0015032a3434cd4266876d60d0" ||
      req.headers["x-key"] === "1ee52f070c8c135a67406ff25ac180e65977e098" ||
      req.headers["x-key"] === "dfg65d4g65d4fg65d4sg4df4g5df1g56fdg6fd4d"
    ) {
      next();
    } else {
      res.status(401).send({ err: "Invalid API Key", data: null });
    }
  } else {
    res.status(401).send({ err: "Key not found", data: null });
  }
};
