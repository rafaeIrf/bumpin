import * as React from 'react';

import { RangeSliderViewProps } from './RangeSlider.types';

export default function RangeSliderView(props: RangeSliderViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
