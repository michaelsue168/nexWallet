import express from 'express';
const router = express.Router();
import CryptoJS from 'crypto-js';
import {
  usersCollection,
  banksCollection,
  logCollection,
  investCollection,
  pendingCollection
} from '../index.mjs';


function mountBankEndpoints(router) {

  router.post('/add', async (req, res) => {
    const user = req.body.user;
    const bankdata = req.body.bankMetadata;
    const fakexrpdata = req.body.fakexrpdata
    // console.log(fakexrpdata);
    try {
      let findUser = await usersCollection.findOne({ publicKey: user });
      if (!findUser) {
        return res.status(200).json({ message: "This public Key is NOT been register", code: '1' });
      } else {
        const insertResult = await banksCollection.insertOne({
          bankName: bankdata.bankName,
          bankCode: bankdata.bankCode,
          currency: bankdata.currency,
          address: bankdata.address,
          type: bankdata.type,
          xrpaddress: fakexrpdata.address,
          xrppublickey: fakexrpdata.publicKey,
          amount: parseFloat(fakexrpdata.xRPbalance),
          encryptedData: fakexrpdata.encryptedData,
          user: user,
          created_at: new Date()
        });
        let getbankdata = await banksCollection.find({ "user": user }).toArray();
        return res.status(200).json({ message: "Geted user info", onbankdata: getbankdata });
      }
    } catch (error) {
      console.log(error);
    }

  });

  router.post('/get', async (req, res) => {
    const user = req.body.user;
    try {
      let findUser = await usersCollection.findOne({ publicKey: user });

      if (!findUser) {
        return res.status(200).json({ message: "This public Key is NOT been register", code: '1' });
      } else {
        let getbankdata = await banksCollection.find({ "user": user }).toArray();
        return res.status(200).json({ message: "Geted user info", onbankdata: getbankdata });
      }
    } catch (error) {
      console.log(error);
    }

  });

  router.post('/fixed', async (req, res) => {
    const data = req.body.fixedMetadata;

    const insertResult = await investCollection.insertOne({
      user: data.User,
      address: data.Address,
      rate: data.Rate,
      type: 'fixed',
      created_at: new Date()
    });
    return res.status(200).json({ message: "Success" });
  });

  router.post('/getfixed', async (req, res) => {
    const user = req.body.user;
    try {
      let getfixeddata = await investCollection.find({ "user": user, "type": 'fixed' }).toArray();
      return res.status(200).json({ message: "Geted", onFdata: getfixeddata });
    } catch (error) {
      console.log(error);
    }
  });

  router.post('/getTo', async (req, res) => {
    const user = req.body.to;
    try {
      let gettodata = await banksCollection.findOne({ "address": user });
      console.log(gettodata);
      return res.status(200).json({ message: "Geted", todata: gettodata });
    } catch (error) {
      console.log(error);
    }

  });

  router.post('/pending', async (req, res) => {
    const user = req.body.user;
    try {
      let getpendingdata = await pendingCollection.find({ "user": user }).toArray();
      console.log(user, getpendingdata);
      return res.status(200).json({ message: "Geted", onPdata: getpendingdata });
    } catch (error) {
      console.log(error);
    }

  });

  router.post('/getlog', async (req, res) => {
    const user = req.body.user;
    try {
      let getlogdata = await logCollection.find({ "user": user }).toArray();
      console.log(user, getlogdata);
      return res.status(200).json({ message: "Geted", onLdata: getlogdata });
    } catch (error) {
      console.log();
    }

  });

}
export { mountBankEndpoints };