import { Dimensions, StyleSheet } from 'react-native';

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
    itemView: {
        // backgroundColor: Colors.bfbcbc,
        justifyContent: 'center',
        marginLeft: 12,
        // marginVertical: 12,
        borderRadius: 5,
        height: rh(4.5)
    },
    title: {
        fontFamily: Fonts.regular,
        fontSize: rf(1.5),
        color: "black",
        paddingHorizontal: 15
    }
})
export default styles;
