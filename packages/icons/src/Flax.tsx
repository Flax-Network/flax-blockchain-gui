import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import FlaxBlackIcon from './images/flax-black.svg';
import FlaxIcon from './images/flax.svg';

export default function Keys(props: SvgIconProps) {
  return <SvgIcon component={FlaxIcon} viewBox="0 0 150 58" {...props} />;
}

export function FlaxBlack(props: SvgIconProps) {
  return <SvgIcon component={FlaxBlackIcon} viewBox="0 0 100 39" sx={{ width: '100px', height: '39px' }} {...props} />;
}
