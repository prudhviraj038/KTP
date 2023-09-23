import React, { useEffect, useState, useContext } from "react";
import { View, Text, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  BottomTabs,
  Login,
  SignUp,
  Language,
  NotificationsRequest,
  AddMaintenanceRequest,
  ProductDetails,
  Notifications,
  ViewMaintenance,
  ManifoldCustomization,
  RequestTrainingSupervisor,
} from "@containers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import services from "@services";
import constants from "@constants";
import { UserContext } from "@context/user-context";
import { SelectLanguageContext } from "@context/selectLang-context";
import { SideBar } from "@components";
import { Spinner } from "@common";
import { TokenContext } from "@context/token-context";
import messaging from "@react-native-firebase/messaging";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
function DrawerStack() {
  return (
    <Drawer.Navigator
      initialRouteName="BottomTabs"
      screenOptions={{ swipeEnabled: false }}
      drawerContent={(props) => <SideBar {...props} />}
    >
      <Drawer.Screen name="BottomTabs" component={BottomTabs} />
      {/* <Drawer.Screen name="Notifications" component={NotificationsScreen} /> */}
    </Drawer.Navigator>
  );
}
function InitialStack() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Language">
      <Stack.Screen name="Language" component={Language} />
      {/* <Stack.Screen name="BottomTabs" component={BottomTabs}/> */}
    </Stack.Navigator>
  );
}
function RootStack() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="DrawerStack">
      <Stack.Screen name="DrawerStack" component={DrawerStack} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen
        name="NotificationsRequest"
        component={NotificationsRequest}
      />
      <Stack.Screen
        name="AddMaintenanceRequest"
        component={AddMaintenanceRequest}
      />
      <Stack.Screen
        name="ManifoldCustomization"
        component={ManifoldCustomization}
      />
      <Stack.Screen
        name="RequestTrainingSupervisor"
        component={RequestTrainingSupervisor}
      />

      <Stack.Screen name="ViewMaintenance" component={ViewMaintenance} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Notifications" component={Notifications} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const { user, setUser } = useContext(UserContext);
  const { selectLang, setSelectLang } = useContext(SelectLanguageContext);
  const { deviceInfo, setDeviceInfo } = useContext(TokenContext);
  const [spinner, setSpinner] = useState(true);
  const [notificationValue, setNotificationValue] = useState(null);
  useEffect(() => {
    getUserId();
    // viewNotification()
    // console.log(deviceInfo, "deviceInfodeviceInfodeviceInfo---------")
  }, [deviceInfo]);

  async function getUserId() {
    const value = await AsyncStorage.getItem("@USERID");
    // console.log(value, "valuevalue")
    if (value) {
      var id = JSON.parse(value);
      fetchProfile(id);
    } else {
      console.log("Empty");
      onRegisterDevice(-1);
      // setSpinner(false)
    }
  }
  function fetchProfile(userId) {
    // console.log(constants.API_BASE_URL + "/members/" + userId, "====")
    services(constants.API_BASE_URL + "/members/" + userId)
      .then((response) => {
        if (response) {
          // console.log(response, "onSubmitonSubmit")
          setUser(response[0]);
          onRegisterDevice(userId);
          // setSpinner(false)
        }
      })
      .catch((error) => {
        // console.log(error, "eerrrrrppppp")
      });
  }
  function onRegisterDevice(userId) {
    // console.log(constants.API_BASE_URL + "/members/" + userId, "====")
    if (deviceInfo) {
      var data = {
        device_token: deviceInfo.device_token,
        device_id: deviceInfo.device_id,
        device_type: deviceInfo.device_type,
        member_id: userId.toString(),
      };
      services(constants.API_BASE_URL + "/token_register", data, "POST")
        .then((response) => {
          setSpinner(false);
        })
        .catch((error) => {
          // console.log(error, "eerrrrrppppp")
        });
    } else {
      setSpinner(false);
    }
  }

  return (
    <NavigationContainer>
      {spinner ? (
        <Spinner initialLoad />
      ) : selectLang ? (
        <RootStack />
      ) : (
        <InitialStack />
      )}
    </NavigationContainer>
  );
}

export default Navigation;
