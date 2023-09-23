import { Dimensions, StyleSheet, I18nManager } from 'react-native';
import { Colors, Fonts } from '@Themes';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
const { height, width } = Dimensions.get("window")
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerView: { flex: 0.1 },
    content: { flex: 0.9 },
    headerText: {
        fontSize: rf(2), fontFamily: Fonts.medium, textAlign: 'center',
        marginBottom: 5,

    },
    contentView: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: Colors.overlayWhite },
    subContent: { flex: 1, marginHorizontal: 15 },

    inputView: { flexDirection: "row", marginTop: 10 },
    inputHeaderView: { flex: 0.35, justifyContent: 'center', },
    title: { fontFamily: Fonts.regular, textAlign: 'left', fontSize: rf(1.7) },
    input: { flex: 0.65 },
    inputStyle: {
        paddingLeft: 10, padding: 0, margin: 0,
        backgroundColor: Colors.f2f2f2,
        borderWidth: 1, borderColor: "#cbcbcb",
        fontFamily: Fonts.regular,
        color: "black",
        textAlign: I18nManager.isRTL ? "right" : "left",
        fontSize: rf(1.7),
        // fontFamily: Fonts.medium
    },
    dropdown: {
        paddingLeft: 10,
        padding: 0,
        margin: 0,
        backgroundColor: Colors.f2f2f2, borderWidth: 1,
        borderColor: "#cbcbcb",
        height: rh(5),
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: "row"
        // color: "black",
        // textAlign: "left",
        // fontSize: rf(1.7)
    },
    pickerText: {
        color: "black",
        textAlign: "left",
        fontSize: rf(1.7),
        fontFamily: Fonts.regular
    },
    idText: { fontSize: rf(1.7), fontFamily: Fonts.regular, },
    iconStyle: { height: rh(1.7), width: rh(1.7), tintColor: "grey", },
    buttonStyle: {
        justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.theme, borderRadius: 5,
        alignSelf: 'flex-end',
        marginTop: 20
    },
    btnText: { color: "white", fontFamily: Fonts.medium, fontSize: rf(1.5), paddingHorizontal: 10, paddingVertical: 8 },
    flatlist: {
        backgroundColor: "#f2f2f27a",
        borderWidth: 1,
        borderColor: "lightgrey",
        borderRadius: 5,
        marginVertical: 10,
        // marginHorizontal: 10
    },
    text: {
        fontSize: rf(1.5), fontFamily: Fonts.regular,
        textAlign: "left",
        // flexWrap: 'wrap',
        // flex: 1
    },
    header: {
        fontSize: rf(1.5), fontFamily: Fonts.medium,
        textAlign: "left"
    },
    noData: {
        fontSize: rf(1.8), fontFamily: Fonts.medium, textAlign: 'center',
        marginTop: 15,

    },
    requestButton: {
        justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.theme, borderRadius: 5, alignSelf: "flex-end",
        marginVertical: 10

    },
    requestButtonText: { color: "white", fontFamily: Fonts.medium, fontSize: rf(1.5), paddingHorizontal: 10, paddingVertical: 8 },
    borderLine: {
        borderTopWidth: 1, borderBottomWidth: 1,
        borderColor: Colors.f2f2f2, flexDirection: 'row',
        justifyContent: 'space-between', marginTop: 10,
        alignItems: 'center',

    },
    row: { flexDirection: "row", paddingVertical: 10, paddingLeft: 10 },
    rowContent: { flexDirection: "row", paddingVertical: 10, borderTopWidth: 1, borderColor: "lightgrey", paddingLeft: 10 },
    receiptView: { flex: 0.25, justifyContent: 'center', },
    dateView: { flex: 0.3, justifyContent: 'center', },
    customerView: { flex: 0.37, justifyContent: 'center', },
    editIconView: { flex: 0.08, justifyContent: 'center', },
    editIcon: { height: 13, width: 13, tintColor: Colors.theme },
    calendarIcon: { height: 15, width: 15, tintColor: "grey" },
    picekerView: { flex: 0.85 },
    iconView: { flex: 0.15, alignItems: 'center' },
    icon: {
        top: 12,
        right: 12,
    }
})
export default styles;
