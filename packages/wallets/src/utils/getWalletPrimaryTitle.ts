import { WalletType } from '@flax/api';
import type { Wallet } from '@flax/api';

export default function getWalletPrimaryTitle(wallet: Wallet): string {
  switch (wallet.type) {
    case WalletType.STANDARD_WALLET:
      return 'Flax';
    default:
      return wallet.name;
  }
}
