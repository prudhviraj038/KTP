import { Dimensions, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get("window");

import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
import { Colors, Fonts } from '@Themes';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentView: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: Colors.overlayWhite },
    title: {
        fontSize: rf(2), fontFamily: Fonts.medium, textAlign: 'center',
        marginBottom: 5
    },
    headerView: { flex: 0.1 },
    content: { flex: 0.9 },
    headerView1: { flex: 0.1, alignItems: 'center', justifyContent: 'center', },
    header1: { fontSize: rf(1.8), fontFamily: Fonts.medium },
    headerView2: { flex: 0.35, },
    headerView3: { flex: 0.2, },
    header2: {
        fontSize: rf(1.8), fontFamily: Fonts.medium, textAlign: 'center',
    },
    header3: {
        marginTop: 10,
        fontSize: rf(1.8), fontFamily: Fonts.medium, textAlign: 'center',
    },
    headerView4: { flex: 0.2, },
    emptyView: { flex: 0.15, },
    textViewContainer: { flexDirection: "row", marginTop: 15, alignItems: 'center', },
    imageView: { flex: 0.13, alignItems: 'center', },
    textView: { flex: 0.87 },
    img: { height: rh(2), width: rh(2), tintColor: "#666666" },
    text: { fontSize: rf(1.5), fontFamily: Fonts.regular, color: '#666666', marginRight: 15, textAlign: 'left' }
})
export default styles;
