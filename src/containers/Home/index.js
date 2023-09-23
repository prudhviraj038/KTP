import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  AppState,
  FlatList,
  TouchableOpacity,
  I18nManager,
  Alert,
  Platform,
  Pressable,
} from "react-native";
import styles from "./styles";
import { HeaderHome, HomeTabs } from "@components";
import { Images, Colors, Fonts } from "@Themes";
import services from "@services";
import constants from "@constants";
import { UserContext } from "@context/user-context";
import { LanguageContext } from "@context/lang-context";
import { Spinner, BackgroundView } from "@common";
import { useNavigation } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";

export default function Home() {
  const navigation = useNavigation();
  const [spinner, setSpinner] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { lang, setLang } = useContext(LanguageContext);
  const [data, setData] = useState([]);
  const [dummy, setDummy] = useState(0);
  // const appState = useRef(AppState.currentState);
  // console.log(appState, "appStateappState")
  useEffect(() => {
    if (user) {
      setSpinner(true);
      fetchAppData();
    } else {
      setData([]);
      // setSpinner(false)
    }

    viewNotification();
    backgroundNotification();
    // console.log(constants.API_BASE_URL + "/order_requests?order_id=" + "1122" + "&type=" + "2")
  }, [user]);

  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     console.log('Message handled in the background!', remoteMessage);
  // });
  async function backgroundNotification() {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      // console.log(
      //     'background state:',
      //     remoteMessage.data.message,
      // );

      if (Platform.OS === "ios") {
        var res = JSON.parse(remoteMessage.data.moredata);
        var message = JSON.parse(remoteMessage.data.message);
        // console.log(res[0].from, "remoteMessa==ge...", message.body)
        notificationIos(message, res);
      } else {
        var notificationData = JSON.parse(remoteMessage.data.message);
        // console.log(notificationData, "onNotificationOpenedApp")
        // if (notificationData.data[0].from === "1") {
        //     displayAlert(notificationData, "NotificationsRequest")
        // } else if (notificationData.data[0].from === "2") {
        //     displayAlert(notificationData, "ManifoldCustomization")
        // }
        notificationAndroid(notificationData);
      }
      // displayAlert(notificationData)
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          if (Platform.OS === "ios") {
            var res = JSON.parse(remoteMessage.data.moredata);
            var message = JSON.parse(remoteMessage.data.message);
            // console.log(res[0].from, "remoteMessa==ge...", message.body)
            // if (res[0].from === "1") {
            //     displayAlertIos(message, res[0].order_id, "NotificationsRequest")
            // } else if (res[0].from === "2") {
            //     // console.log("remoteMessa==ge...", remoteMessage)
            //     displayAlertIos(message, res[0].order_id, "ManifoldCustomization")
            // }
            notificationIos(message, res);
          } else {
            var notificationData = JSON.parse(remoteMessage.data.message);
            // console.log(notificationData, "getInitialNotification")
            // if (notificationData.data[0].from === "1") {
            //     displayAlert(notificationData, "NotificationsRequest")
            // } else if (notificationData.data[0].from === "2") {
            //     displayAlert(notificationData, "ManifoldCustomization")
            // }
            notificationAndroid(notificationData);
            // displayAlert(notificationData)
          }
        }
      });
  }
  function displayAlertIos(notificationData, order_id, routeName) {
    // console.log(routeName, "routeNamerouteName")
    //  notificationData.title,
    // notificationData.body,
    // if (dummy === 1) {

    Alert.alert(notificationData.title, notificationData.body, [
      {
        text: lang["Cancel"],
      },
      {
        text: lang["Ok"],
        onPress: () => {
          navigation.push(routeName, {
            routingFrom: "Home",
            quotationId: order_id,
            manifoldId: order_id,
            requestId: order_id,
            reportId: order_id,
            trainingId: order_id,
          });
          setDummy(0);
        },
      },
    ]);
    // }
  }
  function displayAlert(notificationData, routeName) {
    //  notificationData.notification.title,
    // notificationData.notification.body,
    // console.log(notificationData.data[0], "notificationData.data[0].order_id")
    Alert.alert(
      notificationData.notification.title,
      notificationData.notification.body,
      [
        {
          text: lang["Cancel"],
        },
        {
          text: lang["Ok"],
          onPress: () =>
            navigation.push(routeName, {
              routingFrom: "Home",
              quotationId: notificationData.data[0].order_id,
              manifoldId: notificationData.data[0].order_id,
              requestId: notificationData.data[0].order_id,
              reportId: notificationData.data[0].order_id,
              trainingId: notificationData.data[0].order_id,
            }),
        },
      ]
    );
  }
  async function viewNotification() {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      //   console.log(remoteMessage, "remoteMessa==ge...");
      //   setDummy(1);
      if (Platform.OS === "ios") {
        console.log("-------------------Pranavi--------------");
        console.log(remoteMessage.data);
        console.log(remoteMessage.data.moredata);
        var res = JSON.parse(remoteMessage.data.moredata);
        var message = JSON.parse(remoteMessage.data.message);
        // if (dummy === 1) {
        notificationIos(message, res);
        // }
      } else {
        var notificationData = JSON.parse(remoteMessage.data.message);
        // console.log(notificationData, "////viewNotification///")
        notificationAndroid(notificationData);
      }
    });
    return unsubscribe;
  }
  function notificationAndroid(notificationData) {
    if (notificationData.data[0].from === "1") {
      displayAlert(notificationData, "NotificationsRequest");
    } else if (notificationData.data[0].from === "2") {
      console.log(notificationData, "Rocky");
      displayAlert(notificationData, "ManifoldCustomization");
    } else if (notificationData.data[0].from === "3") {
      displayAlert(notificationData, "ViewMaintenance");
    } else if (notificationData.data[0].from === "4") {
      displayAlert(notificationData, "PressureTestDetails");
    } else if (notificationData.data[0].from === "5") {
      if (user) {
        if (user.usertype === 4) {
          displayAlert(notificationData, "RequestTrainingSupervisor");
        } else {
          //    console.log("....***********.", notificationData.data[0].from)
          displayAlert(notificationData, "TrainingDetails");
        }
      }
    }
  }
  function notificationIos(message, res) {
    if (res[0].from === "1") {
      displayAlertIos(message, res[0].order_id, "NotificationsRequest");
    } else if (res[0].from === "2") {
      displayAlertIos(message, res[0].order_id, "ManifoldCustomization");
    } else if (res[0].from === "3") {
      displayAlertIos(message, res[0].order_id, "ViewMaintenance");
    } else if (res[0].from === "4") {
      displayAlertIos(message, res[0].order_id, "PressureTestDetails");
    } else if (res[0].from === "5") {
      if (user) {
        if (user.usertype === 4) {
          displayAlertIos(
            message,
            res[0].order_id,
            "RequestTrainingSupervisor"
          );
        } else {
          displayAlertIos(message, res[0].order_id, "TrainingDetails");
        }
      }
      // displayAlertIos(message, res[0].order_id, "TrainingDetails")
    }
  }
  const fetchAppData = () => {
    // console.log(lang, "langlanglanglanglang")
    services(constants.API_BASE_URL + "/services?member_id=" + user.id).then(
      (response) => {
        if (response) {
          setSpinner(false);
          // fetchPages()
          // console.log(response, "responsesresponsesresponses")
          setData(response.services);
          // getCountry();
        }
      }
    );
  };
  function onItem(item) {
    if (item.id === 1) {
      navigation.push("Quotation");
    } else if (item.id === 2) {
      if (user.usertype === 5 || user.usertype === 1 || user.usertype === 12) {
        navigation.push("OrderRequestList");
      } else {
        navigation.push("OrderRequest");
      }
    } else if (item.id === 16) {
      navigation.push("DistributorsList");
    } else if (item.id === 5) {
      navigation.push("CustomerPdf", { service: "pricing" });
    } else if (item.id === 6) {
      navigation.push("CustomerPdf", { service: "catelogs" });
    } else if (item.id === 7) {
      // if (user.usertype === 2) {
      //     navigation.push("ManifoldCustomization")
      // } else {
      navigation.push("ManifoldList");
      // }
    } else if (item.id === 8) {
      navigation.push("MaintenanceList");
    } else if (item.id === 9) {
      navigation.push("Warranty");
    } else if (item.id === 3) {
      navigation.push("SalesReport");
    } else if (item.id === 10) {
      // navigation.push("CollectionEntry")
      navigation.push("CollectionEntryList");
    } else if (item.id === 12) {
      navigation.push("PressureTestList");
      // navigation.push("AccountSystem")
    } else if (item.id === 11) {
      navigation.push("TrainingList");
    } else {
      alert(item.id);
    }
  }
  const renderItem = ({ item, index }) => {
    return (
      <Pressable style={styles.listView} onPress={() => onItem(item, index)}>
        <Image
          source={{ uri: item.image }}
          resizeMode="contain"
          style={styles.icon}
        />
        <Text style={styles.title}>
          {I18nManager.isRTL ? item.title_ar : item.title}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <HeaderHome />
      </View>
      <View style={styles.tabsView}>
        <HomeTabs />
      </View>
      <View style={styles.mainContent}>
        <BackgroundView />

        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            {spinner ? (
              <Spinner initialLoad />
            ) : (
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                style={styles.flatlist}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
