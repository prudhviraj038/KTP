import { StyleSheet, Dimensions, I18nManager } from 'react-native'
import { Colors, Fonts } from '@Themes';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'white'
    },
    contentView: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: Colors.overlayWhite },
    headerView: { height: rh(10), },
    subContent: {
        // marginTop: height / 4.3,
        // marginHorizontal: 30,
        marginHorizontal: rw(7),
        marginTop: rh(25)
    },
    headerText: { fontFamily: Fonts.regular, textAlign: "left", fontSize: rf(1.8) },
    textInputCode: {
        padding: 0, margin: 0,
        fontFamily: Fonts.regular,
        backgroundColor: "#bfbcbc", borderWidth: 1,
        textAlign: 'center', borderColor: "#bfbcbc",
        fontSize: rf(1.6)
    },
    textInput: {
        padding: 0, margin: 0,
        fontFamily: Fonts.regular, paddingLeft: 6,
        backgroundColor: Colors.e6e6e6, borderWidth: 1,
        textAlign: I18nManager.isRTL ? "right" : 'left',
        borderColor: "#cbcbcb", fontSize: rf(1.6)
    },
    buttonView: { height: rh(5.5), backgroundColor: Colors.theme, marginTop: rh(4), borderRadius: 5, alignItems: 'center', justifyContent: 'center', },
    buttonText: { color: "white", fontFamily: Fonts.medium, fontSize: rf(1.8) },
    signUpButton: { marginTop: rh(5), alignItems: 'center', justifyContent: 'center', },
    signUpText: { color: Colors.theme, fontFamily: Fonts.regular, fontSize: rf(2) }
})
export default styles;
