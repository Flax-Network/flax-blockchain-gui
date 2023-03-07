import BigNumber from 'bignumber.js';
import React from 'react';

import useCurrencyCode from '../../hooks/useCurrencyCode';
import mojoToFlax from '../../utils/mojoToFlaxLocaleString';
import FormatLargeNumber from '../FormatLargeNumber';

export type MojoToFlaxProps = {
  value: number | BigNumber;
};

export default function MojoToFlax(props: MojoToFlaxProps) {
  const { value } = props;
  const currencyCode = useCurrencyCode();
  const updatedValue = mojoToFlax(value);

  return (
    <>
      <FormatLargeNumber value={updatedValue} />
      &nbsp;{currencyCode ?? ''}
    </>
  );
}
