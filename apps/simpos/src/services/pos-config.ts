import { dataService } from './data';

export const posConfigService = {
  createSession(configId: number) {
    return dataService.call(
      'pos.session',
      'create',
      [
        {
          config_id: configId,
          state: 'opened',
        },
      ],
      {},
    );
  },
};
