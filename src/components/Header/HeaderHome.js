import React from 'react'
import { View, Text, Image, TouchableOpacity, Pressable, StyleSheet } from 'react-native'
import { Images, Colors } from '@Themes'
import { useNavigation } from '@react-navigation/native';
import AutoHeightImage from 'react-native-auto-height-image';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
export default function HeaderHome() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.iconView} >
                <Pressable onPress={() => navigation.openDrawer()} style={styles.pressableView}>
                    <Image source={Images.icons.menu} style={styles.icon} />
                </Pressable>
            </View>
            <View style={styles.middleView} >
                {/* <Image source={Images.logo} style={{ height: 154 / 3.5, width: 400 / 3.5 }} /> */}
                <AutoHeightImage source={Images.logo} width={rh(15)} />
            </View>
            <View style={styles.iconView} >
            <Pressable onPress={() => navigation.push("Notifications")} style={styles.pressableView}>
                <Image source={Images.icons.bell} style={styles.icon} />
                </Pressable>
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderColor: 'lightgrey' },
    iconView: { flex: 0.15, justifyContent: 'center', alignItems: 'center', },
    pressableView: { height: rh(4.5), width: rh(4.5), alignItems: 'center', justifyContent: 'center', },
    icon: { height: rh(3), width: rh(3), tintColor: Colors.theme },
    middleView: { flex: 0.7, justifyContent: 'center', alignItems: 'center', }
})

