import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, I18nManager, Pressable } from 'react-native'
import { Images, Colors, Fonts } from '@Themes';
import { useNavigation } from '@react-navigation/native';
import AutoHeightImage from 'react-native-auto-height-image';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
export default function HeaderAuth() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.iconView} >
                <Pressable onPress={() => navigation.pop()} style={styles.pressableView}>
                    <Image source={I18nManager.isRTL ? Images.icons.back_ar : Images.icons.back} style={styles.icon} />
                </Pressable>
            </View>
            <View style={styles.middleView} >
                {/* <Image source={Images.logo} style={{ height: 154 / 2.8, width: 400 / 2.8 }} /> */}
                <AutoHeightImage source={Images.logo} width={rh(20)} />
            </View>
            <View style={styles.iconView} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: { flexDirection: 'row', flex: 1 },
    iconView: { flex: 0.15, justifyContent: 'center', alignItems: 'center' },
    pressableView: { height: rh(4.5), width: rh(4.5), alignItems: 'center', justifyContent: 'center', },
    icon: { height: rh(3), width: rh(3), tintColor: Colors.theme },
    middleView: { flex: 0.7, justifyContent: 'center', alignItems: 'center', }
})