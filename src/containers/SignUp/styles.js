import { StyleSheet, I18nManager } from 'react-native'
import { Images, Colors, Fonts } from '@Themes';
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

    textInput: {
        padding: 0, margin: 0, marginTop: 10,
        paddingLeft: 6, backgroundColor: Colors.e6e6e6,
        borderWidth: 1, borderColor: "#cbcbcb",
        fontFamily: Fonts.regular,
        textAlign: I18nManager.isRTL ? "right" : "left",
        fontSize: rf(1.6)
    },
    codeInput: { fontSize: rf(1.6), padding: 0, margin: 0, fontFamily: Fonts.regular, backgroundColor: "#bfbcbc", borderWidth: 1, textAlign: 'center', borderColor: "#bfbcbc" },
    headerText: { fontFamily: Fonts.regular, textAlign: 'left', fontSize: rf(1.8) },
    contentView: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: Colors.overlayWhite },
    headerView: { height: rh(10), },
    inputView: { marginTop: 10 },
    buttonView: { height: rh(5.5), backgroundColor: Colors.theme, marginVertical: 20, borderRadius: 5, alignItems: 'center', justifyContent: 'center', },
    buttonText: { color: "white", fontFamily: Fonts.medium, fontSize: rf(1.8) }
})
export default styles;
