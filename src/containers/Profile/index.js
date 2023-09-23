import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  I18nManager,
  Pressable,
} from "react-native";
import { UserContext } from "@context/user-context";
import { BackgroundView, TextField, Spinner } from "@common";
import { Header } from "@components";
import { useNavigation } from "@react-navigation/native";
import { Fonts, Colors } from "@Themes";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import services from "@services";
import constants from "@constants";
import { LanguageContext } from "@context/lang-context";
import styles from "./styles";
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
}) {
  return (
    <View style={styles.textFieldView}>
      <View style={styles.titleView}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.textInput}>
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
        />
      </View>
    </View>
  );
}
export default function Profile(props) {
  const { lang, setLang } = useContext(LanguageContext);
  const navigation = useNavigation();
  const [editableText, setEditableText] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const ValidationSchema = Yup.object().shape({
    fullName: Yup.string().required(lang["Please Enter Your Name"]),
    email: Yup.string()
      .email(lang["Please enter valid email"])
      .required(lang["Please Enter Your Email address"]),
    cr_number: Yup.string().required(lang["Please Enter Your CR Number"]),
  });
  const ValidationSchema2 = Yup.object().shape({
    fullName: Yup.string().required(lang["Please Enter Your Name"]),
    email: Yup.string()
      .email(lang["Please enter valid email"])
      .required(lang["Please Enter Your Email address"]),
  });

  function onSubmit(values) {
    setEditableText(false);
    console.log(values, "valuesvaluesvalues");
    // setLoading(true)
    var data = {
      member_id: user.id,
      fullname: values.fullName,
      email: values.email,
      mobile: user.mobile,
      usertype: user.usertype.toString(),
      city: user.city.toString(),
      cr_number:
        user.usertype === 12 || user.usertype === 2 ? values.cr_number : "",
    };
    // console.log(data, "datadatadata")
    services(constants.API_BASE_URL + "/update_member", data, "POST").then(
      (response) => {
        if (response) {
          console.log(response, "onSubmitonSubmit");
          // setLoading(false)
          fetchProfile(user.id);
        }
      }
    );
  }
  function fetchProfile(userId) {
    services(constants.API_BASE_URL + "/members/" + userId).then((response) => {
      if (response) {
        // console.log(response, "onSubmitonSubmit")

        setUser(response[0]);
        setLoading(false);
        // navigation.pop()
        // fetchProfile(response.id)
      }
    });
  }
  function onBackPress() {
    if (editableText) {
      setEditableText(false);
    } else {
      // console.log("pppp,,,...")
      props.onBack();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Header onBack={() => onBackPress()} />
      </View>
      <View style={styles.content}>
        <BackgroundView />

        <View style={styles.contentView}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>{lang["My Profile"]}</Text>
            {!editableText ? (
              <View style={styles.buttonView}>
                <Pressable
                  style={styles.editButtonView}
                  onPress={() => setEditableText(true)}
                >
                  <Text style={styles.editBtnText}>{lang["Edit Profile"]}</Text>
                </Pressable>
              </View>
            ) : null}

            <Formik
              initialValues={{
                fullName: user ? user.fullname : "",
                email: user ? user.email : "",
                cr_number: user ? user.cr_number : "",
              }}
              validationSchema={
                user && (user.usertype === 12 || user.usertype === 2)
                  ? ValidationSchema
                  : ValidationSchema2
              }
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
              }) => {
                return (
                  <View style={styles.formView}>
                    <TextInputs
                      inputStyle={styles.inputStyle}
                      placeholder={lang["Please Enter Your Name"]}
                      placeholderTextColor="grey"
                      value={values.fullName}
                      onChangeText={handleChange("fullName")}
                      onBlur={handleBlur("fullName")}
                      errors={errors.fullName}
                      touched={touched.fullName}
                      title={lang["Full Name"]}
                      editable={editableText}
                    />
                    <TextInputs
                      inputStyle={styles.inputStyle}
                      placeholder={lang["Please Enter Email Address"]}
                      placeholderTextColor="grey"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      errors={errors.email}
                      touched={touched.email}
                      title={lang["Email"]}
                      editable={editableText}
                    />
                    <TextInputs
                      inputStyle={styles.inputStyle2}
                      placeholder={lang["Please Enter Phone Number"]}
                      placeholderTextColor="#303030"
                      title={lang["Phone Number"]}
                      value={user.mobile}
                    />
                    <TextInputs
                      inputStyle={styles.inputStyle2}
                      placeholder={lang["Select City"]}
                      placeholderTextColor="#303030"
                      title={lang["City"]}
                      value={user.city_tit}
                    />
                    <TextInputs
                      inputStyle={styles.inputStyle2}
                      placeholder={lang["Select user Type"]}
                      placeholderTextColor="#303030"
                      title={lang["User Type"]}
                      value={user.usertype_tit}
                    />
                    {user.usertype === 12 || user.usertype === 2 ? (
                      <TextInputs
                        inputStyle={styles.inputStyle}
                        placeholder={lang["Please Enter Your CR Number"]}
                        placeholderTextColor="grey"
                        value={values.cr_number}
                        onChangeText={handleChange("cr_number")}
                        onBlur={handleBlur("cr_number")}
                        errors={errors.cr_number}
                        touched={touched.cr_number}
                        title={lang["CR Number"]}
                        editable={editableText}
                      />
                    ) : null}

                    {editableText ? (
                      <View style={[styles.buttonView, { marginTop: 10 }]}>
                        <Pressable
                          style={styles.submitBtn}
                          onPress={handleSubmit}
                        >
                          <Text style={styles.submitBtnText}>
                            {lang["Submit"]}
                          </Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </View>
                );
              }}
            </Formik>
          </View>
        </View>
      </View>
      {loading && <Spinner />}
    </View>
  );
}
