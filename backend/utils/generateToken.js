import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'pizza_palace_secret_key_12345', {
    expiresIn: '30d'
  });
};

export default generateToken;
