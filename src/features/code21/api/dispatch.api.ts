import api from '../../../shared/infra/api';

export interface ActiveCode21 {
  id: string;
  addressLabel: string;
  latitude: number;
  longitude: number;
  zoneId: string | null;
  zoneName: string | null;
  offenceType: string;
  code21Type: string;
  description: string;
  dispatchNotes: string;
  travelMode: string;
  status: string;
  requestTime: string;
  createdAt: string;
}

export const dispatchService = {
  async getActiveCode21s(): Promise<ActiveCode21[]> {
    const response = await api.get<{ data: ActiveCode21[] }>('/officer/me/code21/active');
    return response.data;
  },

  async acknowledgeCode21(code21Id: string): Promise<{ message: string }> {
    return api.post<{ message: string }>(`/officer/me/code21/${code21Id}/acknowledge`);
  },

  async logCode2(notes?: string): Promise<{ id: string; zoneId: string }> {
    const response = await api.post<{ data: { id: string; zoneId: string } }>('/officer/me/status/code2', { notes });
    return response.data;
  },
};
