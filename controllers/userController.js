var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  User = mongoose.model('User');

exports.register = function(req, res) {
  var newUser = new User(req.body);
  console.log(newUser);
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function(err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      user.hash_password = undefined;
      return res.json(user);
    }
  });
};

exports.sign_in = function(req, res) {
  console.log(req.body);
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user || !user.comparePassword(req.body.password)) {
      return res.json({ message: 'Authentication failed. Invalid user or password.' });
    }
    return res.json({
      token: jwt.sign(
        {
          email: user.email,
          fullName: user.fullName,
          EmployeeID: user.EmployeeID,
          _id: user._id,
        },
        "RESTFULAPIs"
      ),
      EmployeeID: user.EmployeeID,
      fullName: user.fullName,
    });
  });
};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {

    return res.status(401).json({ message: 'Unauthorized user!!' });
  }
};
exports.profile = function(req, res, next) {
  if (req.user) {
    res.send(req.user);
    next();
  } 
  else {
   return res.status(401).json({ message: 'Invalid token' });
  }
};


exports.getUserByEmployeeID = async (req, res) => {
  try {
    const { employeeID } = req.params;
    const user = await User.findOne({ EmployeeID: employeeID });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      fullName: user.fullName,
    });
  } catch (err) {
    console.error("Error getting user information", err);
    return res.status(500).json({ message: "Error getting user information" });
  }
};
