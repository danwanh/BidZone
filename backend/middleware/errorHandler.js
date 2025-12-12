// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ message: "Validation Error", errors: messages });
  }

  if (err.code === 11000) {
    // duplicate key error
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }

  console.error(err);
  res.status(500).json({ message: "Server Error" });
};

export default errorHandler;
