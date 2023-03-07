import { useGetFarmedAmountQuery } from '@flax-network/api-react';
import { useCurrencyCode, mojoToFlaxLocaleString, CardSimple, useLocale } from '@flax-network/core';
import { Trans } from '@lingui/macro';
import React, { useMemo } from 'react';

export default function FarmCardTotalFlaxFarmed() {
  const currencyCode = useCurrencyCode();
  const [locale] = useLocale();
  const { data, isLoading, error } = useGetFarmedAmountQuery();

  const farmedAmount = data?.farmedAmount;

  const totalFlaxFarmed = useMemo(() => {
    if (farmedAmount !== undefined) {
      return (
        <>
          {mojoToFlaxLocaleString(farmedAmount, locale)}
          &nbsp;
          {currencyCode}
        </>
      );
    }
    return undefined;
  }, [farmedAmount, locale, currencyCode]);

  return (
    <CardSimple title={<Trans>Total Flax Farmed</Trans>} value={totalFlaxFarmed} loading={isLoading} error={error} />
  );
}
