import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  I18nManager,
  Pressable,
} from "react-native";
import styles from "./styles";
import { HeaderAuth } from "@components";
import { TextField, BackgroundView, KeyboardShift, Spinner } from "@common";
import { Images, Colors, Fonts } from "@Themes";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
const { height, width } = Dimensions.get("window");
import services from "@services";
import constants from "@constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "@context/user-context";
import { LanguageContext } from "@context/lang-context";
import { TokenContext } from "@context/token-context";
export default function Login() {
  const navigation = useNavigation();
  const { lang, setLang } = useContext(LanguageContext);
  const { deviceInfo, setDeviceInfo } = useContext(TokenContext);
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const LoginSchema = Yup.object().shape({
    mobile: Yup.string()
      .required(lang["Please Enter Phone Number"])
      .max(9, lang["Please Enter Valid Phone Number"])
      .min(9, lang["Please Enter Valid Phone Number"]),
    password: Yup.string().required(lang["Please Enter Password"]),
  });
  useEffect(() => {}, [deviceInfo]);
  function onSubmit(values) {
    setLoading(true);
    services(constants.API_BASE_URL + "/login", values, "POST").then(
      (response) => {
        if (response.status === "Failed") {
          // console.log(response, "onSubmitonSubmit")
          // setLoading(false)
          alert(response.message);
          setLoading(false);
        } else {
          fetchProfile(response.id);
        }
      }
    );
  }
  function fetchProfile(userId) {
    services(constants.API_BASE_URL + "/members/" + userId).then((response) => {
      if (response) {
        // console.log(response, "onSubmitonSubmit")

        AsyncStorage.setItem("@USERID", JSON.stringify(userId));
        setUser(response[0]);
        onRegisterDevice(userId);
        // fetchProfile(response.id)
      }
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
          // if (response.status === "Success") {
          // console.log(response, "response=====token_registertoken_register")
          // setUser(response[0]);
          setLoading(false);
          navigation.pop();
          // } else {
          //     setLoading(false)
          //     navigation.pop()
          // }
        })
        .catch((error) => {
          // console.log(error, "eerrrrrppppp")
        });
    } else {
      setLoading(false);
      navigation.pop();
    }
  }

  return (
    <View style={styles.container}>
      <BackgroundView />

      <View style={styles.contentView}>
        <View style={{ flex: 1 }}>
          <ScrollView>
            <KeyboardAwareScrollView>
              <View style={styles.container}>
                <View style={styles.headerView}>
                  <HeaderAuth />
                </View>
                <Formik
                  initialValues={{
                    password: "",
                    mobile: "",
                  }}
                  validationSchema={LoginSchema}
                  onSubmit={onSubmit}
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
                      <View>
                        <Text style={styles.headerText}>
                          {lang["Mobile Number"]}
                        </Text>
                        <View style={{ flexDirection: "row", marginTop: 8 }}>
                          <View style={{ flex: 0.2 }}>
                            <TextField
                              style={styles.textInputCode}
                              placeholder={"+966"}
                              placeholderTextColor="black"
                              // keyboardType="number-pad"
                            />
                          </View>
                          <View style={{ flex: 0.8, marginLeft: 10 }}>
                            <TextField
                              style={styles.textInput}
                              placeholder={"XXXXXXXXX"}
                              placeholderTextColor="grey"
                              value={values.mobile}
                              onChangeText={handleChange("mobile")}
                              onBlur={handleBlur("mobile")}
                              errors={errors.mobile}
                              touched={touched.mobile}
                              maxLength={9}
                              keyboardType="number-pad"
                              returnKeyType="done"
                            />
                          </View>
                        </View>
                      </View>
                      <View style={{ marginTop: 15 }}>
                        <Text style={styles.headerText}>
                          {lang["Password"]}
                        </Text>
                        <TextField
                          style={[styles.textInput, { marginTop: 10 }]}
                          placeholder={lang["Please Enter Password"]}
                          placeholderTextColor="grey"
                          secureTextEntry={true}
                          value={values.password}
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          errors={errors.password}
                          touched={touched.password}
                        />
                      </View>
                      <Pressable
                        style={styles.buttonView}
                        onPress={handleSubmit}
                      >
                        <Text style={styles.buttonText}>{lang["Login"]}</Text>
                      </Pressable>
                      <Pressable
                        style={styles.signUpButton}
                        onPress={() => navigation.push("SignUp")}
                      >
                        <Text style={styles.signUpText}>{lang["Signup?"]}</Text>
                      </Pressable>
                    </View>
                  )}
                </Formik>
              </View>
            </KeyboardAwareScrollView>
          </ScrollView>
        </View>
      </View>
      {loading && <Spinner />}
    </View>
  );
}
