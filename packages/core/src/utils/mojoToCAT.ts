import Big from 'big.js';
import Unit from '../constants/Unit';
import flaxFormatter from './flaxFormatter';

export default function mojoToCAT(mojo: string | number | Big): number {
  return flaxFormatter(mojo, Unit.MOJO)
    .to(Unit.CAT)
    .toNumber();
}