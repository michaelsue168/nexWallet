import express from 'express';
import CryptoJS from 'crypto-js';
import { usersCollection, banksCollection } from '../index.mjs';

const router = express.Router();
let currentUser = '';
function mountUserEndpoints(router) {

  router.post('/signup', async (req, res) => {

    console.log(usersCollection);
    const auth = req.body.authMetadata;
    const bankdata = req.body.bankMetadata;
    const fakexrpdata = req.body.fakexrpdata
    try {
      let findUser = await usersCollection.findOne({ publicKey: auth.publicKey });

      if (findUser) {
        currentUser = findUser._id
        return res.status(200).json({ message: "This public Key is already been register", code: '1' });
      } else {
        const insertResult1 = await usersCollection.insertOne({
          nickname: auth.nickname,
          email: auth.email,
          country: auth.country,
          server: auth.server,
          address: auth.address,
          publicKey: auth.publicKey,
          encryptedData: auth.encryptedData,
          created_at: new Date()
        });
        const insertResult2 = await banksCollection.insertOne({
          bankName: bankdata.bankName,
          bankCode: bankdata.bankCode,
          currency: bankdata.currency,
          address: bankdata.address,
          type: bankdata.type,
          xrpaddress: fakexrpdata.address,
          xrppublickey: fakexrpdata.publicKey,
          amount: parseFloat(fakexrpdata.xRPbalance),
          encryptedData: fakexrpdata.encryptedData,
          user: auth.publicKey,
          created_at: new Date()
        });
        const insertResult3 = await banksCollection.insertOne({
          bankName: 'XRP',
          bankCode: '130',
          currency: 'XRP',
          address: auth.address,
          type: auth.type,
          xrpaddress: auth.address,
          xrppublickey: auth.publicKey,
          amount: parseFloat(auth.xRPbalance),
          encryptedData: auth.encryptedData,
          user: auth.publicKey,
          created_at: new Date()
        });
        currentUser = await usersCollection.findOne(insertResult1.insertedId);
      }
      req.session.currentUser = currentUser;
      return res.status(200).json({ message: "Geted user info", userinfo: auth });
    } catch (error) {
      console.log(error);
    }
  });

  router.post('/login', async (req, res) => {
    const pbk = req.body.pbk;
    const epwd = req.body.pwd;
    const decryptedData = CryptoJS.AES.decrypt(epwd, pbk).toString(CryptoJS.enc.Utf8);
    try {


      let findUser = await usersCollection.findOne({ publicKey: pbk });
      if (findUser) {
        try {
          const decryptedED = CryptoJS.AES.decrypt(findUser.encryptedData, decryptedData).toString(CryptoJS.enc.Utf8);
          currentUser = findUser
          req.session.currentUser = currentUser;
          return res.status(200).json({ message: "Sucess", userinfo: findUser });
        } catch (error) {
          // console.log(error)
          return res.status(401).json({ message: "Incorrect password" });
        }
      } else {
        return res.status(401).json({ message: "Can't find" });
      }
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/logout', async (req, res) => {
    req.session.currentUser = null;
    return res.status(200).json({ message: "User signed out" });
  });
}
export { mountUserEndpoints };