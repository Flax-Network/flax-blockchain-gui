import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';
import flaxFormatter from './flaxFormatter';

export default function mojoToFlax(mojo: string | number | BigNumber): BigNumber {
  return flaxFormatter(mojo, Unit.MOJO).to(Unit.FLAX).toBigNumber();
}
