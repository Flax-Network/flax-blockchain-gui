import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';
import flaxFormatter from './flaxFormatter';

export default function mojoToCAT(mojo: string | number | BigNumber): BigNumber {
  return flaxFormatter(mojo, Unit.MOJO).to(Unit.CAT).toBigNumber();
}
