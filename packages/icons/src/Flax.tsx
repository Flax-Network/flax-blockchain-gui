import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import FlaxIcon from './images/flax.svg';

export default function Keys(props: SvgIconProps) {
  return <SvgIcon component={FlaxIcon} viewBox="0 0 150 58" {...props} />;
}
