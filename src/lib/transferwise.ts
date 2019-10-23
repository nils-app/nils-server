import axios, { AxiosRequestConfig, Method } from "axios";

import { TRANSFERWISE_BASE, TRANSFERWISE_API_KEY } from "../constants";

export let PROFILE_ID: number = null;

export const getTransferWiseProfile = async () => {
  try {
    const data = await transferwiseRequest('/v1/profiles', 'GET', null, true);
    if (data && data.length > 0) {
      const businessProfile = data.find((profile: any) => profile.type === 'business');
      if (businessProfile) {
        PROFILE_ID = businessProfile.id;
        console.log('Found profile id', PROFILE_ID);
      }
    }
  } catch (e) {
    console.error('Unable to get TransferWise Profile Id', e.message);
  }
};

export const transferwiseRequest = async (path: string, method: Method, data?: any, skipProfileCheck?: boolean) => {
  if (!skipProfileCheck && !PROFILE_ID) {
    throw new Error('TransferWise API not available, please try again later.');
  }
  const options: AxiosRequestConfig = {
    url: `${TRANSFERWISE_BASE}${path}`,
    method,
    timeout: 6000,
    headers: {
      'Authorization': "Bearer " + TRANSFERWISE_API_KEY,
      'Content-Type': 'application/json',
    },
    data,
  };
  const response = await axios(options);
  return await response.data;
};
