import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'express-async-errors';
// import * as Users from '../models/auth.js';
import { config } from '../config/config.js';
import {Router} from "express";
import db from '../models/index.js';
const userRouter = Router();


export async function signup(req, res, next) {
  const { phoneNum, password, name, email, role} = req.body;
  const found = await  db['Users'].findByUsername(name);
  if (found) {
    return res.status(409).json({ message: `${name} already exists`});
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await  db['Users'].createUser({
    // userId = user.id
    email,
    password: hashed,
    name,
    phoneNum,
    role,
  });
  const token = createJwtToken(userId);
  res.status(201).json({ token, name });
}


export async function login(req, res, next) {
  const { username, password } = req.body;
  const user = await  db['Users'].findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const isValidPassword = bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const token = createJwtToken(user.id);
  res.status(200).json({ token, username });
}

export async function me(req, res, next) {
  const user = await  db['Users'].findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, name: user.name });
}

const createJwtToken = (id) => {
  return jwt.sign({ id }, config.jwt, {
    expiresIn: 1000,
  });
};

export async function totalUser(req, res, next){
  const users = await db['Users'].findAll();
  if(!users) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(users);
}


export {userRouter};