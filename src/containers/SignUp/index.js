import React, { useState, useEffect, useContext } from 'react'
import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView, TextInput, StyleSheet, ActivityIndicator } from 'react-native'
import styles from './styles';
import { HeaderAuth } from '@components'
import { TextField, BackgroundView, Spinner } from '@common'
import { Images, Colors, Fonts } from '@Themes';
import services from "@services"
import RNPickerSelect from 'react-native-picker-select';
import constants from "@constants";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { I18nManager } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from "@context/user-context";
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '@context/lang-context';
import { TokenContext } from '@context/token-context';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
export default function SignUp() {
    const navigation = useNavigation();
    const { user, setUser } = useContext(UserContext);
    const { lang, setLang } = useContext(LanguageContext);
    const { deviceInfo, setDeviceInfo } = useContext(TokenContext);
    const [type, setType] = useState(null)
    const [city, setCity] = useState(null);
    const [spinner, setSpinner] = useState(true);
    const [types, setTypes] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const SignupSchema = Yup.object().shape({
        fullName: Yup.string()
            .required(lang['Please Enter Your Name']),
        email: Yup.string().email(lang['Please enter valid email']).required(lang['Please Enter Your Email address']),
        mobile: Yup.string().required(lang['Please Enter Phone Number'])
            .max(9, lang["Please Enter Valid Phone Number"])
            .min(9, lang["Please Enter Valid Phone Number"]),
        password: Yup.string().required(lang['Please Enter Password']),
        confirmPassword: Yup.string().required(lang['Please Enter Confirm Password'])
            .oneOf([Yup.ref('password'), null], lang['Please Enter Same Password']),
    });
    const SignupSchema2 = Yup.object().shape({
        fullName: Yup.string()
            .required(lang['Please Enter Your Name']),
        email: Yup.string().email(lang['Please enter valid email']).required(lang['Please Enter Your Email address']),
        mobile: Yup.string().required(lang['Please Enter Phone Number'])
            .max(9, lang["Please Enter Valid Phone Number"])
            .min(9, lang["Please Enter Valid Phone Number"]),
        password: Yup.string().required(lang['Please Enter Password']),
        confirmPassword: Yup.string().required(lang['Please Enter Confirm Password'])
            .oneOf([Yup.ref('password'), null], lang['Please Enter Same Password']),
        crNumber: Yup.string().required(lang['Please Enter Your CR Number'])
    });
    const placeholder = {
        label: lang['Please select user type'],
        value: null,
        color: 'grey',
        fontFamily: Fonts.medium
    };
    const placeholder1 = {
        label: lang['Please select city'],
        value: null,
        color: 'grey',
        fontFamily: Fonts.medium
    };
    useEffect(() => {
        fetchUserTypes()
    }, [deviceInfo])
    const fetchUserTypes = () => {
        services(constants.API_BASE_URL + "/user_types").then((response) => {
            if (response) {
                // console.log("responresponseresponsese", response)

                if (response) {
                    response.map((res, key) => {
                        res.value = res.id;
                        res.label = I18nManager.isRTL ? res.title_ar : res.title;

                    })
                }
                setTypes(response)
                fetchCities()
                // setSpinner(false)
            }
        });
    };
    const fetchCities = () => {
        services(constants.API_BASE_URL + "/cities").then((response) => {
            if (response) {
                // console.log("responresponseresponsese", response)

                if (response) {
                    response.map((res, key) => {
                        res.value = res.id;
                        res.label = I18nManager.isRTL ? res.title_ar : res.title;

                    })
                }
                setCities(response)

                setSpinner(false)
            }
        });
    };
    function onSubmit(values) {
        if (!type) {
            Alert.alert(
                lang["KTP"],
                lang["Please select user type"],
                [

                    { text: lang["Ok"], }
                ]
            );
        } else if (!city) {
            Alert.alert(
                lang["KTP"],
                lang["Please select city"],
                [

                    { text: lang["Ok"], }
                ]
            );
        } else {


            setLoading(true)
            var data = {
                "fullname": values.fullName,
                "email": values.email,
                "mobile": values.mobile,
                "usertype": type.toString(),
                "city": city.toString(),
                "cr_number": type === 2 || type === 12 ? values.crNumber : "",
                "password": values.password
            }
            // console.log(data, "============data")
            services(constants.API_BASE_URL + "/register", data, "POST").then((response) => {
                if (response.status === "Failed") {
                    alert(response.message)
                    setLoading(false)

                    // setLoading(false)
                } else {
                    // console.log(response, "onSubmitonSubmit")
                    fetchProfile(response.member_id)
                }
            });
        }
    }
    function fetchProfile(userId) {
        services(constants.API_BASE_URL + "/members/" + userId).then((response) => {
            if (response) {
                // console.log(response, "onSubmitonSubmit")

                AsyncStorage.setItem(
                    '@USERID',
                    JSON.stringify(userId)
                );
                setUser(response[0])
                onRegisterDevice(userId)
                // setLoading(false)
                // navigation.pop()
                // fetchProfile(response.id)
            }
        });
    }
    function onRegisterDevice(userId) {
        // console.log(constants.API_BASE_URL + "/members/" + userId, "====")
        if (deviceInfo) {
            var data = {
                "device_token": deviceInfo.device_token,
                "device_id": deviceInfo.device_id,
                "device_type": deviceInfo.device_type,
                "member_id": userId.toString(),
            }
            services(constants.API_BASE_URL + "/token_register", data, "POST").then((response) => {
                // if (response.status === "Success") {
                // console.log(response, "response=====token_registertoken_register")
                // setUser(response[0]);
                setLoading(false)
                navigation.pop()
                // } else {
                //     setLoading(false)
                //     navigation.pop()
                // }
            }).catch((error) => {
                // console.log(error, "eerrrrrppppp")
            });
        } else {
            setLoading(false)
            navigation.pop()
        }
    }

    if (spinner) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Spinner initialLoad />
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <BackgroundView />

                <View style={styles.contentView}>
                    <View style={{ flex: 1 }}>
                        <ScrollView >
                            <KeyboardAwareScrollView>


                                <View style={{ flex: 1 }}>
                                    <View style={styles.headerView}>
                                        <HeaderAuth />
                                    </View>

                                    <Formik
                                        initialValues={{
                                            fullName: '',
                                            email: '',
                                            password: '',
                                            mobile: "",
                                            confirmPassword: "",
                                            crNumber: ""
                                        }}
                                        validationSchema={type && (type === 2 || type === 11) ? SignupSchema2 : SignupSchema}
                                        onSubmit={onSubmit}
                                    >
                                        {({ errors, touched, values, handleBlur, handleSubmit, handleChange }) => (
                                            <View style={{ marginHorizontal: 30 }}>
                                                <View style={styles.inputView}>
                                                    <Text style={styles.headerText}>{lang["Full Name"]}</Text>
                                                    <TextField
                                                        style={styles.textInput}
                                                        placeholder={lang["Please Enter Your Name"]}
                                                        placeholderTextColor="grey"
                                                        value={values.fullName}
                                                        onChangeText={handleChange("fullName")}
                                                        onBlur={handleBlur("fullName")}
                                                        errors={errors.fullName}
                                                        touched={touched.fullName}
                                                    />
                                                </View>
                                                <View style={styles.inputView}>
                                                    <Text style={styles.headerText}>{lang["Email"]}</Text>
                                                    <TextField
                                                        style={styles.textInput}
                                                        placeholder={lang["Please Enter Your Email address"]}
                                                        placeholderTextColor="grey"
                                                        value={values.email}
                                                        onChangeText={handleChange("email")}
                                                        onBlur={handleBlur("email")}
                                                        errors={errors.email}
                                                        touched={touched.email} />
                                                </View>
                                                <View style={styles.inputView}>
                                                    <Text style={styles.headerText}>{lang["Mobile Number"]}</Text>
                                                    <View style={{ flexDirection: "row", marginTop: 8 }}>
                                                        <View style={{ flex: 0.2 }}>
                                                            <TextField
                                                                style={styles.codeInput}
                                                                placeholder={"+966"}
                                                                placeholderTextColor="black"
                                                            />
                                                        </View>
                                                        <View style={{ flex: 0.8, marginLeft: 10 }}>
                                                            <TextField
                                                                style={[styles.textInput, { marginTop: 0 }]}
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
                                                <View style={styles.inputView}>
                                                    <Text style={styles.headerText}>{lang["User Type"]}</Text>
                                                    <RNPickerSelect
                                                        placeholder={placeholder}
                                                        onValueChange={(value) => {
                                                            setType(value)
                                                            // console.log(value, "value")
                                                        }}
                                                        items={types}
                                                        useNativeAndroidPickerStyle={false}
                                                        value={type}
                                                        style={{
                                                            ...pickerSelectStyles, placeholder: {
                                                                color: 'grey',
                                                                fontSize: rf(1.6),
                                                                fontFamily: Fonts.regular
                                                            },
                                                            iconContainer: {
                                                                top: rh(2.7),
                                                                right: 12,
                                                            },
                                                        }}
                                                        Icon={() => {
                                                            return <Image source={Images.icons.downArrow} style={{ height: 15, width: 15, tintColor: "grey", }} />
                                                        }}
                                                    />
                                                </View>
                                                <View style={styles.inputView}>
                                                    <Text style={styles.headerText}>{lang["City"]}</Text>
                                                    <RNPickerSelect
                                                        placeholder={placeholder1}
                                                        onValueChange={(value) => {
                                                            setCity(value)
                                                        }}
                                                        items={cities}
                                                        useNativeAndroidPickerStyle={false}
                                                        value={city}
                                                        style={{
                                                            ...pickerSelectStyles, placeholder: {
                                                                color: 'grey',
                                                                fontSize: rf(1.6),
                                                                fontFamily: Fonts.regular
                                                            },
                                                            iconContainer: {
                                                                top: rh(2.7),
                                                                right: 12,
                                                            },
                                                        }}
                                                        Icon={() => {
                                                            return <Image source={Images.icons.downArrow} style={{ height: 15, width: 15, tintColor: "grey", }} />
                                                        }}
                                                    />
                                                </View>
                                                <View style={styles.inputView}>
                                                    <Text style={styles.headerText}>{lang["Password"]}</Text>
                                                    <TextField
                                                        style={styles.textInput}
                                                        placeholder={lang["Please Enter Password"]}
                                                        placeholderTextColor="grey"
                                                        secureTextEntry={true}
                                                        value={values.password}
                                                        onChangeText={handleChange("password")}
                                                        onBlur={handleBlur("password")}
                                                        errors={errors.password}
                                                        touched={touched.password}
                                                        textContentType={'oneTimeCode'} />
                                                </View>

                                                <View style={styles.inputView}>
                                                    <Text style={styles.headerText}>{lang["Confirm Password"]}</Text>
                                                    <TextField
                                                        style={styles.textInput}
                                                        placeholder={lang["Please Enter Confirm Password"]}
                                                        placeholderTextColor="grey"
                                                        secureTextEntry={true}
                                                        value={values.confirmPassword}
                                                        onChangeText={handleChange("confirmPassword")}
                                                        onBlur={handleBlur("confirmPassword")}
                                                        errors={errors.confirmPassword}
                                                        touched={touched.confirmPassword} />
                                                </View>
                                                {type && (type === 11 || type === 2) ? (
                                                    <View style={styles.inputView}>
                                                        <Text style={styles.headerText}>{lang["CR Number"]}</Text>
                                                        <TextField
                                                            style={styles.textInput}
                                                            placeholder={lang["Please Enter Your CR Number"]}
                                                            placeholderTextColor="grey"
                                                            // secureTextEntry={true}
                                                            value={values.crNumber}
                                                            onChangeText={handleChange("crNumber")}
                                                            onBlur={handleBlur("crNumber")}
                                                            errors={errors.crNumber}
                                                            touched={touched.crNumber} />
                                                    </View>
                                                ) : (
                                                    null
                                                )}
                                                <TouchableOpacity
                                                    onPress={handleSubmit}
                                                    style={styles.buttonView}>
                                                    <Text style={styles.buttonText}>{lang["Signup"]}</Text>
                                                </TouchableOpacity>

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
        )
    }
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: rf(1.6),
        // paddingVertical: 12,
        paddingHorizontal: 6,
        borderWidth: 1,
        borderColor: '#cbcbcb',
        borderRadius: 5,
        color: 'black',
        paddingRight: rw(5), // to ensure the text is never behind the icon
        height: rh(5),
        backgroundColor: Colors.e6e6e6,
        marginTop: 10,
        textAlign: I18nManager.isRTL ? "right" : 'left'
    },
    inputAndroid: {
        fontSize: rf(1.6),
        paddingHorizontal: 6,
        // paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#cbcbcb',
        borderRadius: 5,
        color: 'black',
        paddingRight: rw(5), // to ensure the text is never behind the icon
        height: rh(5),
        backgroundColor: Colors.e6e6e6,
        marginTop: 10,
        textAlign: I18nManager.isRTL ? "right" : 'left'
    },
});