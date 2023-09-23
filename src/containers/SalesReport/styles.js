import { Dimensions, StyleSheet } from 'react-native';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
import { Colors, Fonts } from '@Themes'
const { height, width } = Dimensions.get("window")
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerView: { flex: 0.1 },
    content: { flex: 0.8 },
    subContent: { marginHorizontal: 15 },
    dataView: { marginTop: 10 },
    contentView: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: Colors.overlayWhite },
    headerText: {
        fontSize: rf(2), fontFamily: Fonts.medium, textAlign: 'center',
        marginBottom: 5,
    },
    rowHeader: {
        fontSize: rf(1.5), fontFamily: Fonts.medium, textAlign: 'left'

    },
    rowText: {
        fontSize: rf(1.5), fontFamily: Fonts.regular, textAlign: 'left'
    },
    total: {
        fontSize: rf(2), fontFamily: Fonts.medium,
    },
    codeView: {
        // marginRight: 5,
        height: rh(5),
        // paddingVertical: rf(1.3),
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        // paddingHorizontal: 5,
        backgroundColor: Colors.f2f2f2,
        borderColor: "#cbcbcb",
        borderWidth: 1, borderRadius: 5,
        marginTop: 10
    },
    selectedView: { flex: 0.9 },
    downArrowView: { flex: 0.1, alignItems: 'center', },
    arrow: { height: rh(1.5), width: rh(1.5), },
    codeText: {
        fontSize: rf(1.5), fontFamily: Fonts.regular, marginLeft: 5, textAlign: "left"
    },
    pickerView: {
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: Colors.f2f2f2, borderRadius: 5,
        borderWidth: 1, borderColor: "#cbcbcb",
        height: rh(5), marginTop: 10, width: "100%"
    },
    buttonView: {
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: Colors.theme, borderRadius: 5,
        borderWidth: 1.5, borderColor: Colors.theme,
        height: rh(5),
    },
    dateText: { color: Colors.lightblack, fontFamily: Fonts.medium, fontSize: rf(1.5), },
    dateContainer: { flexDirection: 'row', marginVertical: 10, },
    dateView: { flex: 0.35, },
    date: {
        fontSize: rf(1.6), fontFamily: Fonts.regular,
        textAlign: "left"

    },
    emptyView: { flex: 0.03 },
    customerCodeText: {
        fontSize: rf(1.6), fontFamily: Fonts.regular,
        textAlign: "left",

    },
    searchView: { flex: 0.24, justifyContent: 'flex-end', },
    getText: { color: Colors.white, fontFamily: Fonts.medium, fontSize: rf(1.8), paddingHorizontal: 10, },
    view: { flexDirection: "row", justifyContent: 'space-between', marginVertical: 10 },
    text: { color: Colors.black, fontFamily: Fonts.medium, fontSize: rf(1.8), },
    flatlist: { backgroundColor: "#f2f2f27a", borderWidth: 1, borderColor: "lightgrey", borderRadius: 5, marginBottom: 10 },
    noData: {
        fontSize: rf(1.8), fontFamily: Fonts.regular, textAlign: 'center',
        marginTop: 15,

    },
    bottomView: { flex: 0.1, justifyContent: 'center', alignItems: 'flex-end', marginHorizontal: 15 },
    footerListView: { marginVertical: 20, alignItems: 'center', },
    listHeader: { flexDirection: "row", padding: 10 },
    invoiceNo: { flex: 0.3 },
    invoiceDate: { flex: 0.35, alignItems: 'center', },
    netAmnt: { flex: 0.35, alignItems: 'center', },
    rowData: { padding: 10, flexDirection: "row", borderBottomWidth: 1, borderColor: "lightgrey" }
})
export default styles;
