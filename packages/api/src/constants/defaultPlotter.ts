import PlotterName from './PlotterName';
import optionsForPlotter from '../utils/optionsForPlotter';
import defaultsForPlotter from '../utils/defaultsForPlotter';

export default {
  displayName: 'Flax Proof of Space',
  options: optionsForPlotter(PlotterName.FLAXPOS),
  defaults: defaultsForPlotter(PlotterName.FLAXPOS),
  installInfo: { installed: true },
};
