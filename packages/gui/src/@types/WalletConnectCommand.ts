import { type ServiceName } from '@flax-network/api';
import { ReactNode } from 'react';

import type WalletConnectCommandParam from './WalletConnectCommandParam';

type WalletConnectCommand = {
  command: string;
  label: ReactNode;
  service: ServiceName;
  allFingerprints?: boolean;
  waitForSync?: boolean;
  params?: WalletConnectCommandParam[];
  bypassConfirm?: boolean;
};

export default WalletConnectCommand;
