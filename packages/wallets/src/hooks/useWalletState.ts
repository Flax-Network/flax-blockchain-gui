import { useGetSyncStatusQuery } from '@flax/api-react';
import { SyncingStatus } from '@flax/api';
import getWalletSyncingStatus from '../utils/getWalletSyncingStatus';

export default function useWalletState(): {
  isLoading: boolean;
  state?: SyncingStatus;
} {
  const { data: walletState, isLoading } = useGetSyncStatusQuery();

  return {
    isLoading,
    state: walletState && getWalletSyncingStatus(walletState),
  }
}
