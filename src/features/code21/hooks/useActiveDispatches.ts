import { useCallback, useEffect, useState } from 'react';
import { dispatchService, ActiveCode21 } from '../api/dispatch.api';

export function useActiveDispatches() {
  const [dispatches, setDispatches] = useState<ActiveCode21[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDispatches = useCallback(async () => {
    try {
      const data = await dispatchService.getActiveCode21s();
      setDispatches(data);
    } catch {
      setDispatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDispatches();
    const interval = setInterval(fetchDispatches, 10000);
    return () => clearInterval(interval);
  }, [fetchDispatches]);

  const acknowledge = async (code21Id: string) => {
    await dispatchService.acknowledgeCode21(code21Id);
    fetchDispatches();
  };

  return { dispatches, loading, refresh: fetchDispatches, acknowledge };
}
