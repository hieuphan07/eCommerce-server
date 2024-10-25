const User = require('../models/user');

const bcrypt = require('bcrypt');

exports.postSignup = async (req, res, next) => {
  const { email, password, fullname, phone } = req.body;
  try {
    const existedUser = await User.findOne({ email: email });
    if (existedUser) {
      return res.status(422).json({ error: { message: 'E-mail exists already.' } });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      fullname: fullname,
      phone: phone,
    });
    user.save();
    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.log(err);
  }
};

exports.getLogin = async (req, res, next) => {
  if (req.session.user) {
    res.status(200).json({ userInfo: req.session.user });
  } else {
    res.status(401).json({ error: { message: 'Not Authenticated' } });
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const matchedUser = await User.findOne({ email: email });
    if (!matchedUser) {
      return res.status(422).json({ error: { message: 'Invalid email or password.' } });
    }
    const isPassword = await bcrypt.compare(password, matchedUser.password);
    if (!isPassword) {
      return res.status(422).json({ error: { message: 'Invalid email or password.' } });
    } else {
      const { password, ...rest } = matchedUser._doc;
      const userInfo = Object.assign({}, { ...rest });

      req.session.user = userInfo;
      req.session.save((err) => {
        if (err) return console.log(err);
        res.status(200).json({ message: 'Authentication successfull', userInfo });
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) console.log(err);
      res.json({ message: 'Session destroyed' });
    });
  } catch (err) {
    console.log(err);
  }
};

