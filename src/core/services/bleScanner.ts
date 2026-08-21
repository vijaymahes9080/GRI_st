import { Alert, PermissionsAndroid, Platform } from 'react-native';

export interface BleBeacon {
  id: string;
  name: string;
  rssi: number;
  distanceMeters: number;
}

export const requestAndroidBlePermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);

    return (
      granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED
    );
  } catch {
    return false;
  }
};

export const scanForClassroomBeacon = async (expectedBeaconId: string): Promise<BleBeacon | null> => {
  const hasPermission = await requestAndroidBlePermissions();
  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Bluetooth and Location permissions are required for BLE Attendance scanning.');
    return null;
  }

  // Simulated BLE hardware beacon scan
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: expectedBeaconId,
        name: 'GRI-CS-LAB-BEACON-01',
        rssi: -58,
        distanceMeters: 1.2,
      });
    }, 1200);
  });
};
