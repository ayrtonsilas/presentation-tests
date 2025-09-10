const express = require('express');
const userService = require('../services/userService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    const statusCode = error.message === 'User not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    const statusCode = error.message === 'User not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    const statusCode = error.message === 'User not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const isValid = await userService.validatePassword(email, password);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const user = await userService.getUserByEmail(email);
    
    res.json({
      success: true,
      data: user,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
