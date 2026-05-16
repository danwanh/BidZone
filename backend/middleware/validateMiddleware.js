import Joi from "joi";

export const validate = (schemas) => (req, res, next) => {
  try {
    req.validated = {};

    const validateField = (schema, data) => {
      const { error, value } = schema.validate(data, { abortEarly: false });
      if (error) {
        return {
          errors: error.details.map((e) => ({
            path: e.path.join("."),
            message: e.message,
            type: e.type,
          })),
        };
      }
      return { value };
    };

    // Body
    if (schemas.body) {
      const result = validateField(schemas.body, req.body);
      if (result.errors)
        return res
          .status(400)
          .json({ message: "Invalid input", errors: result.errors });
      req.validated.body = result.value;
    }

    // Params
    if (schemas.params) {
      const result = validateField(schemas.params, req.params);
      if (result.errors)
        return res
          .status(400)
          .json({ message: "Invalid input", errors: result.errors });
      req.validated.params = result.value;
    }

    // Query
    if (schemas.query) {
      const result = validateField(schemas.query, req.query);
      if (result.errors)
        return res
          .status(400)
          .json({ message: "Invalid input", errors: result.errors });
      req.validated.query = result.value;
    }

    next();
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Unknown Error", errors: [] });
  }
};

