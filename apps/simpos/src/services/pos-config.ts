import { dataService } from './data';
import { posSessionService } from './pos-session';

export const posConfigService = {
  async createSession(configId: number) {
    console.log('====> Fetching cash end of the last session');

    let cashCount = 0;

    try {
      const lastSession = await posSessionService.getCashEndOfLastSession();
      if (lastSession && lastSession.cashEnd !== undefined) {
        cashCount = lastSession.cashEnd;
      }
    } catch (error) {
      console.error('Error fetching cash end of last session:', error);
    }

    return dataService.call(
      'pos.session',
      'create',
      [
        {
          config_id: configId,
          state: 'opened',
          cash_register_balance_start: cashCount,
        },
      ],
      {},
    );
  },
};
