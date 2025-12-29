export function notFoundHandler(req, res, next) {
  console.log("Request Not Found", req.originalUrl);
  return res.status(404).json({
    message: "Request Not Found"
  });
}

export const errorHandler = (err, req, res, next) => {
  //Schema validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ message: "Validation Error", errors: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }

  console.error(err);
  res.status(500).json({ message: "Server Error" });
};

export default errorHandler;
