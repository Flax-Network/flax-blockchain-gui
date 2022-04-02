import Big from 'big.js';
import Unit from '../constants/Unit';
import flaxFormatter from './flaxFormatter';

export default function mojoToFlaxLocaleString(mojo: string | number | Big) {
  return flaxFormatter(Number(mojo), Unit.MOJO)
    .to(Unit.FLAX)
    .toLocaleString();
}