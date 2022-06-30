import { useMemo } from 'react';
import type { Wallet } from '@flax/api';
import { WalletType } from '@flax/api';
import BigNumber from 'bignumber.js';
import { mojoToCATLocaleString, mojoToFlaxLocaleString, useLocale } from '@flax/core';

export default function useWalletHumanValue(wallet: Wallet, value?: string | number | BigNumber, unit?: string): string {
  const [locale] = useLocale();
  
  return useMemo(() => {
    if (wallet && value !== undefined) {
      const localisedValue = wallet.type === WalletType.CAT
        ? mojoToCATLocaleString(value, locale)
        : mojoToFlaxLocaleString(value, locale);

      return `${localisedValue} ${unit}`;
    }

    return '';
  }, [wallet, value, unit, locale]);
}
