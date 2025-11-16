// Reexport the native module. On web, it will be resolved to RangeSliderModule.web.ts
// and on native platforms to RangeSliderModule.ts
export { default } from './src/RangeSliderModule';
export { default as RangeSliderView } from './src/RangeSliderView';
export * from  './src/RangeSlider.types';
