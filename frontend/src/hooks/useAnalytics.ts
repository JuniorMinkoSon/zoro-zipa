import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../api/services';

export const useAnalytics = () =>
  useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: analyticsService.getDashboard,
  });
