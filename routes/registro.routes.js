import express from 'express';
import RegistroModel from '../model/registro.model.js';
import CidadaoModel from '../model/cidadao.model.js';
import isAuth from '../middlewares/isAuth.js';

const registroRoute = express.Router();
//
// nova entrada
// !gerar senha
// ? {hora}
// ! reincluir isAuth
registroRoute.post('/create-registro/:idCidadao', async (req, res) => {
  try {
    const { idCidadao } = req.params;
    //
    // protocolo
    const numProtocolo = await RegistroModel.find({});
    console.log(numProtocolo.length, '<-- protocolo');
    //hora de entrada, local , serviço, obs no req, inclui id do cidadao
    const newRegistro = await RegistroModel.create({
      ...req.body,
      cidadaoID: idCidadao,
      protocolo: numProtocolo.length + 1,
    });

    // anotar nos acessos do cidadao
    const cidadaoUpdated = await CidadaoModel.findByIdAndUpdate(
      idCidadao,
      {
        $push: {
          acessos: { $each: [newRegistro._id], $position: 0 },
        },
      },
      { new: true, runValidators: true }
    );

    // ? precisa de uma variável? incluir acima?
    await CidadaoModel.findByIdAndUpdate(idCidadao, {
      noLocal: true,
    });

    return res.status(201).json(newRegistro);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});
//

/* 
 await UserModel.findByIdAndUpdate(
      idUser,
      {
        $push: {
          acessos: { $each: [newRegistro._id], $position: 0 },
        },
      },
      { new: true, runValidators: true }
    );
*/

//
// ! saida
// ! reincluir isAuth
registroRoute.put('/saida/:idCidadao', async (req, res) => {
  try {
    const { idCidadao } = req.params;
    const horaSaida = req.body.saida;
    //
    // ! tentando achar cidadao-> registro
    //const cidadao = await CidadaoModel.findById(idCidadao);
    const cidadaoUpdated = await CidadaoModel.findByIdAndUpdate(idCidadao, {
      noLocal: false,
    });

    const registroZeroID = cidadaoUpdated.acessos[0]._id;
    console.log(registroZeroID, '<-- registro 0');
    await RegistroModel.findByIdAndUpdate(
      registroZeroID,
      {
        saida: horaSaida,
      },

      { new: true, runValidators: true }
    );

    //anotar nos acessos do cidadao
    /* 
    const cidadaoUpdated = await CidadaoModel.findByIdAndUpdate(
      idCidadao,
      {
        'acessos[0].saida': horaSaida,
      },

      { new: true, runValidators: true }
    );
 */

    // ? precisa de uma variável?

    //const cidadaoUpdated = await CidadaoModel.findById(idCidadao);

    return res.status(201).json(cidadaoUpdated);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

//
//
// ! status
// ! reincluir isAuth
registroRoute.put('/status/:idCidadao', async (req, res) => {
  try {
    const { idCidadao } = req.params;
    const horaSaida = req.body.saida;
    //
    // ! tentando achar cidadao-> registro
    const cidadaoInicial = await CidadaoModel.findById(idCidadao);
    if (cidadaoInicial.status === 'aguardando') {
      const cidadao = await CidadaoModel.findByIdAndUpdate(idCidadao, {
        status: 'atendimento',
      });
    }
    if (cidadaoInicial.status === 'atendimento') {
      const cidadao = await CidadaoModel.findByIdAndUpdate(idCidadao, {
        noLocal: false,
        status: 'finalizado',
      });
    }

    /*   
    const cidadao = await CidadaoModel.findByIdAndUpdate(idCidadao, {
      noLocal: false,
    });
 */
    const registroZeroID = cidadaoInicial.acessos[0]._id;
    console.log(registroZeroID, '<-- registro 0');
    await RegistroModel.findByIdAndUpdate(
      registroZeroID,
      {
        saida: horaSaida,
      },

      { new: true, runValidators: true }
    );

    //anotar nos acessos do cidadao
    /* 
      const cidadaoUpdated = await CidadaoModel.findByIdAndUpdate(
        idCidadao,
        {
          'acessos[0].saida': horaSaida,
        },
  
        { new: true, runValidators: true }
      );
   */

    // ? precisa de uma variável?

    //const cidadaoUpdated = await CidadaoModel.findById(idCidadao);

    return res.status(201).json(cidadaoInicial);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

//
//

export default registroRoute;
