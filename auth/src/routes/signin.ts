import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { User } from '../models/user'
import { validateRequest, BadRequestError } from '@chtickets/common'
import { Password } from '../services/password'

const router = Router();

router
  .route("/api/users/signin")
  .post(
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password'),
    validateRequest,
    async (req, res) => {
      const { email, password } = req.body

      const existingUser = await User.findOne({ email })
      if (!existingUser) {
        throw new BadRequestError('Email or password is incorrect');
      }

      const match = await Password.compare(existingUser.password, password);
      if (!match) {
        throw new BadRequestError('Email or password is incorrect');
      }

      // Gen jwt
      const token = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
      }, process.env.JWT_KEY!);

      // Store on session object in cookie
      req.session = {
        jwt: token
      };

      res.status(200).send(existingUser);
    }
  )

  export { router as signinRouter }