import type { SlickGridModel } from './slickGridModel.interface';
export interface SlickPlugin {
    pluginName: string;
    init: (grid: SlickGridModel) => void;
    destroy: () => void;
}
//# sourceMappingURL=slickPlugin.interface.d.ts.map