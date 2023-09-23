import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Pressable } from 'react-native'
import { useTheme, useNavigation } from '@react-navigation/native';
import { Fonts, Colors } from '@Themes';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
export default function ModalView({
    title,
    subTitle,
    leftButtonText,
    rightButtonText,
    onLeftPress,
    onRightPress,
    onClose,
    closeIcon
}) {


    return (
        <Pressable
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

                        borderRadius: 15,
                    }}
                >
                    <View
                        style={{
                            // borderBottomWidth: 1,
                            // borderBottomColor: Colors.lightgrey,
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.black,
                                fontSize: rf(1.7),
                                fontFamily: Fonts.medium,
                                //   fontWeight: "bold",
                                textAlign: "center",
                                marginTop: 10,
                            }}
                        >
                            {title}
                        </Text>
                        <Text
                            style={{
                                color: Colors.black,
                                fontSize: rf(1.6),
                                fontFamily: Fonts.regular,
                                //   fontWeight: "bold",
                                textAlign: "center",
                                marginVertical: 5,
                                // lineHeight: 20,
                            }}
                        >
                            {subTitle}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: 'center',
                            marginBottom: 15,
                            marginTop: 10
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                // borderRightWidth: 1,
                                // borderRightColor: Colors.lightgrey,
                                // flex: 0.5,
                                justifyContent: "center",
                                alignItems: "center",
                                // backgroundColor: Colors.theme,
                                width: rw(30),
                                marginHorizontal: 15,
                                borderRadius: 5,
                                borderColor: 'grey',
                                borderWidth: 1
                            }}
                            onPress={() => onLeftPress()}
                        >
                            <Text
                                style={{
                                    // color: Colors.white,
                                    fontSize: rf(1.6),
                                    fontFamily: Fonts.regular,
                                    // fontWeight: "bold",
                                    // margin: 10,
                                    textAlign: "center",

                                    // paddingHorizontal: 20,
                                    paddingVertical: 5
                                }}
                            >
                                {leftButtonText}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                // flex: 0.5,
                                justifyContent: "center",
                                alignItems: "center",

                                // backgroundColor: Colors.theme,
                                width: rw(30),
                                marginHorizontal: 15,
                                borderRadius: 5,
                                borderColor: 'grey',
                                borderWidth: 1
                            }}
                            onPress={() => onRightPress()}
                        >
                            <Text
                                style={{
                                    // color: Colors.white,
                                    fontSize: rf(1.6),
                                    fontFamily: Fonts.regular,
                                    // fontWeight: "bold",
                                    // paddingHorizontal: 20,
                                    paddingVertical: 5,
                                    textAlign: "center",
                                }}
                            >
                                {rightButtonText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ position: "absolute", top: 0, right: 15, }}>
                        <TouchableOpacity style={{ marginTop: -15, height: 30, width: 30, borderRadius: 15, backgroundColor: "white", alignItems: 'center', justifyContent: 'center', }}
                            onPress={onClose}>
                            <Text>X</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </TouchableWithoutFeedback>

        </Pressable>
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


