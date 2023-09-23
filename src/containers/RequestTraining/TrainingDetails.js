import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  useWindowDimensions,
  I18nManager,
  Pressable,
  Keyboard,
} from "react-native";

import { BackgroundView, TextField, Spinner } from "@common";
import { Header } from "@components";
import { useNavigation } from "@react-navigation/native";
import services from "@services";
import constants from "@constants";

import HTML from "react-native-render-html";
import styles from "./styles";
import { LanguageContext } from "@context/lang-context";
import { Fonts, Colors, Images } from "@Themes";
import { UserContext } from "@context/user-context";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
function TextBox({ title, value, isStatus }) {
  const { lang, setLang } = useContext(LanguageContext);
  const { user, setUser } = useContext(UserContext);
  var color = "black";
  var status = "";
  // if (isStatus) {
  if (value === 0) {
    color = "black";
    status = lang["Under Review"];
  } else if (value === 1) {
    color = "black";
    if (user.usertype === 7) {
      status = lang["New"];
    } else {
      status = lang["Assigned"];
    }
    // status = lang["Assigned"]
  } else if (value === 2) {
    color = "black";
    status = lang["Started"];
  } else if (value === 3) {
    color = "black";
    status = lang["Completed"];
  }
  // }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
      }}
    >
      <View style={styles.inputHeaderView}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.input}>
        <View style={styles1.borderView}>
          <Text
            numberOfLines={3}
            style={[styles1.text, { color: isStatus ? color : "black" }]}
          >
            {" "}
            {isStatus ? status : value}
          </Text>
        </View>
      </View>
    </View>
  );
}
export default function TrainingDetails({ route }) {
  const [item, setItem] = useState(null);
  const { lang, setLang } = useContext(LanguageContext);
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [spinner, setSpinner] = useState(true);
  useEffect(() => {
    if (route.params) {
      if (route.params.item) {
        setItem(route.params.item);
        setSpinner(false);
        console.log(route.params.item, "route.params.item");
      } else {
        fetchDetails();
      }
    }
  }, []);
  function fetchDetails() {
    console.log(
      constants.API_BASE_URL +
        "/request_training_info/" +
        route.params.trainingId
    );
    services(
      constants.API_BASE_URL +
        "/request_training_info/" +
        route.params.trainingId
    ).then((response) => {
      if (response) {
        // console.log("responresponseresponsese", response)

        setItem(response);
        // fetchTechnicians(response)
        setSpinner(false);
      }
    });
  }
  function askAlert() {
    var message =
      item.cur_status === 1
        ? lang["Are you sure you want to change status to started?"]
        : lang["Are you sure you want to change status to completed?"];
    Alert.alert(lang["KTP"], message, [
      { text: lang["Yes"], onPress: () => onSubmit() },
      {
        text: lang["No"],
      },
    ]);
  }
  function onSubmit() {
    setLoading(true);
    var body = {
      request_id: item.id.toString(),
      status: item.cur_status === 1 ? "2" : "3",
    };
    // console.log(object)
    services(
      constants.API_BASE_URL + "/request_training_update",
      body,
      "POST"
    ).then((response) => {
      if (response) {
        setLoading(false);
        if (response.status === "Success") {
          Alert.alert(
            lang["KTP"],
            I18nManager.isRTL ? response.message_ar : response.message,
            [
              {
                text: lang["Ok"],
                onPress: () => {
                  if (route.params.onNavigatingBack) {
                    route.params.onNavigatingBack();
                    navigation.pop();
                  } else {
                    navigation.popToTop();
                  }
                },
              },
            ]
          );
        } else {
          Alert.alert(
            lang["KTP"],
            I18nManager.isRTL ? response.message_ar : response.message,
            [{ text: lang["Ok"] }]
          );
        }
        // console.log("responresponseresponsese", response)
      }
    });
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Header />
      </View>
      <View style={styles.content}>
        <BackgroundView />

        <View style={styles.contentView}>
          {spinner ? (
            <Spinner initialLoad />
          ) : item ? (
            <View style={styles.subContent}>
              <Text style={styles.headerText}>{lang["Request Training"]}</Text>
              <TextBox title={lang["Training Id"]} value={item.code} />
              <TextBox title={lang["Area"]} value={item.area} />
              <TextBox title={lang["Message"]} value={item.message} />
              <TextBox
                title={lang["Status"]}
                value={item.cur_status}
                isStatus
              />
              {user.usertype === 2 || user.usertype === 11 ? (
                item.cur_status != 0 ? (
                  <View>
                    <TextBox
                      title={lang["Technician Name"]}
                      value={item.technician_id.fullname}
                    />
                    <TextBox
                      title={lang["Technician Phone"]}
                      value={item.technician_id.mobile}
                    />
                    <TextBox title={lang["Date"]} value={item.date} />
                    <TextBox title={lang["Time"]} value={item.time} />
                  </View>
                ) : null
              ) : null}
              {user.usertype === 7 &&
              (item.cur_status === 1 || item.cur_status === 2) ? (
                <Pressable style={styles.buttonStyle} onPress={askAlert}>
                  <Text style={styles.btnText}>
                    {item.cur_status === 1 ? lang["Start"] : lang["Complete"]}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
      {loading && <Spinner />}
    </View>
  );
}
const styles1 = StyleSheet.create({
  text: {
    fontSize: rf(1.7),
    fontFamily: Fonts.regular,
    textAlign: "left",
    //  marginTop: 10
  },
  header: {
    fontSize: rf(1.7),
    fontFamily: Fonts.medium,
    textAlign: "left",
    // marginTop: 10
  },
  borderView: {
    // height: rh(15),
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    backgroundColor: "#969696",
    borderColor: "#969696",
    borderRadius: 5,
    justifyContent: "center",
  },
});
