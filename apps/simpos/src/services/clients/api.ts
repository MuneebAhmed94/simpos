import axios from 'axios';
import get from 'lodash.get';
import camelcaseKeys from 'camelcase-keys';
import { AuthUserMeta } from '../db';

export const simApi = axios.create({
  baseURL: 'http://localhost:4005/v1/ping',
});

simApi.interceptors.response.use(
  async function (response) {
    if (response.data.error) {
      throw new Error(
        get(response, 'data.error.data.message', 'Request error'),
      );
    }

    return camelcaseKeys(get(response, 'data', {}), {
      deep: true,
    });
  },
  function (error) {
    console.error('ODOO', error);
    // if (error.response?.data?.includes('odoo.http.SessionExpiredException')) {
    //   throw new Error('Unauthorized error');
    // }
    throw new Error('Uncaught error:' + error?.message);
  },
);

export const updateSimApiToken = (meta: AuthUserMeta) => {
  if (!meta.accessToken) {
    console.warn('token is blank or undefined');
  }
  simApi.defaults.headers.common['Authorization'] =
    `Bearer ${meta.accessToken}`;
};
