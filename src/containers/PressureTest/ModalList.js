import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Pressable } from 'react-native'
import { useTheme, useNavigation } from '@react-navigation/native';
import { Fonts, Colors } from '@Themes';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
export default function ModalList({
    title,
    subTitle,
    firstButtonText,
    secondButtonText,
    thirdButtonText,
    onFirstBtnPress,
    onSecondBtnPress,
    onThirdBtnPress,
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
                        marginHorizontal: rw(15),

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
                                fontSize: rf(1.8),
                                fontFamily: Fonts.medium,
                                //   fontWeight: "bold",
                                textAlign: "center",
                                marginVertical: 10,

                            }}
                        >
                            {subTitle}
                        </Text>

                    </View>

                    <Pressable style={{ borderTopWidth: 1, borderColor: "lightgrey" }} onPress={onFirstBtnPress}>
                        <Text
                            style={{
                                // color: Colors.white,
                                fontSize: rf(1.7),
                                fontFamily: Fonts.regular,
                                // fontWeight: "bold",
                                // paddingHorizontal: 20,
                                paddingVertical: 10,
                                textAlign: "center",
                            }}
                        >
                            {firstButtonText}
                        </Text>
                    </Pressable>
                    <Pressable style={{ borderTopWidth: 1, borderColor: "lightgrey" }} onPress={onSecondBtnPress}>
                        <Text
                            style={{
                                // color: Colors.white,
                                fontSize: rf(1.7),
                                fontFamily: Fonts.regular,
                                // fontWeight: "bold",
                                // paddingHorizontal: 20,
                                paddingVertical: 10,
                                textAlign: "center",
                            }}
                        >
                            {secondButtonText}
                        </Text>
                    </Pressable>
                    <Pressable style={{ borderTopWidth: 1, borderColor: "lightgrey" }} onPress={onThirdBtnPress}>
                        <Text
                            style={{
                                // color: Colors.white,
                                fontSize: rf(1.7),
                                fontFamily: Fonts.regular,
                                // fontWeight: "bold",
                                // paddingHorizontal: 20,
                                paddingVertical: 10,
                                textAlign: "center",
                            }}
                        >
                            {thirdButtonText}
                        </Text>
                    </Pressable>
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


