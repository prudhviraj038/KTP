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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
import RNPickerSelect from 'react-native-picker-select';
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
    return (

        <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ flex: 0.35, justifyContent: 'center', }}>
                <Text style={{ fontFamily: Fonts.regular, textAlign: 'left' }}>{title}</Text>
            </View>
            <View style={{ flex: 0.65 }}>
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
export default function CollectionEntry({ route }) {
    const { lang, setLang } = useContext(LanguageContext);
    const { user, setUser } = useContext(UserContext);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [code, setCode] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [receiptType, setReceiptType] = useState(null);
    const [receiptTypes, setReceiptTypes] = useState([]);
    const [spinner, setSpinner] = useState(true);
    const navigation = useNavigation();
    const [item, setItem] = useState(route.params ? route.params.item : null);
    const [selectedDate, setSelectedDate] = useState(item ? item.now : null);
    // console.log(item, "userrrrrrrrr")
    const placeholder = {
        label: lang["Customer Code"],
        value: null,
        color: 'grey',
        fontFamily: Fonts.medium
    };
    const placeholder1 = {
        label: lang["Receipt Type"],
        value: null,
        color: 'grey',
        fontFamily: Fonts.medium
    };

    useEffect(() => {

        fetchCollectionEntry()

        if (item) {
            setCode(item.PY_SUP.id)
            setReceiptType(item.PY_TYPE.id)
        }
    }, []);
    const fetchCollectionEntry = () => {
        services(constants.API_BASE_URL + "/collection_data/" + user.s_code).then((response) => {
            if (response) {
                if (response.types && response.types.length > 0) {
                    response.types.map((res, key) => {
                        res.value = res.id;
                        res.label = I18nManager.isRTL ? res.title_ar : res.title
                    })
                }
                if (response.customers && response.customers.length > 0) {
                    response.customers.map((customer, key) => {
                        customer.value = customer.id;
                        customer.label = customer.c_code
                    })
                }
                setReceiptTypes(response.types)
                setCustomers(response.customers)
                setSpinner(false)

            } else {
                setSpinner(false)
            }
        });
    };
    const ValidationSchema = Yup.object().shape({
        receiptNo: Yup.string().required(lang['Please enter Receipt No.']),
        amount: Yup.string().required(lang['Please enter amount']),
        // custCode: Yup.string().required("Rejjkhjh!"),
    });
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        // console.warn("A date has been picked: ", date);
        setSelectedDate(date)
        hideDatePicker();
    };
    function onSubmit(values) {
        // console.log(values, "onSubmit")
        Keyboard.dismiss();
        if (!selectedDate) {
            Alert.alert(lang["KTP"], lang["Please select date of receipt"], [
                { text: lang['Ok'] }
            ]);
        } else if (!code) {
            Alert.alert(lang["KTP"], lang["Please select customer code"], [
                { text: lang['Ok'] }
            ]);
        } else if (!receiptType) {
            Alert.alert(lang["KTP"], lang["Please select receipt type"], [
                { text: lang['Ok'] }
            ]);
        } else {
            setLoading(true);
            if (item) {
                var data = {
                    "invoice": values.receiptNo,
                    "date": moment(selectedDate).format('DD-MM-YYYY'),
                    "amount": values.amount,
                    "type": receiptType.toString(),
                    "scode": user.s_code,
                    "code": code.toString(),
                    "entry_id": item.SNO
                }
                onSubmitCollection(data)
            } else {
                var data = {
                    "invoice": values.receiptNo,
                    "date": moment(selectedDate).format('DD-MM-YYYY'),
                    "amount": values.amount,
                    "type": receiptType.toString(),
                    "scode": user.s_code,
                    "code": code.toString()
                }
                onSubmitCollection(data)
            }

            // console.log(data, "daaaataaa")

        }
    }
    function onSubmitCollection(data) {
        services(constants.API_BASE_URL + "/collection_entry", data, "POST").then((response) => {
            if (response) {
                // console.log(response, "onSubmitonSubmit")
                setLoading(false)
                if (response.status === "Success") {
                    Alert.alert(lang["KTP"], I18nManager.isRTL ? response.message_ar : response.message, [
                        {
                            text: lang['Ok'], onPress: () => {
                                if (route.params.onNavigatingBack) {
                                    route.params.onNavigatingBack()
                                }
                                navigation.pop();
                            }
                        }
                    ]);

                } else {
                    Alert.alert(lang["KTP"], I18nManager.isRTL ? response.message_ar : response.message, [
                        { text: lang['Ok'] }
                    ]);
                }

                // fetchProfile(user.id)
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
                    <View style={styles.subContent}>
                        {item ? (
                            <Text style={styles.headerText}>{lang["Edit Collection Entry"]}</Text>
                        ) : (
                            <Text style={styles.headerText}>{lang["New Collection Entry"]}</Text>
                        )}

                        {/* <View style={{
                            alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1,
                            borderColor: Colors.f2f2f2, flexDirection: 'row',
                            justifyContent: 'space-between', marginTop: 10
                        }}>
                            <Text style={styles.idText}>{lang["Sales Person ID"]}</Text>
                            <Text style={styles.idText}>{user.s_code}</Text>
                        </View> */}
                        {spinner ? (
                            <Spinner initialLoad />
                        ) : (


                            <KeyboardAwareScrollView>
                                <Formik
                                    initialValues={{
                                        receiptNo: item ? item.PY_INV : "",
                                        amount: item ? item.PY_AMT.toString() : "",

                                        // code: "HTYRUIIII"
                                        // customerId: route.params && item ? item.c_code : user.c_code,
                                        // name: route.params && item ? item.name : user.fullname,
                                        // qty: route.params && item ? item.quantity.toString() : "1",
                                        // comment: route.params && item ? item.description : ""
                                    }}
                                    validationSchema={ValidationSchema}
                                    onSubmit={onSubmit}
                                    enableReinitialize
                                >
                                    {({ errors, touched, values, handleBlur, handleSubmit, handleChange }) => (
                                        <View style={{ marginTop: 10 }}>
                                            <TextInputs
                                                inputStyle={styles.inputStyle}
                                                placeholder={"XXXX"}
                                                placeholderTextColor="grey"
                                                value={values.receiptNo.toUpperCase()}
                                                onChangeText={handleChange("receiptNo")}
                                                onBlur={handleBlur("receiptNo")}
                                                errors={errors.receiptNo}
                                                touched={touched.receiptNo}
                                                title={lang["Receipt No"] + "."}
                                                editable={true}
                                                keyboardType="number-pad"
                                                returnKeyType="done"
                                            />


                                            <View style={styles.inputView}>
                                                <View style={styles.inputHeaderView}>
                                                    <Text style={styles.title}>{lang["Date of Receipt"]}</Text>
                                                </View>
                                                <View style={styles.input}>

                                                    <Pressable style={styles.dropdown} onPress={() => {
                                                        Keyboard.dismiss();
                                                        setDatePickerVisibility(true)

                                                    }}>
                                                        <View style={styles.picekerView}>
                                                            {selectedDate ? (
                                                                <Text style={styles.pickerText}>{moment(selectedDate).format('DD-MM-YYYY')}</Text>
                                                            ) : (
                                                                <Text style={[styles.pickerText, { color: "grey" }]}>{lang["Date of Receipt"]}</Text>
                                                            )}

                                                        </View>
                                                        <View style={styles.iconView}>
                                                            <Image style={styles.calendarIcon} source={Images.icons.calendar} />
                                                        </View>
                                                    </Pressable>
                                                </View>
                                            </View>


                                            {customers && customers.length > 0 ? (

                                                <View>
                                                    <Dropdown
                                                        title={lang["Customer Code"]}
                                                        placeholder={placeholder}
                                                        onValueChange={(value) => {
                                                            setCode(value)
                                                            // handleChange("custCode", value)
                                                        }}
                                                        // onChangeText={handleChange("custCode")}
                                                        // onBlur={handleBlur("custCode")}
                                                        items={customers}
                                                        useNativeAndroidPickerStyle={false}
                                                        value={code}
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

                                                </View>) : (
                                                null
                                            )}
                                            <TextInputs
                                                inputStyle={styles.inputStyle}
                                                placeholder={"XXXX"}
                                                placeholderTextColor="grey"
                                                value={values.amount}
                                                onChangeText={handleChange("amount")}
                                                onBlur={handleBlur("amount")}
                                                errors={errors.amount}
                                                touched={touched.amount}
                                                title={lang["Amount"]}
                                                editable={true}
                                                keyboardType="number-pad"
                                                returnKeyType="done"
                                            />
                                            {receiptTypes && receiptTypes.length > 0 ? (
                                                <Dropdown
                                                    title={lang["Receipt Type"]}
                                                    placeholder={placeholder1}
                                                    onValueChange={(value) => {
                                                        setReceiptType(value)
                                                    }}
                                                    items={receiptTypes}
                                                    useNativeAndroidPickerStyle={false}
                                                    value={receiptType}
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
                                            ) : (null)}
                                            {/* <Dropdown
                                            placeholder={lang["Receipt Type"]}
                                            title={lang["Receipt Type"]}
                                            icon={Images.icons.downArrow} /> */}

                                            {/* <TextInputs
                                            inputStyle={[styles.inputStyle, { backgroundColor: "#969696", borderColor: "#969696", }]}
                                            placeholder={"XXXX"}
                                            placeholderTextColor="grey"
                                            value={values.code}
                                            onChangeText={handleChange("code")}
                                            onBlur={handleBlur("code")}
                                            // errors={errors.code}
                                            // touched={touched.amount}
                                            title={lang["Sales Person code"]}
                                            editable={false}
                                        // keyboardType="number-pad"
                                        // returnKeyType="done"
                                        /> */}
                                            <Pressable
                                                style={styles.buttonStyle}
                                                onPress={handleSubmit}
                                            >
                                                <Text style={styles.btnText}>{lang["Submit"]}</Text>
                                            </Pressable>

                                        </View>
                                    )}
                                </Formik>
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