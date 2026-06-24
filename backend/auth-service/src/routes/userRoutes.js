import express from "express";
import { login, logout, refresh, signup } from "../controllers/userController.js";

const route = express.Router();

route.post("/signup", signup);
route.post("/login", login);
route.post("/logout", logout);
route.post("/refresh", refresh);

export default route;