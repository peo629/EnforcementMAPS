import { useCallback, useEffect, useState } from 'react';
import { assignmentService } from '../api/assignment.api';

export interface Assignment {
  id: string;
  zoneId: string;
  zoneName: string;
  zoneColor: string;
  status: string;
  assignedAt: string;
}

export function useAssignment() {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAssignment = useCallback(async () => {
    try {
      const data = await assignmentService.getMyAssignment();
      setAssignment(data);
    } catch {
      setAssignment(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  return { assignment, loading, refresh: fetchAssignment };
}
