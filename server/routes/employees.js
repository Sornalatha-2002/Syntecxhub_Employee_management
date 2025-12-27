const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');

// Validation rules
const employeeValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('role').trim().notEmpty().withMessage('Role is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('salary').isNumeric().withMessage('Salary must be a number').custom(value => value >= 0).withMessage('Salary cannot be negative')
];

// @route   GET /api/employees
// @desc    Get all employees
router.get('/', async (req, res, next) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/employees/:id
// @desc    Get single employee
router.get('/:id', async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }
        res.json({
            success: true,
            data: employee
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/employees
// @desc    Create new employee
router.post('/', employeeValidation, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const employee = await Employee.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: employee
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        next(error);
    }
});

// @route   PUT /api/employees/:id
// @desc    Update employee
router.put('/:id', employeeValidation, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.json({
            success: true,
            message: 'Employee updated successfully',
            data: employee
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        next(error);
    }
});

// @route   DELETE /api/employees/:id
// @desc    Delete employee
router.delete('/:id', async (req, res, next) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.json({
            success: true,
            message: 'Employee deleted successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
