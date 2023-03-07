import defaultsForPlotter from '../utils/defaultsForPlotter';
import optionsForPlotter from '../utils/optionsForPlotter';
import PlotterName from './PlotterName';

export default {
  displayName: 'Flax Proof of Space',
  options: optionsForPlotter(PlotterName.FLAXPOS),
  defaults: defaultsForPlotter(PlotterName.FLAXPOS),
  installInfo: { installed: true },
};
