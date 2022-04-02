import Big from 'big.js';
import Unit from '../constants/Unit';
import flaxFormatter from './flaxFormatter';

export default function catToMojo(cat: string | number | Big): number {
  return flaxFormatter(cat, Unit.CAT)
    .to(Unit.MOJO)
    .toNumber();
}