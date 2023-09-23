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
    paragraphText: { color: '#666666', textAlign: 'center', fontSize: rf(1.5), fontFamily: Fonts.regular },
    divText: { color: '#666666', textAlign: 'center', fontFamily: Fonts.regular, fontSize: rf(1.5), }
})
export default styles;
