import React, { useState, useContext } from 'react'
import {
    View, Text, TextInput, Image, TouchableOpacity,
    I18nManager,
    Pressable,
    StyleSheet
} from 'react-native'
import { Fonts, Colors, Images } from '@Themes'
import { LanguageContext } from '@context/lang-context';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
export default function SearchBar({ onSearch }) {
    const [searchText, setSearchText] = useState("");
    const { lang, setLang } = useContext(LanguageContext);
    return (
        <View style={styles.container}>
            <View style={styles.inputView}>
                <TextInput placeholder={lang["Search By item code,title...."]} style={styles.inputText}
                    placeholderTextColor="grey" onChangeText={setSearchText} value={searchText} />
            </View>
            <View style={styles.iconView}>
                <Pressable style={styles.button}
                    onPress={() => onSearch(searchText)}>
                    <Image source={Images.icons.search} style={styles.icon} />
                </Pressable>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: { flexDirection: "row", borderWidth: 1, borderColor: "#cbcbcb", borderRadius: 5, height: rh(5), marginHorizontal: 12, backgroundColor: Colors.e6e6e6 },
    inputView: { flex: 0.85, justifyContent: 'center', },
    inputText: {
        fontFamily: Fonts.regular, paddingLeft: 10, padding: 0, margin: 0,
        textAlign: I18nManager.isRTL ? "right" : "left",
        fontSize: rf(1.6)
    },
    iconView: { flex: 0.15, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 5 },
    button: { height: rh(4), width: rh(4), alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theme, borderRadius: 5, },
    icon: { height: rh(2), width: rh(2), tintColor: Colors.white }
})
