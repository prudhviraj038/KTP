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
    contentView: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: Colors.overlayWhite },
    headerText: {
        fontSize: rf(2), fontFamily: Fonts.medium, textAlign: 'center',
        marginBottom: 5,

    },
    subHeaderView: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    subHeaderText: {
        fontSize: rf(1.6), fontFamily: Fonts.medium,
    },
    priceText: {
        fontSize: rf(1.6), fontFamily: Fonts.medium, textAlign: 'left'
    },
    priceView: { flex: 0.65, flexDirection: 'row', justifyContent: 'space-between', },
    priceContainer: { flexDirection: 'row', marginTop: 10 },
    emptyView: { flex: 0.35 },
    buttonView: {
        height: rh(5.5), alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.theme, borderRadius: 5,
    },
    buttonText: {
        fontSize: rf(1.8), fontFamily: Fonts.medium, color: 'white'
    }
})
export default styles;
