import jwt from "jsonwebtoken";

const generate_token = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

const verify_token = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
};

const decode_token = (token) => {
  return jwt.decode(token);
}

export default { generate_token, verify_token, decode_token };