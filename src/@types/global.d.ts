import { SlickAutoTooltip } from '../plugins/slick.autotooltips';

declare global {
  var IIFE_ONLY: boolean;
  var Slick: {
    AutoTooltips: SlickAutoTooltips,
    Utils: any,
  };
}

export { };
