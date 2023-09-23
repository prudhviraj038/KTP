import { Dimensions, StyleSheet } from 'react-native';
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
    contentView: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: Colors.overlayWhite },
    subContent: { flex: 1, marginHorizontal: 15 },
    headerText: {
        fontSize: rf(2), fontFamily: Fonts.medium, textAlign: 'center',
        marginBottom: 5,

    },
    dateView: { flexDirection: 'row', marginVertical: 10, },
    fromDateView: { flex: 0.37, },
    fromDateText: {
        fontSize: rf(1.6), fontFamily: Fonts.medium,
        textAlign: "left"

    },
    buttonView: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: Colors.f2f2f2, borderRadius: 5,
        borderWidth: 1, borderColor: "#cbcbcb",
        height: rh(4), marginTop: 10, width: "100%",
        paddingLeft: 10
    },
    emptyView: { flex: 0.03 },
    getButtonView: { flex: 0.2, justifyContent: 'flex-end', },
    getButton: {
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: Colors.theme, borderRadius: 5,
        borderWidth: 1.5, borderColor: Colors.theme,
        height: rh(4)
    },
    getText: { color: Colors.white, fontFamily: Fonts.medium, fontSize: rf(1.7), paddingHorizontal: 10, },
    dateText: { color: Colors.lightblack, fontFamily: Fonts.medium, fontSize: rf(1.5), },
    listView: { marginTop: 20, borderColor: "#cbcbcb", borderWidth: 1, borderRadius: 5, backgroundColor: "#f2f2f27a", },
    header: {
        fontSize: rf(1.7), fontFamily: Fonts.medium, textAlign: 'left'
    },
    text: {
        fontSize: rf(1.7), fontFamily: Fonts.regular, textAlign: 'left'
    },
    rowView: { flexDirection: "row", justifyContent: 'space-between', padding: 10, }
})
export default styles;
