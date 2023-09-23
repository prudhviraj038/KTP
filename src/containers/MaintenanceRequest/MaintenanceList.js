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
} from "react-native";
import { BackgroundView, TextField, Spinner } from "@common";
import { Header } from "@components";
import { LanguageContext } from "@context/lang-context";
import { Fonts, Colors, Images } from "@Themes";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "@context/user-context";
import services from "@services";
import constants from "@constants";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";

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
export default function MaintenanceList() {
  const navigation = useNavigation();
  const { lang, setLang } = useContext(LanguageContext);
  const [isFromDatePickerVisible, setFromDatePickerVisibility] =
    useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const [spinner, setSpinner] = useState(true);
  const [loading, setLoading] = useState(false);
  const [technicianList, setTechnicianList] = useState([]);
  // const showFromDatePicker = () => {
  //     setFromDatePickerVisibility(true);
  //   };

  const hideFromDatePicker = () => {
    setFromDatePickerVisibility(false);
  };

  const onConfirmFromDate = (date) => {
    // console.warn("A date has been picked: ", moment(date).format('DD-MM-YYYY'));
    setFromDate(date);
    hideFromDatePicker();
  };

  const hideToDatePicker = () => {
    setToDatePickerVisibility(false);
  };

  const onConfirmToDate = (date) => {
    // console.warn("A date has been picked: ", moment(date).format('DD-MM-YYYY'));
    setToDate(date);
    hideToDatePicker();
  };

  useEffect(() => {
    fetchTechnicianList();
  }, []);
  function handleBack() {
    setLoading(true);
    fetchTechnicianList();
  }
  function onSearch() {
    if (!fromDate) {
      Alert.alert(lang["KTP"], lang["Please select from date"], [
        { text: lang["Ok"] },
      ]);
    } else if (!toDate) {
      Alert.alert(lang["KTP"], lang["Please select to date"], [
        { text: lang["Ok"] },
      ]);
    } else {
      setLoading(true);
      fetchTechnicianList();
    }
  }
  const fetchTechnicianList = () => {
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
      from_date: fromDate ? moment(fromDate).format("DD-MM-YYYY") : "",
      to_date: toDate ? moment(toDate).format("DD-MM-YYYY") : "",
    };
    // console.log("....bodybody.", body)
    services(
      constants.API_BASE_URL + "/technician_requests",
      body,
      "POST"
    ).then((response) => {
      if (response && response.length > 0) {
        // console.log(".....", response)

        // fetchPages()
        // console.log(response[0].description, "responsesresponsesresponses")

        // setData(response[0].description)
        setTechnicianList(response);
        setSpinner(false);
        setLoading(false);
        // getCountry();
      } else {
        setSpinner(false);
        setLoading(false);
      }
    });
  };

  function dialCall(mobile) {
    Linking.openURL(`tel:${mobile}`);
  }

  function _renderItem({ item, index }) {
    // console.log(item.mobile, "mobilemobilemobilemobile")
    var status = "";
    var color = Colors.lightblack;
    var mobile = "";
    var name = "";
    if (item.cur_status === 0) {
      status = lang["Assigned"];
      color = Colors.lightblack;
    } else if (item.cur_status === 1) {
      status = lang["Started"];
      color = Colors.ff7113;
    } else if (item.cur_status === 2) {
      status = lang["Completed"];
      color = Colors.lightGreen;
    } else {
      status = lang["Rejected"];
      color = Colors.reject;
    }
    if (user.usertype === 2 || user.usertype === 11) {
      mobile = item.technician.mobile;
      name = item.technician.fullname;
    } else if (user.usertype === 7) {
      mobile = item.member.mobile;
      name = item.member.fullname;
    }
    return user.usertype === 2 || user.usertype === 3 ? (
      <Pressable
        onPress={() =>
          navigation.push("ViewMaintenance", {
            item,
            name,
            status,
            color,
            mobile,
          })
        }
      >
        {_renderData(item, index, status, color, mobile, name)}
      </Pressable>
    ) : (
      _renderData(item, index, status, color, mobile, name)
    );
  }
  function _renderData(item, index, status, color, mobile, name) {
    return (
      <View style={styles.rowContainer}>
        <TextView title={lang["Request Id"]} text={item.code} isTitle />

        <TextView
          title={lang["Date/Time"]}
          text={
            moment(item.date).format("YYYY-MM-DD") + "/" + item.time
            // moment(item.now).format("hh:mm")
          }
        />
        {user.usertype === 3 ? (
          <View>
            <TextView
              title={lang["Technician"]}
              text={item.technician.fullname}
            />
            <TextView title={lang["Customer"]} text={item.member.fullname} />
          </View>
        ) : (
          <TextView
            title={user.usertype === 7 ? lang["Customer"] : lang["Technician"]}
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
        {user.usertype === 7 ? (
          <Pressable
            style={styles.viewBtn}
            onPress={() =>
              navigation.push("ViewMaintenance", {
                item,
                name,
                status,
                color,
                mobile,
                onNavigatingBack: handleBack,
              })
            }
          >
            <Text style={styles.viewText}>{lang["View"]}</Text>
          </Pressable>
        ) : null}
      </View>
    );
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
            <ScrollView>
              <View style={styles.subContainer}>
                <Text style={styles.headerText}>
                  {lang["Maintenance Request"]}
                </Text>
                {user.usertype === 2 || user.usertype === 11 ? (
                  <View>
                    <View style={styles.nameView}>
                      <Text style={styles.name}>{user.fullname}</Text>
                      <Pressable
                        style={styles.requestButton}
                        onPress={() =>
                          navigation.push("AddMaintenanceRequest", {})
                        }
                      >
                        <Text style={styles.requestButtonText}>
                          {lang["New Request"]}
                        </Text>
                      </Pressable>
                    </View>
                    <Text style={styles.subHeader}>
                      {lang["click button to rise new maintenance request"]}
                    </Text>
                    <View style={styles.borderView} />
                  </View>
                ) : null}

                <View style={styles.dateView}>
                  <View style={styles.fromDateView}>
                    <Text style={styles.fromDateText}>{lang["From Date"]}</Text>
                    <Pressable
                      style={styles.buttonView}
                      onPress={() => setFromDatePickerVisibility(true)}
                    >
                      <Text style={styles.dateText}>
                        {fromDate
                          ? moment(fromDate).format("DD-MM-YYYY")
                          : "dd-mm-yyyy"}
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.emptyView} />
                  <View style={styles.fromDateView}>
                    <Text style={styles.fromDateText}>{lang["To Date"]}</Text>
                    <Pressable
                      style={styles.buttonView}
                      onPress={() => setToDatePickerVisibility(true)}
                    >
                      <Text style={styles.dateText}>
                        {toDate
                          ? moment(toDate).format("DD-MM-YYYY")
                          : "dd-mm-yyyy"}
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.emptyView} />
                  <View style={styles.searchButtonView}>
                    <Pressable
                      style={styles.searchButton}
                      onPress={() => onSearch()}
                    >
                      <Text style={styles.searchText}>{lang["Search"]}</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={[styles.borderView, { marginVertical: 8 }]} />
                <Text style={styles.subHeaderText}>
                  {lang["Maintenance List"]}
                </Text>

                {technicianList && technicianList.length > 0 ? (
                  <FlatList
                    data={technicianList}
                    renderItem={_renderItem}
                    keyExtractor={(item) => item.id}
                  />
                ) : (
                  <Text style={styles.emptyText}>
                    {lang["Requests are empty"]}
                  </Text>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isFromDatePickerVisible}
        mode="date"
        onConfirm={onConfirmFromDate}
        onCancel={hideFromDatePicker}
      />
      <DateTimePickerModal
        isVisible={isToDatePickerVisible}
        mode="date"
        onConfirm={onConfirmToDate}
        onCancel={hideToDatePicker}
        minimumDate={new Date(fromDate)}
      />
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
  nameView: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: rf(1.6),
    fontFamily: Fonts.medium,
  },
  requestButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.theme,
    borderRadius: 5,
  },
  requestButtonText: {
    color: "white",
    fontFamily: Fonts.medium,
    fontSize: rf(1.5),
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  subHeader: {
    textAlign: "right",
    fontSize: rf(1.5),
    fontFamily: Fonts.regular,
    color: Colors.grey,
    marginVertical: 10,
  },
  borderView: { borderBottomWidth: 0.5, borderColor: "grey" },
  dateView: { flexDirection: "row", marginVertical: 10 },
  fromDateView: { flex: 0.35 },
  fromDateText: {
    fontSize: rf(1.6),
    fontFamily: Fonts.medium,
    textAlign: "left",
  },
  buttonView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.f2f2f2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#cbcbcb",
    height: rh(4),
    marginTop: 10,
    width: "100%",
  },
  emptyView: { flex: 0.03 },
  searchButtonView: { flex: 0.24, justifyContent: "flex-end" },
  searchButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.theme,
    height: rh(4),
  },
  searchText: {
    color: Colors.theme,
    fontFamily: Fonts.medium,
    fontSize: rf(1.7),
    paddingHorizontal: 10,
  },
  dateText: {
    color: Colors.lightblack,
    fontFamily: Fonts.medium,
    fontSize: rf(1.5),
  },
  subHeaderText: {
    fontSize: rf(1.8),
    fontFamily: Fonts.regular,
    marginVertical: 5,
    textAlign: "left",
  },
  emptyText: {
    fontSize: rf(1.6),
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginTop: 15,
  },
  rowContainer: {
    marginBottom: rh(1.5),
    padding: rh(1.5),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
  },
  textContainer: { flexDirection: "row", justifyContent: "space-between" },
  text1: { fontSize: rf(1.6), fontFamily: Fonts.regular },
  viewBtn: {
    backgroundColor: Colors.theme,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    borderRadius: 5,
  },
  viewText: {
    fontSize: rf(1.5),
    fontFamily: Fonts.medium,
    color: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
