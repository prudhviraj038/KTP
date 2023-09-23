import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  I18nManager,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
// import styles from "./styles";
import { BackgroundView, TextField, Spinner } from "@common";
import { Header } from "@components";
import { LanguageContext } from "@context/lang-context";
import { Fonts, Colors, Images } from "@Themes";
import { UserContext } from "@context/user-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import RNPickerSelect from "react-native-picker-select";
import services from "@services";
import constants from "@constants";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
export default function ManifoldList() {
  const navigation = useNavigation();
  const { lang, setLang } = useContext(LanguageContext);
  const { user, setUser } = useContext(UserContext);
  const [spinner, setSpinner] = useState(true);
  const [manifoldList, setManifoldList] = useState([]);
  useEffect(() => {
    fetchManifoldList();
  }, []);
  function handleBack() {
    setSpinner(true);
    fetchManifoldList();
  }
  const fetchManifoldList = () => {
    var type = "";
    if (user.usertype === 5) {
      type = "1";
    } else if (user.usertype === 1) {
      type = "2";
    } else if (user.usertype === 2) {
      type = "0";
    } else {
      type = "3";
    }
    console.log(
      constants.API_BASE_URL +
        "/manifolds?member_id=" +
        user.id +
        "&type=" +
        type,
      "Pranavi"
    );
    services(
      constants.API_BASE_URL +
        "/manifolds?member_id=" +
        user.id +
        "&type=" +
        type
    ).then((response) => {
      if (response && response.length > 0) {
        //console.log(response, "responseresponseresponse")
        if (type == "3") {
          let newResponse = response.filter(
            (item) => item.sales_manager_approve !== 0
          );
          setManifoldList(newResponse);
        } else {
          setManifoldList(response);
        }

        setSpinner(false);
      } else {
        setSpinner(false);
      }
    });
  };
  const _renderItem = ({ item, index }) => {
    // console.log(item)
    var status = "";
    var color = "black";
    if (user.usertype === 5) {
      if (item.cur_status === 2) {
        status = lang["Rejected"];
        color = Colors.reject;
      } else {
        if (item.sales_person_approve === 1) {
          status = lang["Approved"];
          color = Colors.green;
        } else {
          status = lang["Pending"];
          color = Colors.orange;
        }
      }
    } else if (user.usertype === 1) {
      if (item.sales_manager_approve === 1) {
        status = lang["Approved"];
        color = Colors.green;
      } else if (item.sales_manager_approve === 2) {
        status = lang["Rejected"];
        color = Colors.reject;
      } else {
        status = lang["Pending"];
        color = Colors.orange;
      }
    } else {
      status = lang["View"];
      color = Colors.green;
    }
    if (
      (user.usertype === 5 && item.sales_person_approve === 0) ||
      (user.usertype === 1 && item.sales_manager_approve === 0) ||
      user.usertype === 3 ||
      user.usertype === 2
    ) {
      return (
        <Pressable
          onPress={() =>
            navigation.push("ManifoldCustomization", {
              manifoldId: item.id,
              item: item,
              routingFrom: "ManifoldListNotification",
              //   item,
              //   routingFrom: "ManifoldList",
              onNavigatingBack: handleBack,
            })
          }
        >
          {_renderData(item, index, status, color)}
        </Pressable>
      );
    } else {
      return _renderData(item, index, status, color);
    }
  };
  const _renderData = (item, index, status, color) => {
    return (
      <View
        style={styles.rowView}
        // onPress={() => onItem(item, index)}
      >
        <View style={styles.dateView}>
          <Text style={styles.text}>
            {moment(item.now).format("YYYY-MM-DD")}
          </Text>
        </View>
        <View style={styles.nameView}>
          <Text style={styles.text}>{item.name}</Text>
        </View>
        <View style={styles.statusView}>
          <Text style={[styles.text, { color: color }]}>{status}</Text>
        </View>
      </View>
    );
  };
  const _renderHeader = ({ item, index }) => {
    // console.log(item)
    return (
      <View
        style={styles.rowHeader}
        // onPress={() => onItem(item, index)}
      >
        <View style={styles.dateView}>
          <Text style={styles.header}>{lang["Date"]}</Text>
        </View>
        <View style={styles.nameView}>
          <Text style={styles.header}>{lang["Name"]}</Text>
        </View>
        <View style={styles.statusView}>
          <Text style={styles.header}>{lang["Status"]}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Header />
      </View>
      <View style={styles.content}>
        <BackgroundView />

        <View style={styles.contentView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.headerText}>
              {lang["Manifold Customization"]}
            </Text>
            {spinner ? (
              <View style={{ marginTop: 40 }}>
                <Spinner initialLoad />
              </View>
            ) : manifoldList && manifoldList.length > 0 ? (
              <View>
                {user.usertype === 2 ? (
                  <Pressable
                    style={styles.requestButton}
                    onPress={() =>
                      navigation.push("ManifoldCustomization", {
                        onNavigatingBack: handleBack,
                      })
                    }
                  >
                    <Text style={styles.requestButtonText}>
                      {lang["New Request"]}
                    </Text>
                  </Pressable>
                ) : null}

                <FlatList
                  data={manifoldList}
                  renderItem={_renderItem}
                  keyExtractor={(item) => item.id}
                  ListHeaderComponent={_renderHeader}
                  // numColumns={3}
                  style={styles.flatlist}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            ) : (
              <Text style={styles.noData}>{lang["No Data Found"]}</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.overlayWhite,
  },
  text: {
    fontSize: rf(1.5),
    fontFamily: Fonts.regular,
    textAlign: "left",
  },
  header: {
    fontSize: rf(1.5),
    fontFamily: Fonts.medium,
    textAlign: "left",
  },
  noData: {
    fontSize: rf(1.8),
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginTop: 15,
  },
  headerText: {
    fontSize: rf(2),
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginBottom: 5,
  },
  flatlist: {
    backgroundColor: "#f2f2f27a",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  rowHeader: {
    flexDirection: "row",
    padding: 10,
  },
  dateView: { flex: 0.3 },
  nameView: { flex: 0.4 },
  statusView: { flex: 0.3, alignItems: "flex-end" },
  rowView: {
    flex: 1,
    // backgroundColor: "#0e0e0e0a",
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: Colors.lightgrey,
    padding: 10,
    // borderBottomLeftRadius: index + 1 === manifoldList.length ? 5 : 0,
    // borderBottomRightRadius: index + 1 === manifoldList.length ? 5 : 0
  },
  headerView: { flex: 0.1 },
  content: { flex: 0.9 },
  requestButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.theme,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginHorizontal: 15,
  },
  requestButtonText: {
    color: "white",
    fontFamily: Fonts.medium,
    fontSize: rf(1.5),
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
