import type { Wallet } from '@flax/api';
import { WalletType } from '@flax/api';
import { mojoToCATLocaleString, mojoToFlaxLocaleString } from '@flax/core';

export default function getWalletHumanValue(wallet: Wallet, value: number): string {
  return wallet.type === WalletType.CAT
    ? mojoToCATLocaleString(value)
    : mojoToFlaxLocaleString(value);
}
