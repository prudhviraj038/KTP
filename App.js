/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState, useMemo } from 'react';

import {
  I18nManager,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
  Alert,
  PermissionsAndroid
} from 'react-native';
import configureStore from "./configureStore"; // store
import { Provider } from "react-redux"; //redux
import { PersistGate } from "redux-persist/es/integration/react"; //redux
import { LanguageContext } from "@context/lang-context";
import { SettingsContext } from "@context/settings-context";
import { TokenContext } from "@context/token-context";
import { SelectLanguageContext } from "@context/selectLang-context";
import { UserContext } from "@context/user-context";
import constants from "@constants";
import Navigation from '@navigation';
import services from "@services";
import { SplashScreen } from '@common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from "react-native-device-info";
import Geolocation from 'react-native-geolocation-service';
const { persistor, store } = configureStore();
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });
const App = () => {
  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   console.log('App background! AppAppApp', remoteMessage);
  // });
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const valueSettings = useMemo(() => ({ settings, setSettings }), [settings, setSettings]);
  const [lang, setLang] = useState(null);
  const valueLang = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  const [selectLang, setSelectLang] = useState(null);
  const valueSelectLang = useMemo(() => ({ selectLang, setSelectLang }), [selectLang, setSelectLang]);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const valueDeviceInfo = useMemo(() => ({ deviceInfo, setDeviceInfo }), [deviceInfo, setDeviceInfo]);
  const [user, setUser] = useState(null);
  const valueUser = useMemo(() => ({ user, setUser }), [user, setUser]);

  const [spinner, setSpinner] = useState(true)
  const backgroundStyle = {
    // backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  useEffect(() => {
    if (Platform.OS === "ios") {
      handleLocationPermission();
    } else {
      handleLocationPermissionAndroid()
    }

    requestUserPermission();
    getSelectLanguage()
    fetchAppData()
    // Geolocation.requestAuthorization();

  }, []);
  async function handleLocationPermissionAndroid() {
    // const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Example App',
          'message': 'Example App access to your location '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
        // alert("You can use the location");
      } else {
        console.log("location permission denied")
        // alert("Location permission denied");
      }
    } catch (err) {
      console.warn(err)
    }
  }


  // console.log(notification, "notificationnotification")
  const requestUserPermission = async () => {
    // alert("hhhiii ......")
    const authorizationStatus = await messaging().requestPermission({
      sound: true,
      announcement: true
    });
    // console.log(authorizationStatus, "authorizationStatus======", messaging.AuthorizationStatus.AUTHORIZED)
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {

      getFcmToken();
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      // console.log("User has provisional notification permissions.");
    } else {
      // console.log("User has notification permissions disabled");
    }
  }
  const getFcmToken = async () => {
    // let update = false;
    const fcmToken = await messaging().getToken();
    const deviceId = DeviceInfo.getDeviceId();
    // console.log(deviceId, "deviceIddeviceIddeviceId", fcmToken, Platform.OS)
    setDeviceInfo({
      "device_token": fcmToken,
      "device_id": deviceId,
      "device_type": Platform.OS === "ios" ? "2" : "1"
    })
  }
  const handleLocationPermission = async () => {
    // request(
    //   Platform.select({
    //     ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    //   }),
    // );
    const res = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    // console.log(res, "resresres")
    if (res === RESULTS.GRANTED) {
      // setLocationGranted(true);
    } else if (res === RESULTS.DENIED) {
      const res2 = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      // res2 === RESULTS.GRANTED
      //   ? setLocationGranted(true)
      //   : setLocationGranted(false);
    }

  };
  async function getSelectLanguage() {
    const getValue = await AsyncStorage.getItem('@LANGUAGE');
    const selectedLang = JSON.parse(getValue)
    console.log(selectedLang, "selectedLangselectedLang")
    setSelectLang(selectedLang)
    if (selectedLang === "Arabic") {
      I18nManager.forceRTL(true)
    } else {
      I18nManager.forceRTL(false)
    }
  }
  const fetchAppData = () => {
    services(constants.API_BASE_URL).then((response) => {
      if (response) {
        setSettings(response.settings)
        if (I18nManager.isRTL) {
          setLang(response.words.ar)
        } else {
          setLang(response.words.en)
        }
        setSpinner(false)
      }
    });
  };

  // if (loading) {
  //   return null;
  // }
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <TokenContext.Provider value={valueDeviceInfo}>
        <SettingsContext.Provider value={valueSettings}>
          <SelectLanguageContext.Provider value={valueSelectLang}>
            <LanguageContext.Provider value={valueLang}>
              <UserContext.Provider value={valueUser}>
                <Provider store={store}>
                  <PersistGate persistor={persistor}>
                    {spinner ? (
                      <SplashScreen />
                    ) : (
                      <Navigation />
                    )}

                  </PersistGate>
                </Provider>
              </UserContext.Provider>
            </LanguageContext.Provider>
          </SelectLanguageContext.Provider>
        </SettingsContext.Provider>
      </TokenContext.Provider>
    </SafeAreaView>
  );
};


export default App;
