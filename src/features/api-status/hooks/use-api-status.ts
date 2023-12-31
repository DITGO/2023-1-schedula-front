import { useGetUsersApiStatus } from '@/features/api-status/api/get-users-api-status';
import { useGetScheduleApiStatus } from '@/features/api-status/api/get-schedule-api-status';
import { useGetLocationsApiStatus } from '@/features/api-status/api/get-location-api-status';
import { useGetTutorialsApiStatus } from '@/features/api-status/api/get-tutorial-api-status';
import { useGetAlertsApiStatus } from '@/features/api-status/api/get-alert-api-status';

export function useAPIStatus() {
  const {
    isError: userServiceUnavailable,
    isLoading: isLoadingUsuariosStatus,
  } = useGetUsersApiStatus();
  const {
    isError: orderServiceUnavailable,
    isLoading: isLoadingChamadosStatus,
  } = useGetScheduleApiStatus();
  const {
    isError: locationServiceUnavailable,
    isLoading: isLoadingLocalidadesStatus,
  } = useGetLocationsApiStatus();
  const {
    isError: tutorialServiceUnavailable,
    isLoading: isLoadingTutoriaisStatus,
  } = useGetTutorialsApiStatus();
  const {
    isError: alertServiceUnavailable,
    isLoading: isLoadingAlertasStatus,
  } = useGetAlertsApiStatus();

  return {
    usuariosStatus: userServiceUnavailable,
    isLoadingUsuariosStatus,
    chamadosStatus: orderServiceUnavailable,
    isLoadingChamadosStatus,
    localidadesStatus: locationServiceUnavailable,
    isLoadingLocalidadesStatus,
    tutoriaisStatus: tutorialServiceUnavailable,
    isLoadingTutoriaisStatus,
    alertasStatus: alertServiceUnavailable,
    isLoadingAlertasStatus,
  };
}
