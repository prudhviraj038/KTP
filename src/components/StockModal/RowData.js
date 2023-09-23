import React, { Component } from 'react'
import { Text, View, TouchableOpacity, I18nManager, StyleSheet, Pressable } from 'react-native'
import { Fonts, Colors, Images } from '@Themes';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
export default class RowData extends Component {
    render() {
        return (
            <Pressable style={styles.container}
                onPress={() => this.props.getData(this.props.item)}
            >
                <View style={styles.codeView}>
                    <Text style={styles.text}>{this.props.item.S_ITEM}</Text>
                </View>
                <View style={styles.titleView}>
                    <Text style={styles.text}>
                        {I18nManager.isRTL ? this.props.item.S_ANAME : this.props.item.S_ENAME}</Text>
                </View>

            </Pressable>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5, alignItems: 'center',
        flexDirection: 'row',
        // borderTopWidth: 0,
        borderBottomWidth: 1,
        borderColor: "#cbcbcb",
        // backgroundColor: "#f2f2f27a",
        paddingVertical: 10
    },
    codeView: { flex: 0.4, },
    titleView: { flex: 0.6, },
    text: {
        fontSize: rf(1.5), fontFamily: Fonts.regular, textAlign: 'left'
    }
})
