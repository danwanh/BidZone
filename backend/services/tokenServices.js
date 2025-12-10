import jwt from "jsonwebtoken";

export const generateTokens = (user) => {
  try {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_SECRET,
      { expiresIn: process.env.accessTokenExpiry }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_SECRET,
      { expiresIn: process.env.refreshTokenExpiry }
    );

    return { accessToken, refreshToken };
  } catch (err) {
    console.error("Error generating tokens:" + err);
    throw err;
  }
};
