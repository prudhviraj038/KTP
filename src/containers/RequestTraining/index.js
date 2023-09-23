import React, { useEffect, useState, useContext } from 'react'
import { View, Text, Modal, StyleSheet, Image, Alert, ScrollView, useWindowDimensions, I18nManager, Pressable, Keyboard } from 'react-native'

import { BackgroundView, TextField, Spinner } from '@common';
import { Header } from '@components'
import { useNavigation } from '@react-navigation/native';
import services from "@services";
import constants from "@constants";

import HTML from "react-native-render-html";
import styles from "./styles";
import { LanguageContext } from '@context/lang-context';
import { Fonts, Colors, Images } from '@Themes';
import { UserContext } from "@context/user-context";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
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
    returnKeyType
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
    )
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
    onChangeText
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
    )
}
export default function RequestTraining({ route }) {
    const { lang, setLang } = useContext(LanguageContext);
    const { user, setUser } = useContext(UserContext);
    const [city, setCity] = useState(null);
    const [cities, setCities] = useState([]);
    const [spinner, setSpinner] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const ValidationSchema = Yup.object().shape({
        area: Yup.string().required(lang['Please enter area']),
        message: Yup.string().required(lang['Please enter message']),
    });
    const placeholder = {
        label: lang["City"],
        value: null,
        color: 'grey',
        fontFamily: Fonts.medium
    };
    const lines = [
        {
            label: lang["Left Line"],
            value: "1"
        },
        {
            label: lang["Right Line"],
            value: "2"
        }
    ]
    useEffect(() => {
        fetchCities()
    }, [])
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
        if (!city) {
            Alert.alert(
                lang["KTP"],
                lang["Please select city"],
                [
                    { text: lang["Ok"], }
                ]
            );
        } else {
            setLoading(true)
            var body = {
                "member_id": user.id.toString(),
                "city": city.toString(),
                "area": values.area,
                "message": values.message
            }
            // console.log(object)
            services(constants.API_BASE_URL + "/request_training", body, "POST").then((response) => {
                if (response) {
                    setLoading(false)
                    if (response.status === "Success") {
                        Alert.alert(
                            lang["KTP"],
                            I18nManager.isRTL ? response.message_ar : response.message,
                            [
                                {
                                    text: lang["Ok"], onPress: () => {
                                        if (route.params.onNavigatingBack) {
                                            route.params.onNavigatingBack()
                                        }
                                        navigation.pop();
                                    }
                                }
                            ]
                        );
                    } else {
                        Alert.alert(
                            lang["KTP"],
                            I18nManager.isRTL ? response.message_ar : response.message,
                            [
                                { text: lang["Ok"], }
                            ]
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

                        <Text style={styles.headerText}>{lang["New Request Training"]}</Text>
                        {spinner ? (
                            <Spinner initialLoad />
                        ) : (
                            <KeyboardAwareScrollView>
                                <Formik
                                    initialValues={{
                                        area: "",
                                        message: ""
                                    }}
                                    validationSchema={ValidationSchema}
                                    onSubmit={onSubmit}
                                    enableReinitialize
                                >
                                    {({ errors, touched, values, handleBlur, handleSubmit, handleChange }) => (
                                        <View style={{ marginTop: 10 }}>
                                            <Dropdown
                                                title={lang["City"]}
                                                placeholder={placeholder}
                                                onValueChange={(value) => {
                                                    setCity(value)
                                                }}
                                                items={cities}
                                                useNativeAndroidPickerStyle={false}
                                                value={city}
                                                style={{
                                                    ...pickerSelectStyles, placeholder: {
                                                        color: 'grey',
                                                        fontSize: rf(1.7),
                                                        fontFamily: Fonts.regular
                                                    },
                                                    iconContainer: {
                                                        top: 12,
                                                        right: 12,
                                                    },
                                                }}
                                                Icon={() => {
                                                    return <Image source={Images.icons.downArrow} style={styles.iconStyle} />
                                                }}
                                            />
                                            <TextInputs
                                                inputStyle={styles.inputStyle}
                                                placeholder={lang["Area"]}
                                                placeholderTextColor="grey"
                                                value={values.area}
                                                onChangeText={handleChange("area")}
                                                onBlur={handleBlur("area")}
                                                errors={errors.area}
                                                touched={touched.area}
                                                title={lang["Area"]}
                                                editable={true}
                                            />
                                            <TextInputs
                                                inputStyle={styles.inputStyleComment}
                                                placeholder={lang["Message"]}
                                                placeholderTextColor="grey"
                                                value={values.message}
                                                onChangeText={handleChange("message")}
                                                onBlur={handleBlur("message")}
                                                errors={errors.message}
                                                touched={touched.message}
                                                title={lang["Message"]}
                                                editable={true}
                                                height={90}
                                                multiline
                                            />
                                            <Pressable
                                                style={styles.buttonStyle}
                                                onPress={handleSubmit}
                                            >
                                                <Text style={styles.btnText}>{lang["Submit"]}</Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </Formik>
                            </KeyboardAwareScrollView>)}
                    </View>
                </View>
            </View>
            {loading && <Spinner />}
        </View>
    )
}
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: rf(1.7),
        // paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#cbcbcb',
        borderRadius: 4,
        color: 'black',
        // paddingRight: 30, // to ensure the text is never behind the icon
        height: rh(5),
        backgroundColor: Colors.f2f2f2,
        // marginTop: 10,
        textAlign: I18nManager.isRTL ? "right" : 'left',
        fontFamily: Fonts.regular,
        margin: 0,
        padding: 0,
    },
    inputAndroid: {
        fontSize: rf(1.7),
        paddingHorizontal: 10,
        // paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#cbcbcb',
        borderRadius: 5,
        color: 'black',
        // paddingRight: 30, // to ensure the text is never behind the icon
        height: rh(5),
        backgroundColor: Colors.f2f2f2,
        // marginTop: 10,
        textAlign: I18nManager.isRTL ? "right" : 'left',
        fontFamily: Fonts.regular,
        margin: 0,
        padding: 0,
    },
});