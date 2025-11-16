package expo.modules.rangeslider

import android.content.Context
import android.graphics.Color
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RangeSlider
import androidx.compose.material3.SliderDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.unit.dp
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

class RangeSliderView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val onValueChange by EventDispatcher()

  private var minValue by mutableStateOf(0f)
  private var maxValue by mutableStateOf(100f)
  private var currentRange by mutableStateOf(20f..80f)
  private var accentColor by mutableStateOf(Color.parseColor("#2997FF"))

  private val composeView = ComposeView(context).apply {
    layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT)
    setContent {
      MaterialTheme {
        RangeSliderComposable()
      }
    }
  }

  init {
    addView(composeView)
  }

  @Composable
  private fun RangeSliderComposable() {
    RangeSlider(
      value = currentRange,
      onValueChange = { range ->
        currentRange = range
      },
      onValueChangeFinished = {
        onValueChange(mapOf(
          "minValue" to currentRange.start.toInt(),
          "maxValue" to currentRange.endInclusive.toInt()
        ))
      },
      valueRange = minValue..maxValue,
      modifier = Modifier
        .fillMaxWidth()
        .height(60.dp),
      colors = SliderDefaults.colors(
        thumbColor = androidx.compose.ui.graphics.Color(accentColor),
        activeTrackColor = androidx.compose.ui.graphics.Color(accentColor),
        inactiveTrackColor = androidx.compose.ui.graphics.Color(Color.parseColor("#E5E5EA"))
      )
    )
  }

  fun setMin(value: Float) {
    minValue = value
  }

  fun setMax(value: Float) {
    maxValue = value
  }

  fun setLower(value: Float) {
    currentRange = value..currentRange.endInclusive
  }

  fun setUpper(value: Float) {
    currentRange = currentRange.start..value
  }

  fun setAccent(color: Int) {
    accentColor = color
  }
}
