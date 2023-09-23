import { StyleSheet, Dimensions, Platform, I18nManager } from 'react-native';
import {
    Colors,
    Fonts
} from '@Themes';
const window = Dimensions.get('window');
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    chatFullWidthContainer: {
        width: "100%",
        paddingVertical: window.width / 41.14285714,
        marginVertical: window.width / 102.8571429,
        // backgroundColor: 'pink'
    },
    rightView: { marginRight: window.width / 41.14285714, alignSelf: "flex-end", alignItems: 'center', flexDirection: 'row-reverse' },
    leftView: { marginLeft: window.width / 41.14285714, alignSelf: "flex-start", alignItems: 'center', flexDirection: 'row' },
    rightChatContainer: {
        paddingHorizontal: window.width / 20.57142857,
        paddingVertical: window.width / 27.42857143,
        // justifyContent: "center",
        borderRadius: 15,
        borderBottomRightRadius: 0,
        backgroundColor: "#f2f2f2"

    },
    leftChatContainer: {
        paddingHorizontal: window.width / 20.57142857,
        paddingVertical: window.width / 27.42857143,
        // justifyContent: "center",
        // borderRadius: window.width / 41.14285714,
        borderRadius: 15,
        borderBottomLeftRadius: 0,
        backgroundColor: Colors.theme
    },

    chatTextStyle: {
        fontSize: rf(1.6),
        fontFamily: Fonts.regular,
        color: "black"
    },
    noChatDataView: {
        flex: 1, alignItems: "center", justifyContent: "center",

    },
    myListView: {
        flex: 1, justifyContent: "flex-end", marginHorizontal: window.width / 27.42857143
    },
    inputTextView: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderTopWidth: 1,
        borderTopColor: "#ececec",
        alignItems: 'center',
    },
    inputPlaceHolderView: {
        flex: 0.85,
        paddingLeft: window.width / 82.28571429,
        justifyContent: 'center'
    },
    sendButtonView: {
        flex: 0.15,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'pink'
    },
    inputMessageStyle: {
        // flex: 1,
        // textAlignVertical: "top",
        fontSize: rf(1.6),
        color: "#000",
        paddingLeft: 20,
        textAlign: I18nManager.isRTL ? "right" : "left"
    },
    sendButtonSubView: {
        flex: 1, alignItems: "center", justifyContent: 'center',
    },
    send: { color: Colors.theme, fontFamily: Fonts.regular, fontSize: rf(1.6) }
});
export default styles;
