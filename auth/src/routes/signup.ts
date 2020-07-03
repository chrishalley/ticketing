import { Router } from "express";
import { body } from 'express-validator';
import jwt from 'jsonwebtoken'

import { User } from '../models/user'

import { BadRequestError, validateRequest } from "@chtickets/common";

const router = Router();

router
  .route("/api/users/signup")
  .post(
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
    validateRequest,
    async (req, res) => {      
      const { email, password } = req.body
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError('Email already in use')
      }

      const user = User.build({ email, password })
      await user.save();

      // Gen jwt
      const token = jwt.sign({
        id: user.id,
        email: user.email
      }, process.env.JWT_KEY!);

      // Store on session object in cookie
      req.session = {
        jwt: token
      };

      res.status(201).send(user);
    }
  );

export { router as signupRouter };
