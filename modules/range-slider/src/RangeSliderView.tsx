import { requireNativeView } from 'expo';
import * as React from 'react';

import { RangeSliderViewProps } from './RangeSlider.types';

const NativeView: React.ComponentType<RangeSliderViewProps> =
  requireNativeView('RangeSlider');

export default function RangeSliderView(props: RangeSliderViewProps) {
  return <NativeView {...props} />;
}
