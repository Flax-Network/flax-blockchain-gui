import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';
import flaxFormatter from './flaxFormatter';

export default function mojoToCATLocaleString(mojo: string | number | BigNumber, locale?: string) {
  return flaxFormatter(mojo, Unit.MOJO).to(Unit.CAT).toLocaleString(locale);
}
