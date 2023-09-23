import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  I18nManager,
  Pressable,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import styles from "./styles";
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
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
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
        />
      </View>
    </View>
  );
}
export default function ManifoldCustomization({ route }) {
  const { lang, setLang } = useContext(LanguageContext);
  const { user, setUser } = useContext(UserContext);
  const [lineType, setLineType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const [item, setItem] = useState(null);
  const navigation = useNavigation();
  const ValidationSchema = Yup.object().shape({
    qty: Yup.string().required(lang["Please enter quantity"]),
  });
  const placeholder = {
    label: lang["Select Option"],
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
  useEffect(() => {
    if (
      (route.params && route.params.item) ||
      route.params.routingFrom === "Home" ||
      route.params.routingFrom === "ManifoldListNotification"
    ) {
      if (route.params && route.params.manifoldId) {
        fetchManifoldNotification();
      }
      if (route.params.item) {
        setItem(route.params.item);
        if (route.params.item.type === 1) {
          setLineType({
            label: lang["Left Line"],
            value: "1",
          });
        } else {
          setLineType({
            label: lang["Right Line"],
            value: "2",
          });
        }
      }
    } else {
      console.log("object");
      setSpinner(false);
    }
  }, []);
  function fetchManifoldNotification() {
    services(
      constants.API_BASE_URL + "/manifolds_id?id=" + route.params.manifoldId
    ).then((response) => {
      if (response) {
        // console.log(response, "0000000");
        // setLoading(false)
        if (response) {
          setItem(response[0]);
          if (response[0].type === 1) {
            setLineType({
              label: lang["Left Line"],
              value: "1",
            });
          } else {
            setLineType({
              label: lang["Right Line"],
              value: "2",
            });
          }
          setSpinner(false);
        } else {
          setSpinner(false);
        }
      }
    });
  }
  function onSubmit(values) {
    // console.log(".....", values)
    if (lineType) {
      if (user.usertype === 2) {
        onSubmitCustomer(values);
      } else if (user.usertype === 5) {
        onSubmitSalesPerson();
      } else {
      }
    } else {
      Alert.alert(lang["KTP"], lang["Please select line type"], [
        { text: lang["Ok"] },
      ]);
    }
  }
  function onSubmitSalesPerson() {
    setLoading(true);
    var sendData = {
      sales_person: user.id.toString(),
      manifold_id: item.id.toString(),
      status: "1",
    };
    services(
      constants.API_BASE_URL + "/manifold_saleperson_approve",
      sendData,
      "POST"
    ).then((response) => {
      if (response) {
        // console.log(response, "0000000")
        setLoading(false);
        if (response.status === "Success") {
          Alert.alert(lang["KTP"], response.message, [
            {
              text: lang["Ok"],
              onPress: () => {
                if (route.params && route.params.onNavigatingBack) {
                  route.params.onNavigatingBack();
                }
                navigation.pop();
              },
            },
          ]);
        } else {
          Alert.alert(lang["KTP"], response.message, [{ text: lang["Ok"] }]);
        }
      }
    });
  }
  function onSubmitSalesManager(status) {
    setLoading(true);
    var sendData = {
      sales_manager: user.id.toString(),
      manifold_id: item.id.toString(),
      status: status.toString(),
    };
    console.log(sendData, ".........");
    services(
      constants.API_BASE_URL + "/manifold_salemanager_approve",
      sendData,
      "POST"
    ).then((response) => {
      if (response) {
        // console.log(response, "0000000")
        setLoading(false);
        if (response.status === "Success") {
          Alert.alert(lang["KTP"], response.message, [
            {
              text: lang["Ok"],
              onPress: () => {
                if (route.params && route.params.onNavigatingBack) {
                  route.params.onNavigatingBack();
                }
                navigation.pop();
              },
            },
          ]);
        } else {
          Alert.alert(lang["KTP"], response.message, [{ text: lang["Ok"] }]);
        }
      }
    });
  }
  function onSendEmail() {
    setLoading(true);
    var sendData = {
      member_id: user.id.toString(),
      manifold_id: item.id.toString(),
    };
    services(constants.API_BASE_URL + "/manifold_mail", sendData, "POST").then(
      (response) => {
        if (response) {
          // console.log(response, "0000000")
          setLoading(false);
          if (response.status === "Success") {
            Alert.alert(lang["KTP"], response.message, [
              {
                text: lang["Ok"],
                onPress: () => {
                  if (route.params && route.params.onNavigatingBack) {
                    route.params.onNavigatingBack();
                  }
                  navigation.pop();
                },
              },
            ]);
          } else {
            Alert.alert(lang["KTP"], response.message, [{ text: lang["Ok"] }]);
          }
        }
      }
    );
  }
  function onSubmitCustomer(values) {
    setLoading(true);
    var sendData = {
      member_id: user.id.toString(),
      type: lineType.toString(),
      quantity: values.qty,
      description: values.comment,
    };

    services(constants.API_BASE_URL + "/manifold", sendData, "POST").then(
      (response) => {
        if (response) {
          // console.log(response, "0000000")
          setLoading(false);
          if (response.status === "Success") {
            Alert.alert(lang["KTP"], response.message, [
              {
                text: lang["Ok"],
                onPress: () => {
                  if (route.params && route.params.onNavigatingBack) {
                    route.params.onNavigatingBack();
                  }
                  navigation.pop();
                },
              },
            ]);
          } else {
            Alert.alert(lang["KTP"], response.message, [{ text: lang["Ok"] }]);
          }
        }
      }
    );
  }
  function renderButtons() {
    return (
      <View style={styles.buttonsView}>
        <Pressable
          style={[
            styles.buttonsStyle,
            {
              marginRight: 10,
            },
          ]}
          onPress={() => onSubmitSalesManager("1")}
        >
          <Text style={styles.buttonsText}>{lang["Approve"]}</Text>
        </Pressable>
        <Pressable
          style={styles.buttonsStyle}
          onPress={() => onSubmitSalesManager("2")}
        >
          <Text style={styles.buttonsText}>{lang["Reject"]}</Text>
        </Pressable>
      </View>
    );
  }
  console.log(item, "spinner");
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.1 }}>
        <Header />
      </View>
      <View style={{ flex: 0.9 }}>
        <BackgroundView />

        <View style={styles.contentView}>
          <Text style={styles.headerText}>
            {lang["Manifold Customization"]}
          </Text>
          {spinner ? (
            <Spinner initialLoad={true} />
          ) : (
            <KeyboardAwareScrollView>
              <Formik
                initialValues={{
                  customerId: route.params && item ? item.c_code : user.c_code,
                  name: route.params && item ? item.name : user.fullname,
                  qty:
                    route.params && item && item.quantity
                      ? item.quantity.toString()
                      : "1",
                  comment: route.params && item ? item.description : "",
                }}
                validationSchema={ValidationSchema}
                onSubmit={onSubmit}
                enableReinitialize
              >
                {({
                  errors,
                  touched,
                  values,
                  handleBlur,
                  handleSubmit,
                  handleChange,
                }) => (
                  <View style={styles.subContent}>
                    <TextInputs
                      inputStyle={styles.inputStyle}
                      placeholder={lang["Customer ID"]}
                      placeholderTextColor="grey"
                      value={values.customerId}
                      onChangeText={handleChange("customerId")}
                      onBlur={handleBlur("customerId")}
                      errors={errors.customerId}
                      touched={touched.customerId}
                      title={lang["Customer ID"]}
                      editable={false}
                    />
                    <TextInputs
                      inputStyle={styles.inputStyle}
                      placeholder={lang["Name"]}
                      placeholderTextColor="grey"
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      errors={errors.name}
                      touched={touched.name}
                      title={lang["Name"]}
                      editable={false}
                    />
                    {/* <TextInputs
                                        inputStyle={{
                                            paddingLeft: 10, padding: 0, margin: 0, backgroundColor: Colors.f2f2f2, borderWidth: 1, borderColor: "#cbcbcb", fontFamily: Fonts.regular,
                                            color: "black",
                                            textAlign: I18nManager.isRTL ? "right" : "left"
                                        }}
                                        placeholder={lang["Line Type"]}
                                        placeholderTextColor="grey"
                                        value={values.name}
                                        onChangeText={handleChange("name")}
                                        onBlur={handleBlur("name")}
                                        errors={errors.name}
                                        touched={touched.name}
                                        title={lang["Line Type"]}
                                    // editable={editableText}
                                    /> */}
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <View style={{ flex: 0.35, justifyContent: "center" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.regular,
                            textAlign: "left",
                          }}
                        >
                          {lang["Line Type"]}
                        </Text>
                      </View>
                      <View style={{ flex: 0.65 }}>
                        {route.params && item ? (
                          <View style={styles.pickerView}>
                            <Text style={styles.pickerText}>
                              {item
                                ? item.type === 1
                                  ? lang["Left Line"]
                                  : lang["Right Line"]
                                : ""}
                            </Text>
                          </View>
                        ) : (
                          <RNPickerSelect
                            placeholder={placeholder}
                            onValueChange={(value) => {
                              setLineType(value);
                            }}
                            items={lines}
                            useNativeAndroidPickerStyle={false}
                            // value={city}
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
                        )}
                      </View>
                    </View>
                    <TextInputs
                      inputStyle={[styles.inputStyle, { textAlign: "center" }]}
                      placeholder={lang["Quantity"]}
                      placeholderTextColor="grey"
                      value={values.qty}
                      onChangeText={handleChange("qty")}
                      onBlur={handleBlur("qty")}
                      errors={errors.qty}
                      touched={touched.qty}
                      title={lang["Quantity"]}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      editable={user.usertype === 2 && !item ? true : false}
                    />
                    <TextInputs
                      inputStyle={styles.inputStyleComment}
                      placeholder={lang["Write Here..."]}
                      placeholderTextColor="grey"
                      value={values.comment}
                      onChangeText={handleChange("comment")}
                      onBlur={handleBlur("comment")}
                      errors={errors.comment}
                      touched={touched.comment}
                      title={lang["Comment"]}
                      height={90}
                      multiline
                      editable={user.usertype === 2 && !item ? true : false}
                    />
                    {user.usertype === 1 ? (
                      renderButtons()
                    ) : user.usertype === 3 ? (
                      <View style={styles.buttonView}>
                        <Pressable
                          style={styles.buttonStyle}
                          onPress={onSendEmail}
                        >
                          <Text style={styles.btnText}>
                            {lang["Send"]} {lang["Email"]}
                          </Text>
                        </Pressable>
                      </View>
                    ) : user.usertype === 2 && item ? null : (
                      <View style={styles.buttonView}>
                        <Pressable
                          style={styles.buttonStyle}
                          onPress={handleSubmit}
                        >
                          <Text style={styles.btnText}>{lang["Submit"]}</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                )}
              </Formik>
            </KeyboardAwareScrollView>
          )}
        </View>
      </View>
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
  },
});
