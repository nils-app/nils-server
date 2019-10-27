import { Response, Request } from 'express'
import uuid from 'uuid/v4';

import errors from '../../lib/error';
import { transferwiseRequest, PROFILE_ID } from '../../lib/transferwise';
import db from '../../db';
import { NILS_GBP_RATIO } from '../../constants';

export default async (req: Request, res: Response) => {
  try {
    const twData = await db.query('SELECT transferwise_id FROM users WHERE uuid = $1', [req.user.uuid]);

    if (!PROFILE_ID || twData.rows.length < 1) {
      return errors(res)(400, 'You need to setup your account for payouts first.');
    }

    const targetAccount = twData.rows[0].transferwise_id;

    // TODO Get this values programaticlaly
    const BALANCE_NILS = 1000;
    const targetCurrency = 'GBP';
    // -------------------------------------
    const balanceGbp = BALANCE_NILS * NILS_GBP_RATIO;

    const payload = { 
      profile: PROFILE_ID,
      source: "GBP",
      target: targetCurrency,
      rateType: "FIXED",
      sourceAmount: balanceGbp,
      type: "BALANCE_PAYOUT"
    };

    const quote = await transferwiseRequest('/v1/quotes', 'POST', payload);
    const targetAmount = quote.targetAmount;
    const customerTransactionId = uuid();

    console.log('tw quote', quote);

    const deliveryDateEstimate = quote.deliveryEstimate;

    const transferRequirements = await transferwiseRequest('/v1/transfer-requirements', 'POST', { 
      "targetAccount": targetAccount,
      "quote": quote.id,
      "details": {
        "reference": "NILS",
        "sourceOfFunds": "verification.source.of.funds.other",
        "sourceOfFundsOther": "Tips from web platform"
      },
      "customerTransactionId": customerTransactionId,
    });

    console.log('tx reqs');
    console.log(JSON.stringify(transferRequirements, null, '  '));

    // TODO Implement requirements validation

    const transfer = await transferwiseRequest('/v1/transfers', 'POST', { 
      "targetAccount": targetAccount,   
      "quote": quote.id,
      "customerTransactionId": customerTransactionId,
      "details" : {
          "reference" : "NILS",
          "transferPurpose": "verification.transfers.purpose.pay.bills",
          "sourceOfFunds": "verification.source.of.funds.other"
        } 
      }
    );

    console.log('transfer', transfer);

    const transferId = transfer.id;

    console.log('store payout in db', BALANCE_NILS, targetAmount, targetCurrency);

    const nilsTransfer = await db.query('INSERT INTO payouts(uuid, user_id, tx_id, amount_nils, amount_fiat, currency, estimated_on) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING uuid', [
      customerTransactionId,
      req.user.uuid,
      transferId,
      BALANCE_NILS,
      targetAmount,
      targetCurrency,
      deliveryDateEstimate,
    ]);

    if (nilsTransfer.rows.length < 1) {
      return errors(res)(400, 'Unable to generate internal payout reference');
    }

    // Transaction executed, lets fund it
    const fundTransfer = await transferwiseRequest(`/v3/profiles/${PROFILE_ID}/transfers/${transferId}/payments`, 'POST', { 
        "type": "BALANCE"   
      }
    );

    if (fundTransfer.status === 'COMPLETED') {
      res.json({
        transactionId: customerTransactionId,
        deliveryEstimate: quote.deliveryEstimate,
      })
    } else {
      return errors(res)(400, 'Unable to fund transaction. Please try again later.');
    }
  } catch (e) {
    if (e.response && e.response.data) {
      console.log(e.response.data);
    }
    return errors(res)(400, e.message);
  }
}

const getTransferWiseProfile = async () => {

};
