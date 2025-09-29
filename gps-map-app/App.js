import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const mapRef = useRef(null);
  const locationSubscriptionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function initializeLocationAsync() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const granted = status === 'granted';
        if (!granted) {
          if (isMounted) {
            setPermissionGranted(false);
            setErrorMessage('위치 권한이 필요합니다. 설정에서 권한을 허용해주세요.');
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) {
          setPermissionGranted(true);
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        if (isMounted) {
          setLocation(current);
          setIsLoading(false);
        }

        // Start watching position changes to keep location fresh
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 5,
          },
          (updatedLocation) => {
            if (isMounted) {
              setLocation(updatedLocation);
            }
          }
        );
        locationSubscriptionRef.current = subscription;
      } catch (error) {
        if (isMounted) {
          setErrorMessage('위치 정보를 가져오는 중 오류가 발생했습니다.');
          setIsLoading(false);
        }
      }
    }

    initializeLocationAsync();

    return () => {
      isMounted = false;
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
        locationSubscriptionRef.current = null;
      }
    };
  }, []);

  function handleRecenterPress() {
    if (!location || !mapRef.current) return;
    const { latitude, longitude } = location.coords;
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  }

  const hasCoords = Boolean(location && location.coords);
  const initialRegion = hasCoords
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        // Default to Seoul City Hall if location not yet available
        latitude: 37.5665,
        longitude: 126.9780,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" />
            <Text style={styles.infoText}>현재 위치를 확인하는 중...</Text>
          </View>
        ) : !permissionGranted ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>{errorMessage || '위치 권한이 거부되었습니다.'}</Text>
          </View>
        ) : (
          <>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              showsUserLocation
              showsMyLocationButton={false}
              initialRegion={initialRegion}
            >
              {hasCoords && (
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title="현재 위치"
                  description="GPS로 추적된 위치"
                />
              )}
            </MapView>

            <Pressable onPress={handleRecenterPress} style={styles.fab} accessibilityRole="button">
              <Text style={styles.fabText}>내 위치</Text>
            </Pressable>
          </>
        )}
        <StatusBar style="dark" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  infoText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333333',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#b00020',
  },
  map: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  fabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
