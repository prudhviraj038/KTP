import React, { useEffect, useState, useContext } from 'react'
import { View, Text, Modal, StyleSheet, Image, Alert, ScrollView, I18nManager, Pressable, Keyboard } from 'react-native'

import { BackgroundView, TextField, Spinner, ModalView } from '@common';
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
import DocumentPicker from 'react-native-document-picker'
import * as ImagePicker from 'react-native-image-picker';
import ModalList from './ModalList'
function ShowTextField({

    value,

    title,
}) {
    return (
        <View style={styles.inputView}>
            <View style={styles.inputHeaderView}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.input}>


                <View style={styles.inputStyle}>
                    {value ? (
                        <Text style={styles.textStyle}>{value}</Text>
                    ) : (
                        <Text style={[styles.textStyle, { color: "grey" }]}>{title}</Text>
                    )}

                </View>

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
export default function PressureTest({ route }) {
    const { lang, setLang } = useContext(LanguageContext);
    const { user, setUser } = useContext(UserContext);

    const [customerId, setCustomerId] = useState(null);
    const [customerName, setCustomerName] = useState(null);
    const [city, setCity] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null)
    const [spinner, setSpinner] = useState(true);
    const navigation = useNavigation();
    // const [item, setItem] = useState(route.params ? route.params.item : null);
    // const [selectedDate, setSelectedDate] = useState(item ? item.now : null);
    // console.log(item, "userrrrrrrrr")
    const placeholder = {
        label: lang["Customer ID"],
        value: null,
        color: 'grey',
        fontFamily: Fonts.medium
    };

    useEffect(() => {

        fetchCustomers()

        // if (item) {
        //     setCode(item.PY_SUP.id)
        //     setReceiptType(item.PY_TYPE.id)
        // }
    }, []);
    const fetchCustomers = () => {
        services(constants.API_BASE_URL + "/technician_customers/" + user.id).then((response) => {
            if (response) {
                // console.log(response, "......")
                if (response && response.length > 0) {
                    response.map((res, key) => {
                        res.value = res.id.toString();
                        res.label = res.id.toString()
                    })
                }

                // setReceiptTypes(response.types)
                setCustomers(response)
                setSpinner(false)

            } else {
                setSpinner(false)
            }
        });
    };


    function onSubmit() {
        // console.log(values, "onSubmit")
        // Keyboard.dismiss();
        if (!customerId) {

            Alert.alert(lang["KTP"], lang["Please select customer"], [
                { text: lang['Ok'] }
            ]);
        } else if (!file) {
            Alert.alert(lang["KTP"], lang["Please upload file"], [
                { text: lang['Ok'] }
            ]);
        } else {
            setLoading(true);
            // if (item) {
            //     var data = {
            //         "invoice": values.receiptNo,
            //         "date": moment(selectedDate).format('DD-MM-YYYY'),
            //         "amount": values.amount,
            //         "type": receiptType.toString(),
            //         "scode": user.s_code,
            //         "code": code.toString(),
            //         "entry_id": item.SNO
            //     }
            //     onSubmitCollection(data)
            // } else {
            //     var data = {
            //         "invoice": values.receiptNo,
            //         "date": moment(selectedDate).format('DD-MM-YYYY'),
            //         "amount": values.amount,
            //         "type": receiptType.toString(),
            //         "scode": user.s_code,
            //         "code": code.toString()
            //     }
            //     onSubmitCollection(data)
            // }

            onSubmitReport()

        }
    }
    async function onSubmitReport() {
        var fileFormat = {
            uri: file.uri,
            type: file.type,
            name: file.name,
        };

        var body = new FormData();

        body.append('technician_id', user.id.toString());
        body.append('customer_id', customerId.toString());
        body.append('file', fileFormat);
        let res = await fetch(
            constants.API_BASE_URL + "/pressure_test",
            {
                method: 'POST',
                body: body,
                headers: {
                    'Content-Type': 'multipart/form-data; ',
                },
            }
        );
        let responseJson = await res.json();
        // console.log(responseJson, "responseJsonresponseJsonresponseJson")
        setLoading(false)
        if (responseJson.status === "Success") {
            Alert.alert(lang["KTP"], I18nManager.isRTL ? responseJson.message_ar : responseJson.message, [
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

        // var xhr = new XMLHttpRequest();
        // xhr.open('POST', constants.API_BASE_URL + "/pressure_test");
        // xhr.send(body);

    }
    function onLaunchCamera() {
        let options = {
            maxHeight: 200,
            maxWidth: 200,
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: false,
        }
        ImagePicker.launchCamera(options, (response) => {
            // console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // setFile(response.assets[0])
                //console.log('Response = ', response.assets[0].uri);
                response.assets[0].name = response.assets[0].fileName;
                setFile(response.assets[0])
                // onChangeImage(response.assets[0].uri);

            }
        });
    }
    async function uploadPdf() {
        try {
            const results = await DocumentPicker.pickMultiple({
                // type: [DocumentPicker.types.allFiles],
                type: [DocumentPicker.types.pdf],

            })
            for (const res of results) {
                // console.log(
                //     res.uri, "=====",
                //     res.type, ".......", // mime type
                //     res.name, "llll",
                //     res.size, "ooiii",
                //     "pppppppppp",
                // )
                setFile(res)
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err
            }
        }
    }
    async function uploadImage() {
        try {
            const results = await DocumentPicker.pickMultiple({
                // type: [DocumentPicker.types.allFiles],
                type: [DocumentPicker.types.images],

            })
            for (const res of results) {
                // console.log(
                //     res.uri, "=====",
                //     res.type, ".......", // mime type
                //     res.name, "llll",
                //     res.size, "ooiii",
                //     "pppppppppp",
                // )

                setFile(res)
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err
            }
        }
    }
    function askAlert() {
        setModalVisible(true);
        // Alert.alert(lang["KTP"], lang["Choose file type"], [
        //     // { text: lang['Cancel'], onPress: () => console.log("cancel") },
        //     { text: lang['PDF File'], onPress: () => uploadPdf() },
        //     { text: lang['Open Camera'], onPress: () => onLaunchCamera() },
        //     { text: lang['Image'], onPress: () => uploadImage() },

        // ], { cancelable: false });
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
                        <Text style={styles.headerText}>{lang["New Pressure Test"]}</Text>
                        {spinner ? (
                            <Spinner initialLoad />
                        ) : (
                            <View style={{ marginTop: 10 }}>
                                <Dropdown
                                    title={lang["Customer ID"]}
                                    placeholder={placeholder}
                                    onValueChange={(value) => {
                                        setCustomerId(value)
                                        let selected = customers.filter(function (e) {
                                            return e.id.toString() === value;
                                        });
                                        // console.log(selected, "selectedselected")
                                        setCity(selected[0].city_tit)
                                        setCustomerName(selected[0].fullname)
                                        // handleChange("custCode", value)
                                    }}
                                    // onChangeText={handleChange("custCode")}
                                    // onBlur={handleBlur("custCode")}
                                    items={customers}
                                    useNativeAndroidPickerStyle={false}
                                    value={customerId}
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
                                <ShowTextField
                                    value={customerName ? customerName : ""}
                                    title={lang["Customer Name"]}
                                />
                                <ShowTextField
                                    value={city ? city : ""}
                                    title={lang["City"]}
                                />
                                <View style={styles.inputView}>
                                    <View style={styles.inputHeaderView}>
                                        <Text style={[styles.title, { marginRight: 5 }]}>{lang["Upload pressure test report"]}</Text>
                                    </View>
                                    <View style={styles.input}>

                                        <Pressable style={styles.dropdown} onPress={() => setModalVisible(true)}>
                                            {file ? (
                                                <Text style={styles.pickerText} numberOfLines={1}>{file.name}</Text>
                                            ) : (
                                                <Text style={[styles.pickerText, { color: "grey" }]}>{lang["Choose file"]}</Text>
                                            )}

                                        </Pressable>
                                    </View>
                                </View>
                                <Pressable
                                    style={styles.buttonStyle}
                                    onPress={onSubmit}
                                >
                                    <Text style={styles.btnText}>{lang["Submit"]}</Text>
                                </Pressable>

                            </View>
                        )}
                    </View>
                </View>
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <ModalList
                    title={lang["KTP"]}
                    subTitle={lang["Choose file type"]}
                    firstButtonText={lang["PDF File"]}
                    secondButtonText={lang["Open Camera"]}
                    thirdButtonText={lang["Image"]}
                    onFirstBtnPress={
                        () => {
                            // setModalVisible(false);
                            uploadPdf();
                        }
                    }
                    onSecondBtnPress={
                        () => {
                            // setModalVisible(false);
                            onLaunchCamera();
                        }
                    }
                    onThirdBtnPress={
                        () => {
                            // setModalVisible(false);
                            uploadImage();
                        }
                    }
                    onClose={() => setModalVisible(false)}
                />
            </Modal>
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