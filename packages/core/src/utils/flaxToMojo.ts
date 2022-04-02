import Big from 'big.js';
import Unit from '../constants/Unit';
import flaxFormatter from './flaxFormatter';

export default function flaxToMojo(flax: string | number | Big): number {
  return flaxFormatter(flax, Unit.FLAX)
    .to(Unit.MOJO)
    .toNumber();
}