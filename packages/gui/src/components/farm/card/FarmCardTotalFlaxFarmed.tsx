import React, { useMemo } from 'react';
import { Trans } from '@lingui/macro';
import { useCurrencyCode, mojoToFlaxLocaleString, CardSimple } from '@flax/core';
import { useGetFarmedAmountQuery } from '@flax/api-react';

export default function FarmCardTotalFlaxFarmed() {
  const currencyCode = useCurrencyCode();
  const { data, isLoading, error } = useGetFarmedAmountQuery();

  const farmedAmount = data?.farmedAmount;

  const totalFlaxFarmed = useMemo(() => {
    if (farmedAmount !== undefined) {
      return (
        <>
          {mojoToFlaxLocaleString(farmedAmount)}
          &nbsp;
          {currencyCode}
        </>
      );
    }
  }, [farmedAmount]);

  return (
    <CardSimple
      title={<Trans>Total Flax Farmed</Trans>}
      value={totalFlaxFarmed}
      loading={isLoading}
      error={error}
    />
  );
}
