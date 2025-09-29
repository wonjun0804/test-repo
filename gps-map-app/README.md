## GPS 연동 지도 앱 (Expo)

이 프로젝트는 Expo 기반 React Native 앱으로, 기기의 GPS를 사용해 현재 위치를 가져오고 지도를 표시합니다. `react-native-maps`와 `expo-location`을 사용합니다.

### 사전 준비
- Android 기기 또는 에뮬레이터 (Linux에서는 iOS 빌드 불가)
- Node.js와 npm
- Expo CLI는 자동으로 설치/실행되므로 별도 설치 불필요

### 설치 및 실행
```bash
cd gps-map-app
npm install
npm run android
```

에뮬레이터가 없으면 Android 기기에서 Google Play의 Expo Go 앱을 설치한 뒤 아래로 실행하세요:
```bash
npm start
```
터미널 또는 브라우저에 표시되는 QR 코드를 Expo Go로 스캔하면 앱이 실행됩니다.

### 권한
- 최초 실행 시 위치 권한을 요청합니다. 권한을 허용해야 현재 위치를 지도에 표시합니다.
- Android 네이티브 권한: `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION` (이미 `app.json`에 구성되어 있음)

### 기능
- 현재 위치 가져오기 및 지도 초기 포커스
- 사용자 현재 위치 표시 및 마커
- "내 위치" 버튼으로 지도 재중심 이동

### 참고
- 웹(브라우저) 실행은 `react-native-maps`에서 Google Maps JS API 설정이 필요할 수 있습니다. 모바일에서의 실행을 권장합니다.

