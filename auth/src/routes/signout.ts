import { Router } from "express";
import {  } from 'cookie-session';

const router = Router();

router.route("/api/users/signout").post((req, res) => {
  req.session = null;
  res.send({})
});

export { router as signoutRouter };
