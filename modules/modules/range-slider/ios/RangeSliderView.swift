import ExpoModulesCore
import UIKit

// Custom Range Slider with two thumbs for iOS
class RangeSliderView: ExpoView {
  // Events
  let onValueChange = EventDispatcher()
  
  // Private properties
  private var minValue: Float = 0
  private var maxValue: Float = 100
  private var lowerValue: Float = 20
  private var upperValue: Float = 80
  
  private var trackLayer = CALayer()
  private var lowerThumbLayer = CALayer()
  private var upperThumbLayer = CALayer()
  private var activeTrackLayer = CALayer()
  
  private var previousTouchLocation = CGPoint.zero
  private var trackingThumb: CALayer?
  
  private let thumbSize: CGFloat = 28
  private let trackHeight: CGFloat = 4
  
  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    setupLayers()
  }
  
  private func setupLayers() {
    // Track layer (inactive)
    trackLayer.backgroundColor = UIColor.systemGray4.cgColor
    trackLayer.cornerRadius = trackHeight / 2
    layer.addSublayer(trackLayer)
    
    // Active track layer (between thumbs)
    activeTrackLayer.backgroundColor = UIColor.systemBlue.cgColor
    activeTrackLayer.cornerRadius = trackHeight / 2
    layer.addSublayer(activeTrackLayer)
    
    // Lower thumb
    lowerThumbLayer.backgroundColor = UIColor.systemBlue.cgColor
    lowerThumbLayer.cornerRadius = thumbSize / 2
    lowerThumbLayer.shadowColor = UIColor.black.cgColor
    lowerThumbLayer.shadowOpacity = 0.3
    lowerThumbLayer.shadowRadius = 4
    lowerThumbLayer.shadowOffset = CGSize(width: 0, height: 2)
    layer.addSublayer(lowerThumbLayer)
    
    // Upper thumb
    upperThumbLayer.backgroundColor = UIColor.systemBlue.cgColor
    upperThumbLayer.cornerRadius = thumbSize / 2
    upperThumbLayer.shadowColor = UIColor.black.cgColor
    upperThumbLayer.shadowOpacity = 0.3
    upperThumbLayer.shadowRadius = 4
    upperThumbLayer.shadowOffset = CGSize(width: 0, height: 2)
    layer.addSublayer(upperThumbLayer)
    
    updateLayerFrames()
  }
  
  override func layoutSubviews() {
    super.layoutSubviews()
    updateLayerFrames()
  }
  
  private func updateLayerFrames() {
    let trackWidth = bounds.width - thumbSize
    let trackY = (bounds.height - trackHeight) / 2
    
    // Track frame
    trackLayer.frame = CGRect(x: thumbSize / 2, y: trackY, width: trackWidth, height: trackHeight)
    
    // Calculate thumb positions
    let lowerPosition = positionForValue(lowerValue)
    let upperPosition = positionForValue(upperValue)
    
    // Lower thumb frame
    lowerThumbLayer.frame = CGRect(x: lowerPosition - thumbSize / 2, 
                                    y: (bounds.height - thumbSize) / 2,
                                    width: thumbSize, 
                                    height: thumbSize)
    
    // Upper thumb frame
    upperThumbLayer.frame = CGRect(x: upperPosition - thumbSize / 2,
                                    y: (bounds.height - thumbSize) / 2,
                                    width: thumbSize,
                                    height: thumbSize)
    
    // Active track frame (between thumbs)
    activeTrackLayer.frame = CGRect(x: lowerPosition,
                                     y: trackY,
                                     width: upperPosition - lowerPosition,
                                     height: trackHeight)
  }
  
  private func positionForValue(_ value: Float) -> CGFloat {
    let trackWidth = bounds.width - thumbSize
    let range = maxValue - minValue
    let relativeValue = value - minValue
    return thumbSize / 2 + CGFloat(relativeValue / range) * trackWidth
  }
  
  private func valueForPosition(_ position: CGFloat) -> Float {
    let trackWidth = bounds.width - thumbSize
    let relativePosition = position - thumbSize / 2
    let range = maxValue - minValue
    let value = minValue + Float(relativePosition / trackWidth) * range
    return min(max(value, minValue), maxValue)
  }
  
  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
    guard let touch = touches.first else { return }
    let touchLocation = touch.location(in: self)
    previousTouchLocation = touchLocation
    
    // Determine which thumb to track
    let lowerDistance = abs(touchLocation.x - lowerThumbLayer.frame.midX)
    let upperDistance = abs(touchLocation.x - upperThumbLayer.frame.midX)
    
    trackingThumb = lowerDistance < upperDistance ? lowerThumbLayer : upperThumbLayer
  }
  
  override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
    guard let touch = touches.first, let thumb = trackingThumb else { return }
    let touchLocation = touch.location(in: self)
    
    let newValue = valueForPosition(touchLocation.x)
    
    if thumb === lowerThumbLayer {
      lowerValue = min(newValue, upperValue - Float(thumbSize) / Float(bounds.width) * (maxValue - minValue))
    } else {
      upperValue = max(newValue, lowerValue + Float(thumbSize) / Float(bounds.width) * (maxValue - minValue))
    }
    
    updateLayerFrames()
  }
  
  override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
    trackingThumb = nil
    onValueChange([
      "minValue": Int(lowerValue.rounded()),
      "maxValue": Int(upperValue.rounded())
    ])
  }
  
  // Public setters from React Native
  func setMinValue(_ value: Float) {
    minValue = value
    updateLayerFrames()
  }
  
  func setMaxValue(_ value: Float) {
    maxValue = value
    updateLayerFrames()
  }
  
  func setLowerValue(_ value: Float) {
    lowerValue = value
    updateLayerFrames()
  }
  
  func setUpperValue(_ value: Float) {
    upperValue = value
    updateLayerFrames()
  }
  
  func setAccentColor(_ color: UIColor) {
    activeTrackLayer.backgroundColor = color.cgColor
    lowerThumbLayer.backgroundColor = color.cgColor
    upperThumbLayer.backgroundColor = color.cgColor
  }
}
