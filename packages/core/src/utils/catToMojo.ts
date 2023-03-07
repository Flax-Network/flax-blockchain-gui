import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';
import flaxFormatter from './flaxFormatter';

export default function catToMojo(cat: string | number | BigNumber): BigNumber {
  return flaxFormatter(cat, Unit.CAT).to(Unit.MOJO).toBigNumber();
}
