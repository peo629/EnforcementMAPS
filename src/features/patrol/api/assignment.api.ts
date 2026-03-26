import api from '../../../shared/infra/api';

export interface AssignmentData {
  id: string;
  zoneId: string;
  zoneName: string;
  zoneColor: string;
  status: string;
  assignedAt: string;
}

export const assignmentService = {
  async getMyAssignment(): Promise<AssignmentData | null> {
    const response = await api.get<{ data: AssignmentData | null }>('/officer/me/assignment');
    return response.data;
  },
};
