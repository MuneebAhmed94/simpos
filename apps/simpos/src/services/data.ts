/* eslint-disable @typescript-eslint/no-explicit-any */
import { simApi } from './clients';
//import { authUserMeta } from './db/authUserMeta';
//import { authUserMeta } from './db';

type SimApiCallMethod =
  | 'search_read'
  | 'read'
  | 'create'
  | 'button_confirm'
  | 'get_real_tax_amount'
  | 'create_from_ui'
  | 'open_session_cb'
  | 'web_read_group'
  | 'action_pos_session_closing_control'
  | 'default_get'
  | 'write'
  | 'button_validate'
  | 'process_cancel_backorder'
  | 'process'
  | 'button_done'
  | 'button_cancel'
  | 'action_pos_session_open'
  | 'try_cash_in_out'
  | 'post_closing_cash_details'
  | 'get_closing_control_data'
  | 'log_partner_message';

interface SearchReadParams {
  model: string;
  fields?: Array<string>;
  domain?: Array<Array<any> | string>;
  order?: string;
  limit?: number;
  offset?: number;
  context?: any;
}

interface ReadParams {
  model: string;
  ids: Array<number>;
  fields?: Array<string>;
  kwargs?: any;
}

export const dataService = {
  async call(
    model: string,
    method: SimApiCallMethod,
    args: Array<any>,
    kwargs: any,
  ): Promise<Promise<any>> {
    if (kwargs) {
      kwargs.context = {
        ...kwargs.context,
      };
    }

    return simApi.post(`/odoo`, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model,
        method,
        args,
        kwargs,
      },
      id: Math.floor(Math.random() * 1000 * 1000 * 1000),
    });
  },
  searchRead({ model, ...params }: SearchReadParams): Promise<any> {
    return this.call(
      model,
      'search_read',
      [],
      Object.assign(
        {},
        {
          fields: [],
          domain: [],
          order: '',
          context: {},
        },
        params,
      ),
    );
  },

  read(params: ReadParams): Promise<any> {
    const { model, ids, kwargs, fields } = Object.assign(
      {},
      {
        fields: [],
        kwargs: {},
      },
      params,
    );
    return this.call(model, 'read', [ids, fields], kwargs);
  },

  callButton(
    model: string,
    method: string,
    args: Array<any>,
    kwargs?: any,
  ): Promise<any> {
    return simApi.post('/web/dataset/call_button', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model,
        method,
        args,
        kwargs,
      },
      id: Math.floor(Math.random() * 1000 * 1000 * 1000),
    });
  },
};
