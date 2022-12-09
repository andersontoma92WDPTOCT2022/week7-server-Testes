import express from 'express';
//import TaskModel from '../model/task.model.js';

import isAuth from '../middlewares/isAuth.js';
import attachCurrentUser from '../middlewares/attachCurrentUser.js';
import isAdmin from '../middlewares/isAdmin.js';
//
// !------------------
import CidadaoModel from '../model/cidadao.model.js';
const cidadaoRoute = express.Router();
//
// ! reincluir isAuth
cidadaoRoute.get('/all-cidadaos', async (req, res) => {
  try {
    const filter = {};
    const projection = {};
    const sort = {
      noLocal: 1,
      updatedAt: -1,
    };

    const cidadaos = await CidadaoModel.find({ projection, sort }).populate(
      'acessos'
    );

    return res.status(200).json(cidadaos);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});
//
// ! reincluir isAuth
cidadaoRoute.post('/create-cidadao/', async (req, res) => {
  try {
    const newCidadao = await CidadaoModel.create({ ...req.body });

    return res.status(201).json(newCidadao);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});
//
//
export default cidadaoRoute;
/*

*/
