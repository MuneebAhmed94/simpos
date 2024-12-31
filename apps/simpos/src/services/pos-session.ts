/* eslint-disable @typescript-eslint/no-explicit-any */
import { dataService } from './data';

export const posSessionService = {
  getSession(sessionId: number) {
    return dataService
      .call(
        'pos.session',
        'read',
        [
          [sessionId],
          [
            'id',
            'name',
            'user_id',
            'config_id',
            'start_at',
            'stop_at',
            'sequence_number',
            'payment_method_ids',
            'login_number',
            'state',
            'order_count',
            'total_payments_amount',
            'display_name',
          ],
        ],
        {},
      )
      .then((sessions: any) => {
        if (Array.isArray(sessions) && sessions.length > 0) {
          return sessions[0];
        }
        return null;
      });
  },
  getCashEndOfLastSession() {
    return dataService
      .call(
        'pos.session',
        'search_read',
        [
          [['state', '=', 'closed']],
          ['id', 'name', 'cash_register_balance_end_real'],
          0,
          1,
          'id desc',
        ],
        {},
      )
      .then((sessions: any) => {
        if (Array.isArray(sessions) && sessions.length > 0) {
          const lastSession = sessions[0];
          return {
            sessionId: lastSession.id,
            sessionName: lastSession.name,
            cashEnd: lastSession.cashRegisterBalanceEndReal,
          };
        }
        return null;
      });
  },

  async getClosingControlData(sessionId: number) {
    try {
      const result = await dataService.call(
        'pos.session',
        'get_closing_control_data',
        [[sessionId]],
        {},
      );
      return result;
    } catch (error) {
      console.error('Error in getClosingControlData:', error);
      throw error;
    }
  },
  postClosingControlData(sessionId: number, cash_amount: number) {
    return dataService.call(
      'pos.session',
      'post_closing_cash_details',
      [[sessionId]],
      { counted_cash: cash_amount },
    );
  },
  async closeSession(sessionId: number) {
    const res = await this.getClosingControlData(sessionId);
    const cashAmount = res.defaultCashDetails.amount;
    await this.postClosingControlData(sessionId, Number(cashAmount));
    return dataService.call(
      'pos.session',
      'action_pos_session_closing_control',
      [[sessionId]],
      {},
    );
  },

  async addCashSession(
    sessionId: number,
    operation: string,
    cash_amount: number,
    reason: string,
  ) {
    await dataService.call(
      'pos.session',
      'try_cash_in_out',
      [
        [sessionId],
        operation,
        cash_amount,
        reason,
        {
          //formattedAmount: 'Rs. ' + cash_amount * 1.0,
          translatedType: operation,
        },
      ],
      {},
    );

    return dataService.call(
      'pos.session',
      'log_partner_message',
      [
        sessionId,
        null,
        `Cash ${operation} - Amount: ${cash_amount}`,
        'CASH_DRAWER_ACTION',
      ],
      {},
    );
  },
};
