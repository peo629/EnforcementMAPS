import api from '../../shared/infra/api';

export const presenceService = {
  async connect() {
    await api.post('/presence/connect', { clientType: 'ANDROID' });
  },

  async heartbeat() {
    await api.post('/presence/heartbeat', { clientType: 'ANDROID' });
  },

  async disconnect() {
    await api.post('/presence/disconnect');
  },

  async registerDevice(expoPushToken: string, platform: string = 'ANDROID') {
    await api.post('/presence/register', {
      platform,
      expoPushToken,
    });
  },
};
