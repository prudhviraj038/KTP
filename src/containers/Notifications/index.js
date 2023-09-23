import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { Header } from "@components";
import styles from "./styles";
import services from "@services";
import constants from "@constants";
import { UserContext } from "@context/user-context";
import { Spinner } from "@common";
import { Fonts } from "@Themes";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "@context/lang-context";
const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
    message: "You have a new notification from your customer",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
    message: "You have a new notification from your customer",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
    message: "You have a new notification from your customer",
  },
];
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const { lang, setLang } = useContext(LanguageContext);
  const { user, setUser } = useContext(UserContext);
  const navigation = useNavigation();
  function onItemPressed(item) {
    if (item.reference_type === 1) {
      navigatingScreen("NotificationsRequest", item.reference_id);
    } else if (item.reference_type === 2) {
      // ManifoldCustomization
      // navigatingScreen("ManifoldCustomization", item.reference_id);
      navigation.push("ManifoldCustomization", {
        manifoldId: item.reference_id,
        item: item,
        routingFrom: "ManifoldListNotification",
      });
    } else if (item.reference_type === 3) {
      navigation.push("ViewMaintenance", {
        requestId: item.reference_id,
        routingFrom: "Notifications",
      });
      // navigatingScreen("ViewMaintenance", item.reference_id);
    } else if (item.reference_type === 4) {
      // PressureTestDetails
      navigatingScreen("PressureTestDetails", item.reference_id);
    } else if (item.reference_type === 5) {
      if (user) {
        if (user.usertype === 4) {
          navigatingScreen("RequestTrainingSupervisor", item.reference_id);
        } else {
          //    console.log("....***********.", notificationData.data[0].from)
          navigatingScreen("TrainingDetails", item.reference_id);
        }
      }
    }
  }
  function navigatingScreen(routing, orderId) {
    navigation.push(routing, {
      quotationId: orderId,
      manifoldId: orderId,
      requestId: orderId,
      reportId: orderId,
      trainingId: orderId,
    });
  }
  function _renderItem({ item, index }) {
    return (
      <Pressable
        style={{ padding: 15, borderBottomWidth: 1, borderColor: "#f2f2f2" }}
        onPress={() => onItemPressed(item)}
      >
        {/* <View style={{ flexDirection: "row", justifyContent: "space-between" }}> */}
        <Text>{item.title}</Text>

        {/* </View> */}
        <Text style={{ marginVertical: 5, color: "#585858", fontSize: 12 }}>
          {item.message}
        </Text>
        <Text style={{ color: "grey", fontSize: 10 }}>
          {/* {moment(item.now).format("DD/MM/YYYY")} */}
        </Text>
      </Pressable>
    );
  }
  useEffect(() => {
    fetchNotifications();
  }, []);
  const fetchNotifications = () => {
    if (user.id) {
      services(
        constants.API_BASE_URL + "/notifications?member_id=" + user.id
      ).then((response) => {
        if (response) {
          // console.log(response, "......")

          // setReceiptTypes(response.types)
          setNotifications(response);
          setSpinner(false);
        } else {
          setSpinner(false);
        }
      });
    } else {
      setSpinner(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.headerView}>
        <Header routingFrom="Notifications" />
      </View>
      {spinner ? (
        <Spinner initialLoad />
      ) : (
        <View style={{ flex: 0.9 }}>
          <FlatList
            data={notifications}
            ListEmptyComponent={() => {
              return (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    fontFamily: Fonts.regular,
                  }}
                >
                  {lang["No Data Found"]}
                </Text>
              );
            }}
            renderItem={_renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}
    </View>
  );
}
