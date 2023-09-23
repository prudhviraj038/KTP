import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Fonts } from "@Themes";
const { height, width } = Dimensions.get("window")
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
    listView: {
        width: width / 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    flatlist: { marginTop: 10 },
    content: {
        position: "absolute", top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: Colors.overlayWhite
    },
    mainContent: { flex: 0.75, },
    tabsView: { flex: 0.15, },
    headerView: { flex: 0.1, },
    icon: { height: rh(4), width: rh(4), tintColor: Colors.theme },
    title: {
        marginTop: 5, fontFamily: Fonts.medium, color: Colors.theme, fontSize: rf(1.5), textAlign: 'center',
        paddingHorizontal: 5
    }
})
export default styles;
