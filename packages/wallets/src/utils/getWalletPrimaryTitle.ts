import { WalletType } from '@flax-network/api';
import type { Wallet } from '@flax-network/api';

export default function getWalletPrimaryTitle(wallet: Wallet): string {
  switch (wallet.type) {
    case WalletType.STANDARD_WALLET:
      return 'Flax';
    default:
      return wallet.meta?.name ?? wallet.name;
  }
}
