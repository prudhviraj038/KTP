import { Dimensions, StyleSheet, I18nManager } from 'react-native';
import { Fonts, Colors, Images, } from '@Themes';
const { height, width } = Dimensions.get("window");
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerText: {
        fontSize: rf(2), fontFamily: Fonts.medium, textAlign: 'center',
        marginBottom: 5,

    },
    subContent: { marginTop: 10, marginHorizontal: 15 },
    inputStyle: {
        paddingLeft: 10, padding: 0, margin: 0, backgroundColor: Colors.f2f2f2, borderWidth: 1, borderColor: "#cbcbcb", fontFamily: Fonts.regular,
        color: "black",
        textAlign: I18nManager.isRTL ? "right" : "left",
        fontSize: rf(1.7)
    },
    inputStyleComment: {
        paddingLeft: 10, backgroundColor: Colors.f2f2f2,
        borderWidth: 1, borderColor: "#cbcbcb",
        fontFamily: Fonts.regular,
        color: "black",
        textAlignVertical: 'top',
        textAlign: I18nManager.isRTL ? "right" : "left",
        fontSize: rf(1.7)
    },
    buttonView: { alignItems: "flex-end", marginTop: 10 },
    buttonStyle: {
        justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.theme, borderRadius: 5,

    },
    btnText: { color: "white", fontFamily: Fonts.medium, fontSize: rf(1.5), paddingHorizontal: 10, paddingVertical: 8 },
    text: {
        fontSize: 12, fontFamily: Fonts.regular,
        textAlign: "left"
    },
    flatlist: {
        // marginHorizontal: 10,
        margin: 10
    },
    buttonsView: { alignItems: "flex-end", marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', },
    buttonsStyle: {
        justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.theme, borderRadius: 5,

    },
    inputView: { flexDirection: "row", marginTop: 10 },
    inputHeaderView: { flex: 0.35, justifyContent: 'center', },
    title: { fontFamily: Fonts.regular, textAlign: 'left', fontSize: rf(1.7) },
    input: { flex: 0.65 },
    buttonsText: { color: "white", fontFamily: Fonts.medium, fontSize: rf(1.5), paddingHorizontal: 10, paddingVertical: 8 },
    pickerView: {

        // paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#cbcbcb',
        borderRadius: 4,

        paddingRight: 30, // to ensure the text is never behind the icon
        height: 40,
        backgroundColor: Colors.f2f2f2,
        justifyContent: 'center',
        // marginTop: 10,

    },
    pickerText: {
        fontSize: 14,
        color: 'black',
        textAlign: 'left',
        fontFamily: Fonts.regular
    },
    iconStyle: { height: rh(1.7), width: rh(1.7), tintColor: "grey", },
    contentView: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: Colors.overlayWhite }
})
export default styles;
