import { Dimensions, StyleSheet, I18nManager } from 'react-native';

const { height, width } = Dimensions.get("window")
import { Fonts, Colors } from '@Themes';
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
    headerView: { flex: 0.1 },
    content: { flex: 0.9 },
    contentView: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: Colors.overlayWhite },
    headerText: { fontFamily: Fonts.medium, fontSize: rf(2), textAlign: 'center', marginTop: 10 },
    editButtonView: {
        justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.theme, borderRadius: 5,
        marginRight: 15
    },
    editBtnText: { color: "white", fontFamily: Fonts.medium, fontSize: rf(1.5), paddingHorizontal: 10, paddingVertical: 8 },
    formView: { marginTop: 10, marginHorizontal: 15 },
    inputStyle: {
        paddingLeft: 10, padding: 0, margin: 0, backgroundColor: Colors.e6e6e6, borderWidth: 1,
        borderColor: "#cbcbcb", fontFamily: Fonts.regular,
        color: "black",
        textAlign: I18nManager.isRTL ? "right" : "left",
        fontSize: rf(1.7)
    },
    inputStyle2: {
        paddingLeft: 10, padding: 0, margin: 0, backgroundColor: "#969696", borderWidth: 1, borderColor: "#969696",
        fontFamily: Fonts.regular,
        color: '#303030',
        textAlign: I18nManager.isRTL ? "right" : "left",
        fontSize: rf(1.7)

    },
    submitBtn: {
        justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.theme, borderRadius: 5,

    },
    submitBtnText: { color: "white", fontFamily: Fonts.medium, fontSize: rf(1.5), paddingHorizontal: 10, paddingVertical: 8 },
    buttonView: { alignItems: "flex-end", },
    textFieldView: { flexDirection: "row", marginTop: 10 },
    titleView: { flex: 0.35, justifyContent: 'center', },
    title: { fontFamily: Fonts.regular, textAlign: 'left', fontSize: rf(1.7) },
    textInput: { flex: 0.65 }
})
export default styles;
