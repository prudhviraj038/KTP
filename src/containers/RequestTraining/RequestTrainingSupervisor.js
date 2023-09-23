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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import RNPickerSelect from "react-native-picker-select";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
function TextBox({ title, value, isStatus }) {
  const { lang, setLang } = useContext(LanguageContext);
  var color = "black";
  var status = "";
  // if (isStatus) {
  if (value === 0) {
    color = "black";
    status = lang["Under Review"];
  } else if (value === 1) {
    color = Colors.theme;
    status = lang["Assigned"];
  } else if (value === 2) {
    color = Colors.orange;
    status = lang["Started"];
  } else if (value === 3) {
    color = Colors.theme;
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
      <Text style={styles1.text}>{title} </Text>
      <Text style={[styles1.text, { color: isStatus ? color : "black" }]}>
        {" "}
        {isStatus ? status : value}
      </Text>
    </View>
  );
}
function TextInputs({
  inputStyle,
  placeholder,
  placeholderTextColor,
  value,
  onChangeText,
  onBlur,
  errors,
  touched,
  editable,
  title,
  height,
  multiline,
  keyboardType,
  returnKeyType,
}) {
  return (
    <View style={styles.inputView}>
      <View style={styles.inputHeaderView}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.input}>
        <TextField
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          errors={errors}
          touched={touched}
          editable={editable}
          height={height}
          multiline={multiline}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          // defaultValue={value}
        />
      </View>
    </View>
  );
}
function Dropdown({
  value,
  title,
  onBlur,
  style,
  placeholder,
  onValueChange,
  Icon,
  items,
  onChangeText,
}) {
  const { lang, setLang } = useContext(LanguageContext);

  return (
    <View style={styles.inputView}>
      <View style={styles.inputHeaderView}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.input}>
        <RNPickerSelect
          placeholder={placeholder}
          onValueChange={onValueChange}
          items={items}
          useNativeAndroidPickerStyle={false}
          value={value}
          style={style}
          Icon={Icon}
          onBlur={onBlur}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}
