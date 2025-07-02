const express = require('express');
const router = express.Router();
const { Signup, Signin , UpdateUserDetails} = require('../controllers/authController');

router.post('/signup', Signup);
router.post('/signin', Signin);
router.patch('/update/:userId',UpdateUserDetails)

module.exports = router;