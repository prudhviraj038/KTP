import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  Alert,
  Platform,
  Linking,
  StyleSheet,
  I18nManager,
} from "react-native";
import { BackgroundView, TextField, Spinner } from "@common";
import { Header } from "@components";
import { LanguageContext } from "@context/lang-context";
import { Fonts, Colors, Images } from "@Themes";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import { UserContext } from "@context/user-context";
import moment from "moment";
import services from "@services";
import constants from "@constants";
import { useNavigation } from "@react-navigation/native";
function TextView({ title, text, isTitle, color }) {
  return (
    <View style={[styles.textContainer, { marginTop: isTitle ? 0 : 5 }]}>
      <Text style={styles.text1}>{title}</Text>
      <Text style={[styles.text1, { color: color ? color : "black" }]}>
        {text}
      </Text>
    </View>
  );
}
export default function ViewMaintenance({ route }) {
  const navigation = useNavigation();
  const { lang, setLang } = useContext(LanguageContext);
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const [item, setItem] = useState(null);
  const [name, setName] = useState(null);
  const [status, setStatus] = useState(null);
  const [color, setColor] = useState(null);
  const [mobile, setMobile] = useState(null);

  function dialCall(mobile) {
    Linking.openURL(`tel:${mobile}`);
  }
  useEffect(() => {
    if (route.params && route.params.routingFrom) {
      fetchRequest();
    } else {
      const { item, name, status, color, mobile } = route.params;
      setItem(item);
      setName(name);
      setStatus(status);
      setColor(color);
      setMobile(mobile);
      setSpinner(false);
    }
  }, []);
  function fetchRequest() {
    var type = "";
    if (user.usertype === 2 || user.usertype === 11) {
      type = "1";
    } else if (user.usertype === 7) {
      type = "2";
    } else {
      type = "3";
    }
    var body = {
      member_id: user.id.toString(),
      city: user.city.toString(),
      type: type,
      request_id: route.params.requestId.toString(),
    };
    services(
      constants.API_BASE_URL + "/technician_requests",
      body,
      "POST"
    ).then((response) => {
      if (response && response.length > 0) {
        console.log(".....", response);
        setItem(response[0]);
        var status = "";
        var color = Colors.lightblack;
        var mobile = "";
        var name = "";
        if (response[0].cur_status === 0) {
          status = lang["Assigned"];
          color = Colors.lightblack;
        } else if (response[0].cur_status === 1) {
          status = lang["Started"];
          color = Colors.ff7113;
        } else if (response[0].cur_status === 2) {
          status = lang["Completed"];
          color = Colors.lightGreen;
        } else {
          status = lang["Rejected"];
          color = Colors.reject;
        }
        if (user.usertype === 2 || user.usertype === 11) {
          mobile = response[0].technician.mobile;
          name = response[0].technician.fullname;
        } else if (user.usertype === 7) {
          mobile = response[0].member.mobile;
          name = response[0].member.fullname;
        }
        setName(name);
        setStatus(status);
        setColor(color);
        setMobile(mobile);
        setSpinner(false);
      } else {
        setSpinner(false);
      }
    });
  }
  function onSubmit() {
    var message =
      item.cur_status === 0
        ? lang["Are you sure you want to change status to started?"]
        : lang["Are you sure you want to change status to completed?"];
    Alert.alert(lang["KTP"], message, [
      { text: lang["Yes"], onPress: () => onRequestUpdate() },
      {
        text: lang["No"],
      },
    ]);
    // setLoading(true)
  }
  function onRequestUpdate() {
    setLoading(true);
    var body = {
      request_id: item.id.toString(),
      status: item.cur_status === 0 ? "1" : "2",
    };
    // console.log(body)
    services(
      constants.API_BASE_URL + "/technician_request_update",
      body,
      "POST"
    ).then((response) => {
      if (response && response.status === "Success") {
        // console.log(".....", response)

        // setTechnicians(response)
        Alert.alert(lang["KTP"], response.message, [
          {
            text: lang["Ok"],
            onPress: () => {
              if (route.params && route.params.onNavigatingBack) {
                route.params.onNavigatingBack();
              } else {
              }

              navigation.pop();
            },
          },
        ]);
        setLoading(false);
      } else {
        setLoading(false);
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
          ) : (
            <View>
              <View style={styles.rowContainer}>
                {/* <TextView title={lang["Request Id"]} text={item.code} isTitle /> */}

                <TextView
                  // title={}
                  title={
                    I18nManager.isRTL
                      ? lang["Date/Time"]
                      : lang["Date/Time"].replace(/Scheduled/, "Scheduled\n")
                  }
                  text={
                    moment(item.date).format("YYYY-MM-DD") + "/" + item.time
                    // moment(item.time).format("hh:mm")
                  }
                />
                {user.usertype === 3 ? (
                  <View>
                    <TextView
                      title={lang["Technician"]}
                      text={item.technician.fullname}
                    />
                    <TextView
                      title={lang["Customer"]}
                      text={item.member.fullname}
                    />
                  </View>
                ) : (
                  <TextView
                    title={
                      user.usertype === 7
                        ? lang["Customer"]
                        : lang["Technician"]
                    }
                    text={name}
                  />
                )}

                {user.usertype === 3 ? (
                  <View>
                    <Pressable onPress={() => dialCall(mobile)}>
                      <TextView
                        title={lang["Technician"] + " " + lang["Mobile Number"]}
                        text={item.technician.mobile}
                        color={Colors.theme}
                      />
                    </Pressable>
                    <Pressable onPress={() => dialCall(mobile)}>
                      <TextView
                        title={lang["Customer"] + " " + lang["Mobile Number"]}
                        text={item.member.mobile}
                        color={Colors.theme}
                      />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable onPress={() => dialCall(mobile)}>
                    <TextView
                      title={lang["Mobile Number"]}
                      text={mobile}
                      color={Colors.theme}
                    />
                  </Pressable>
                )}

                <TextView title={lang["Status"]} text={status} color={color} />
              </View>
              {user.usertype === 7 && item.cur_status === 0 ? (
                <Pressable style={styles.buttonView} onPress={onSubmit}>
                  <Text style={styles.buttonText}>
                    {lang["Start Maintenance"]}
                  </Text>
                </Pressable>
              ) : user.usertype === 7 && item.cur_status === 1 ? (
                <Pressable style={styles.buttonView} onPress={onSubmit}>
                  <Text style={styles.buttonText}>
                    {lang["Completed Maintenance"]}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          )}
        </View>
      </View>
      {loading && <Spinner />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  headerView: { flex: 0.1 },
  content: { flex: 0.9 },
  contentView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.overlayWhite,
  },
  subContainer: { marginHorizontal: 15 },
  headerText: {
    fontSize: rf(2),
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginBottom: 5,
  },
  rowContainer: {
    margin: rh(1.5),
    padding: rh(1.5),
    // borderRadius: 5,
    // borderWidth: 1,
    // borderColor: "lightgrey",
    // backgroundColor: 'white',
  },
  textContainer: { flexDirection: "row", justifyContent: "space-between" },
  text1: { fontSize: rf(1.8), fontFamily: Fonts.regular },
  textContainer: { flexDirection: "row", justifyContent: "space-between" },
  buttonView: {
    backgroundColor: Colors.theme,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    padding: 10,
    color: "white",
    fontSize: rf(1.7),
    fontFamily: Fonts.medium,
  },
});