function DatePickerText({ value, title, onPress }) {
  const { lang, setLang } = useContext(LanguageContext);

  return (
    <Pressable style={styles.inputView} onPress={onPress}>
      <View style={styles.inputHeaderView}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.input}>
        <View style={styles.datePicker}>
          {value ? (
            <Text style={styles.dateText}>{value}</Text>
          ) : (
            <Text style={[styles.dateText, { color: "grey" }]}>{title}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
export default function RequestTrainingSupervisor({ route }) {
  const { lang, setLang } = useContext(LanguageContext);
  const { user, setUser } = useContext(UserContext);
  const [technician, setTechnician] = useState(null);
  const [technicianList, setTechnicianList] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisibleTime, setDatePickerVisibilityTime] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const navigation = useNavigation();
  const placeholder = {
    label: lang["Technician Name"],
    value: null,
    color: "grey",
    fontFamily: Fonts.medium,
  };
  const lines = [
    {
      label: lang["Left Line"],
      value: "1",
    },
    {
      label: lang["Right Line"],
      value: "2",
    },
  ];
  // console.log(route.params.item.member_id.id, "route.params.itemroute.params.item")
  useEffect(() => {
    if (route.params) {
      if (route.params.item) {
        setItem(route.params.item);
        console.log(route.params.item, "route.params.item");
        fetchTechnicians(route.params.item);
      } else {
        fetchDetails();
      }
    }
  }, []);
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // console.warn("A date has been picked: ", date);
    setSelectedDate(date);
    hideDatePicker();
  };
  const hideDatePickerTime = () => {
    setDatePickerVisibilityTime(false);
  };

  const handleConfirmTime = (date) => {
    // console.warn("A date has been picked: ", date);
    setSelectedTime(date);
    hideDatePickerTime();
  };
  const fetchTechnicians = (value) => {
    // console.log(constants.API_BASE_URL + "/technicians/" + item.city.id, "========")
    services(constants.API_BASE_URL + "/technicians/" + value.city.id).then(
      (response) => {
        if (response) {
          // console.log("responresponseresponsese", response)

          if (response) {
            response.map((res, key) => {
              res.value = res.id;
              res.label = res.fullname;
            });
          }
          setTechnicianList(response);
          setSpinner(false);
        }
      }
    );
  };
  const fetchDetails = () => {
    // console.log(constants.API_BASE_URL + "/technicians/" + item.city.id, "========")
    services(
      constants.API_BASE_URL +
        "/request_training_info/" +
        route.params.trainingId
    ).then((response) => {
      if (response) {
        console.log("responresponseresponsese", response);

        setItem(response);
        fetchTechnicians(response);
        // setSpinner(false)
      }
    });
  };
  function onSubmit() {
    if (!technician) {
      Alert.alert(lang["KTP"], lang["Please select technician"], [
        { text: lang["Ok"] },
      ]);
    } else if (!selectedDate) {
      Alert.alert(lang["KTP"], lang["Please select date"], [
        { text: lang["Ok"] },
      ]);
    } else if (!selectedTime) {
      Alert.alert(lang["KTP"], lang["Please select time"], [
        { text: lang["Ok"] },
      ]);
    } else {
      setLoading(true);
      var body = {
        request_id: item.id.toString(),
        technician_id: technician.toString(),
        date: moment(selectedDate).format("DD-MM-YYYY"),
        time: moment(selectedTime).format("hh:mm A"),
      };
      // console.log(object)
      services(
        constants.API_BASE_URL + "/request_training_assign",
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
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Header />
      </View>
      <View style={styles.content}>
        <BackgroundView />

        <View style={styles.contentView}>
          <View style={styles.subContent}>
            <Text style={styles.headerText}>{lang["Request Training"]}</Text>
            {spinner ? (
              <Spinner initialLoad />
            ) : (
              <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                {item ? (
                  <View style={{ marginTop: 10 }}>
                    <TextInputs
                      inputStyle={[styles.inputStyle2]}
                      placeholder={lang["Customer ID"]}
                      placeholderTextColor="lightgrey"
                      value={item.member_id.id.toString()}
                      title={lang["Customer ID"]}
                      editable={false}
                    />
                    <TextInputs
                      inputStyle={[styles.inputStyle2]}
                      placeholder={lang["Customer Name"]}
                      placeholderTextColor="grey"
                      value={item.member_id.fullname}
                      title={lang["Customer Name"]}
                      editable={false}
                    />
                    <TextInputs
                      inputStyle={[styles.inputStyle2]}
                      placeholder={lang["Customer Phone Number"]}
                      placeholderTextColor="grey"
                      value={item.member_id.mobile}
                      title={lang["Customer Phone Number"]}
                      editable={false}
                    />

                    <TextInputs
                      inputStyle={styles.inputStyle2}
                      placeholder={lang["City"]}
                      placeholderTextColor="grey"
                      value={item.city.title}
                      title={lang["City"]}
                      editable={false}
                    />
                    <TextInputs
                      inputStyle={styles.inputStyle2}
                      placeholder={lang["Area"]}
                      placeholderTextColor="grey"
                      value={item.area}
                      title={lang["Area"]}
                      editable={false}
                    />
                    <TextInputs
                      inputStyle={[
                        styles.inputStyleComment,
                        {
                          backgroundColor: "#969696",
                          borderColor: "#969696",
                        },
                      ]}
                      placeholder={lang["Message"]}
                      placeholderTextColor="grey"
                      value={item.message}
                      title={lang["Message"]}
                      editable={false}
                      height={90}
                      multiline
                    />
                    {item.cur_status === 0 ? (
                      <View>
                        <Dropdown
                          title={lang["Technician Name"]}
                          placeholder={placeholder}
                          onValueChange={(value) => {
                            setTechnician(value);
                          }}
                          items={technicianList}
                          useNativeAndroidPickerStyle={false}
                          value={technician}
                          style={{
                            ...pickerSelectStyles,
                            placeholder: {
                              color: "grey",
                              fontSize: rf(1.7),
                              fontFamily: Fonts.regular,
                            },
                            iconContainer: {
                              top: 12,
                              right: 12,
                            },
                          }}
                          Icon={() => {
                            return (
                              <Image
                                source={Images.icons.downArrow}
                                style={styles.iconStyle}
                              />
                            );
                          }}
                        />
                        <DatePickerText
                          title={lang["Date"]}
                          value={
                            selectedDate
                              ? moment(selectedDate).format("DD-MM-YYYY")
                              : ""
                          }
                          onPress={() => setDatePickerVisibility(true)}
                        />
                        <DatePickerText
                          title={lang["Time"]}
                          value={
                            selectedTime
                              ? moment(selectedTime).format("hh:mm A")
                              : ""
                          }
                          onPress={() => setDatePickerVisibilityTime(true)}
                        />
                        <Pressable
                          style={styles.buttonStyle}
                          onPress={onSubmit}
                        >
                          <Text style={styles.btnText}>{lang["Submit"]}</Text>
                        </Pressable>
                      </View>
                    ) : (
                      <View style={{ marginTop: 10 }}>
                        {/* <TextBox title={lang["Training Id"]} value={item.id} /> */}
                        <TextBox
                          title={lang["Technician Name"]}
                          value={item.technician_id.fullname}
                        />
                        <TextBox title={lang["Date"]} value={item.date} />
                        <TextBox title={lang["Time"]} value={item.time} />
                        <TextBox
                          title={lang["Status"]}
                          value={item.cur_status}
                          isStatus
                        />
                      </View>
                    )}
                  </View>
                ) : null}
              </KeyboardAwareScrollView>
            )}
          </View>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisibleTime}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={hideDatePickerTime}
      />
      {loading && <Spinner />}
    </View>
  );
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: rf(1.7),
    // paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#cbcbcb",
    borderRadius: 4,
    color: "black",
    // paddingRight: 30, // to ensure the text is never behind the icon
    height: rh(5),
    backgroundColor: Colors.f2f2f2,
    // marginTop: 10,
    textAlign: I18nManager.isRTL ? "right" : "left",
    fontFamily: Fonts.regular,
    margin: 0,
    padding: 0,
  },
  inputAndroid: {
    fontSize: rf(1.7),
    paddingHorizontal: 10,
    // paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#cbcbcb",
    borderRadius: 5,
    color: "black",
    // paddingRight: 30, // to ensure the text is never behind the icon
    height: rh(5),
    backgroundColor: Colors.f2f2f2,
    // marginTop: 10,
    textAlign: I18nManager.isRTL ? "right" : "left",
    fontFamily: Fonts.regular,
    margin: 0,
    padding: 0,
  },
});
const styles1 = StyleSheet.create({
  style: {},
});
