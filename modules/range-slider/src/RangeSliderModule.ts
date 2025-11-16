import { NativeModule, requireNativeModule } from 'expo';

import { RangeSliderModuleEvents } from './RangeSlider.types';

declare class RangeSliderModule extends NativeModule<RangeSliderModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<RangeSliderModule>('RangeSlider');
