import express from 'express';
const router = express.Router();
import CryptoJS from 'crypto-js';
import { banksCollection, logCollection, investCollection, pendingCollection } from '../index.mjs';


function mountTransferEndpoints(router) {

  router.post('/sendxrp', async (req, res) => {
    const TransferData = req.body.TransferMETAData;
    try {
      let fromUser = await banksCollection.findOne({ address: TransferData.From });
      let toUser = await banksCollection.findOne({ address: TransferData.To });

      if (!fromUser || !toUser) {
        return res.status(401).json({ message: "Can't find", code: '1' });
      } else {
        await banksCollection.updateOne({
          address: TransferData.From
        }, {
          $set: {
            amount: Number(TransferData.FBalance),
          }
        });

        await banksCollection.updateOne({
          address: TransferData.To
        }, {
          $set: {
            amount: Number(TransferData.Tbalance),
          }
        });

        await logCollection.insertOne({
          user: TransferData.User,
          from: TransferData.From,
          to: TransferData.To,
          payAmount: TransferData.PayAmount,
          convertAmount: TransferData.ConvertAmount,
          currency: TransferData.Currency,
          FBalance: TransferData.FBalance,
          Tbalance: TransferData.Tbalance,
          created_at: new Date()
        });
        return res.status(200).json({ message: "Success !" });
      }
    } catch (error) {
      console.log(error);
    }
  });

  router.post('/change', async (req, res) => {
    const changedata = req.body.changeMetadata;
    try {
      let findTo = await banksCollection.findOne({ "address": changedata.To.trim() })
      if (!findTo) {
        return res.status(400).json({ message: "Destination address not found" });
      } else {
        await banksCollection.updateOne({
          address: changedata.From
        }, {
          $inc: {
            amount: -Number(changedata.PayAmount),
          }
        });
        let rate = await investCollection.find({ "user": findTo.user }).toArray();
        if (rate.length > 0) {
          for (let i = 0; i < rate.length; i++) {
            console.log(rate);
            console.log(rate[i].address);
            await banksCollection.updateOne({
              address: rate[i].address
            }, {
              $inc: {
                amount: Number(changedata.ConvertAmount * (rate[i].rate / 100)),
              }
            });
          }
          await banksCollection.updateOne({
            address: changedata.To
          }, {
            $inc: {
              amount: +Number(changedata.ConvertAmount - (changedata.ConvertAmount * (rate[0].rate / 100))),
            }
          });

        } else {
          await banksCollection.updateOne({
            address: changedata.To
          }, {
            $inc: {
              amount: +Number(changedata.ConvertAmount),
            }
          });
        }
        return res.status(200).json({ message: "Success !" });
      }
    } catch (error) {
      console.log(error);
    }
  });
  
  router.post('/send', async (req, res) => {
    const TransferData = req.body.TransferMETAData;
    try {
      let fromUser = await banksCollection.findOne({ address: TransferData.From });
      let toUser = await banksCollection.findOne({ address: TransferData.To });


      if (!fromUser || !toUser) {
        return res.status(401).json({ message: "Can't find", code: '1' });
      } else {
        await banksCollection.updateOne({
          address: TransferData.From
        }, {
          $set: {
            amount: Number(TransferData.FBalance),
          }
        });
        await banksCollection.updateOne({
          address: TransferData.To
        }, {
          $set: {
            amount: Number(TransferData.Tbalance),
          }
        });
        let rate = await investCollection.find({ "user": toUser.user, "type": 'fixed' }).toArray();
        if (rate.length > 0) {
          for (let i = 0; i < rate.length; i++) {

            await pendingCollection.insertOne({
              user: rate[i].user,
              address: rate[i].address,
              rate: rate[i].rate,
              amount: Number(TransferData.PayAmount) * (rate[i].rate / 100),
              from: TransferData.From,
              to: TransferData.To,
              totalamount: TransferData.PayAmount,
              created_at: new Date()
            });
          }
        }
        await logCollection.insertOne({
          user: TransferData.User,
          from: TransferData.From,
          to: TransferData.To,
          payAmount: TransferData.PayAmount,
          convertAmount: TransferData.ConvertAmount,
          currency: TransferData.Currency,
          FBalance: TransferData.FBalance,
          Tbalance: TransferData.Tbalance,
          created_at: new Date()
        });
        return res.status(200).json({ message: "Success !" });
      }
    } catch (error) {
      console.log(error);
    }
  });

}
export { mountTransferEndpoints };