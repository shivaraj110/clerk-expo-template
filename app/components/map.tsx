// components/MapComponent.tsx
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

type Props = {
  latitude: number;
  longitude: number;
  height?: number | string;
};

export default function MapComponent({ latitude, longitude, height = 200 }: Props) {
  // On web: render Google Maps embed iframe (no react-native-maps import)
  if (Platform.OS === 'web') {
    const src = `https://www.google.com/maps/embed/v1/view?key=${'AIzaSyA5xlWsMx5_DY0muBsDUqc_WLD7xvOOQ1o'}&center=${latitude},${longitude}&zoom=14&maptype=roadmap`;
    return (
      <View style={[styles.webWrap, { height :22}]}>
        <iframe
          title="map"
          src={src}
          style={{ width: '100%', height: '100%', border: 0 }}
          loading="lazy"
        />
      </View>
    );
  }

  // On mobile: import react-native-maps dynamically to avoid bundling on web
  const MapView = require('react-native-maps').default;
  const Marker = require('react-native-maps').Marker;

  return (
    <View style={[styles.mobileWrap, { height:height }]}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrap: { width: '100%', borderRadius: 12, overflow: 'hidden', backgroundColor: '#eee' },
  mobileWrap: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  map: { flex: 1 },
});
