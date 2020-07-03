import { Router } from "express";

import { currentUser } from "@chtickets/common";

const router = Router();

router.route("/api/users/currentuser").get(
  currentUser,
  (req, res) => {
    res.send({ currentUser: req.currentUser || null })
  }
);

export { router as currentUserRouter };
