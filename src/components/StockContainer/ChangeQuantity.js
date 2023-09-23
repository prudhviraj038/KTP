import React, { useState, useContext } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TextInput, I18nManager } from 'react-native'
import { useTheme, useNavigation } from '@react-navigation/native';
import { TextField, BackgroundView, KeyboardShift, Spinner } from '@common'
import { LanguageContext } from '@context/lang-context';
import { Fonts, Colors } from '@Themes';
export default function ChangeQuantity({
    getQty,
    onClose,
    editItem
}) {
    const [qty, setQty] = useState(editItem.qty)
    const { lang, setLang } = useContext(LanguageContext);
    // console.log(editItem, "editItemeditItem")
    return (
        <TouchableOpacity
            style={{
                flex: 1,
                backgroundColor: "#0e0e0e4f",
                justifyContent: "center",
                // alignItems: 'center',
            }}
            onPress={() => {
                // props.onClose();
            }}
        >
            <TouchableWithoutFeedback style={{ flex: 1 }}>
                <View
                    style={{
                        backgroundColor: Colors.white,
                        borderWidth: 1,
                        borderColor: Colors.lightgrey,
                        // alignItems: 'center',
                        marginHorizontal: 15,

                        borderRadius: 5,
                    }}
                >
                    <View
                        style={{
                            marginLeft: 15
                            // borderBottomWidth: 1,
                            // borderBottomColor: Colors.lightgrey,
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.theme,
                                fontSize: 16,
                                fontFamily: Fonts.medium,
                                //   fontWeight: "bold",
                                textAlign: "left",
                                marginVertical: 10,

                            }}
                        >
                            {lang["Change Quantity"]}
                        </Text>
                        {/* <Text
                            style={{
                                color: Colors.black,
                                fontSize: 14,
                                fontFamily: Fonts.regular,
                                //   fontWeight: "bold",
                                textAlign: "center",
                                marginVertical: 5,
                                // lineHeight: 20,
                            }}
                        >
                            {"subTitle"}
                        </Text> */}
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            // justifyContent: 'center',
                            marginVertical: 15,

                            marginHorizontal: 15
                        }}
                    >
                        <View style={{ flex: 0.65 }}>
                            <TextField
                                style={{
                                    padding: 0, margin: 0, paddingLeft: 6,
                                    backgroundColor: Colors.e6e6e6, borderWidth: 1,
                                    borderColor: "#cbcbcb", fontFamily: Fonts.regular,
                                    height: 35,
                                    textAlign: I18nManager.isRTL ? "right" : "left"
                                }}
                                placeholder={"Qty"}
                                placeholderTextColor="grey"
                                // secureTextEntry={true}
                                value={qty}
                                onChangeText={setQty}
                            // onBlur={handleBlur("password")}
                            />
                        </View>
                        <View style={{ flex: 0.35, marginLeft: 15 }}>
                            <TouchableOpacity style={{
                                height: 40, alignItems: 'center', justifyContent: 'center',
                                backgroundColor: Colors.theme, borderRadius: 5,
                                // marginTop: 30
                            }} onPress={() => getQty(qty, editItem)}>
                                <Text style={{ color: "white", fontFamily: Fonts.regular }}>{lang["Submit"]}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ position: "absolute", top: 0, right: 15, }}>
                        <TouchableOpacity style={{ marginTop: -15, height: 30, width: 30, borderRadius: 15, backgroundColor: "white", alignItems: 'center', justifyContent: 'center', }}
                            onPress={onClose}
                        >
                            <Text>X</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </TouchableWithoutFeedback>

        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({

    modalView: {
        // backgroundColor: "white",
        marginHorizontal: 20,
        // padding: 15,
        borderRadius: 10,
        paddingTop: 30
    },
    modalHeader: {
        // ...font(16, 'bold'),
        color: 'black',
        textAlign: 'center',
        marginHorizontal: 10,
        fontFamily: Fonts.medium
    },
    subTitle: {
        // ...font(14),
        color: 'black',
        textAlign: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
        fontFamily: Fonts.regular
    },
    modalBtns: {
        alignItems: 'center',
        width: '50%',
        height: 40,
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: 5
    },
    modalBtnTxt: {
        // ...font(16, 'bold'),
        // color: 'white',
        fontFamily: Fonts.medium,
        fontSize: 16
    }
});


