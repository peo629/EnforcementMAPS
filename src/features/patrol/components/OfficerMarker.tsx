import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Polygon, Circle } from 'react-native-svg';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OfficerMarkerProps {
  latitude: number;
  longitude: number;
  heading: number | null;
  /** Colour token — defaults to high-contrast cyan for satellite/standard maps */
  color?: string;
  /** Outer accuracy radius in metres — set to 0 to hide */
  accuracyRadius?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MARKER_SIZE = 40;
const ARROW_COLOR = '#00E5FF';       // Cyan — contrasts both light and dark map styles
const ARROW_BORDER = '#003B47';      // Dark border for legibility on light maps
const ACCURACY_COLOR = 'rgba(0, 229, 255, 0.12)';
const ACCURACY_BORDER = 'rgba(0, 229, 255, 0.35)';

// ─── Arrowhead SVG ────────────────────────────────────────────────────────────
// Points upward (north) at 0°. Rotation applied via Animated wrapper.
// Polygon points describe a sharp arrowhead centred on a 40×40 viewBox.

function ArrowheadSvg({ color }: { color: string }) {
  return (
    <Svg width={MARKER_SIZE} height={MARKER_SIZE} viewBox="0 0 40 40">
      {/* Accuracy pulse circle base */}
      <Circle cx="20" cy="20" r="6" fill={color} opacity={0.25} />
      {/* Arrowhead — points north (up) */}
      <Polygon
        points="20,4 30,32 20,26 10,32"
        fill={color}
        stroke={ARROW_BORDER}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Centre dot */}
      <Circle cx="20" cy="20" r="3" fill="#FFFFFF" />
    </Svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OfficerMarker({
  latitude,
  longitude,
  heading,
  color = ARROW_COLOR,
  accuracyRadius = 0,
}: OfficerMarkerProps) {
  const rotation = useSharedValue(heading ?? 0);

  useEffect(() => {
    if (heading === null || heading === undefined) return;

    // Shortest-path rotation to avoid spinning the wrong way
    const current = rotation.value % 360;
    const target = heading % 360;
    let delta = target - current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    rotation.value = withSpring(rotation.value + delta, {
      damping: 18,
      stiffness: 120,
      mass: 0.8,
    });
  }, [heading]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      flat
      tracksViewChanges={false}
    >
      <View style={styles.container}>
        {/* Accuracy radius ring */}
        {accuracyRadius > 0 && (
          <View
            style={[
              styles.accuracyRing,
              {
                width: accuracyRadius * 2,
                height: accuracyRadius * 2,
                borderRadius: accuracyRadius,
              },
            ]}
          />
        )}

        {/* Animated arrowhead */}
        <Animated.View style={[styles.arrow, animatedStyle]}>
          <ArrowheadSvg color={color} />
        </Animated.View>
      </View>
    </Marker>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  accuracyRing: {
    position: 'absolute',
    backgroundColor: ACCURACY_COLOR,
    borderWidth: 1,
    borderColor: ACCURACY_BORDER,
  },
  arrow: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
