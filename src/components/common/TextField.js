import React from 'react'
import { View, Text, TextInput } from 'react-native'
import { Fonts } from "@Themes";
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
export default function TextField({ style,
    placeholder,
    placeholderTextColor,
    secureTextEntry,
    onChangeText,
    value,
    onBlur,
    errors,
    touched,
    maxLength,
    textContentType,
    editable,
    keyboardType, returnKeyType, height, multiline }) {
    // console.log(errors, "errorserrorserrors")
    return (
        <View>

            <TextInput placeholder={placeholder}
                style={[style, { height: height ? height : rh(5), borderRadius: 5, padding: 0, margin: 0, }]}
                placeholderTextColor={placeholderTextColor}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                onBlur={onBlur}
                maxLength={maxLength}
                textContentType={textContentType}
                editable={editable}
                keyboardType={keyboardType}
                returnKeyType={returnKeyType}
                // defaultValue={value}
                multiline={multiline} />
            {errors && touched && <Text style={{ color: "red", fontSize: 12, marginTop: 5, fontFamily: Fonts.regular, textAlign: 'left' }}>{errors}</Text>}
        </View>
    )
}
