import Big from 'big.js';
import Unit from '../constants/Unit';
import flaxFormatter from './flaxFormatter';

export default function mojoToFlax(mojo: string | number | Big): number {
  return flaxFormatter(mojo, Unit.MOJO)
    .to(Unit.FLAX)
    .toNumber();
}