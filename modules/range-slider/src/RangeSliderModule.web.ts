import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './RangeSlider.types';

type RangeSliderModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class RangeSliderModule extends NativeModule<RangeSliderModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(RangeSliderModule, 'RangeSliderModule');
