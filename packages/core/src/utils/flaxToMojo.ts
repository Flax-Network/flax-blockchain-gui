import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';
import flaxFormatter from './flaxFormatter';

export default function flaxToMojo(flax: string | number | BigNumber): BigNumber {
  return flaxFormatter(flax, Unit.FLAX).to(Unit.MOJO).toBigNumber();
}
