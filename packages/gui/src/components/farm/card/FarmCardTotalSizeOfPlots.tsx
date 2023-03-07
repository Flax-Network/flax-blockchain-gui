import { useGetTotalHarvestersSummaryQuery } from '@flax-network/api-react';
import { FormatBytes, CardSimple } from '@flax-network/core';
import { Trans } from '@lingui/macro';
import React from 'react';

export default function FarmCardTotalSizeOfPlots() {
  const { totalPlotSize, isLoading } = useGetTotalHarvestersSummaryQuery();

  return (
    <CardSimple
      title={<Trans>Total Size of Plots</Trans>}
      value={<FormatBytes value={totalPlotSize} precision={3} />}
      loading={isLoading}
    />
  );
}
