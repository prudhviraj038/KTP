import React, { useContext } from 'react'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { Images, Colors, Fonts } from '@Themes';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '@context/lang-context';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
export default function HomeTabs() {
    const navigation = useNavigation();
    const { lang, setLang } = useContext(LanguageContext);
    return (
        <View style={styles.container}>
            <Pressable style={styles.view}
                onPress={() => navigation.push("LocateDistributor")}
            >
                <Image source={Images.tabs.location} style={styles.icon} />
                <Text style={styles.text}>{lang["Locate"]} {"\n"} {lang["Distributor"]}</Text>
            </Pressable>
            <Pressable style={styles.view}
                onPress={() => navigation.push("Products")}>
                <Image source={Images.tabs.pipeline} style={styles.icon} />
                <Text style={styles.text}>{lang["Our"]} {"\n"} {lang["Products"]}</Text>
            </Pressable>

            <Pressable style={styles.view}
                onPress={() => navigation.push("ReachUs")}>
                <Image source={Images.tabs.email} style={styles.icon} />
                <Text style={styles.text}>{lang["Reach"]} {"\n"} {lang["Us"]}</Text>
            </Pressable>

            <Pressable style={styles.view}
                onPress={() => navigation.push("MissionVision")}>
                <Image source={Images.tabs.mission} style={styles.icon} />
                <Text style={styles.text}>{lang["Mission"]} {"\n"} {lang["and Vision"]}</Text>
            </Pressable>

        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderColor: 'lightgrey' },
    view: { flex: 0.25, alignItems: 'center', justifyContent: 'center', },
    icon: { width: rh(4), height: rh(4), tintColor: Colors.theme },
    text: { textAlign: 'center', marginTop: 5, fontSize: rf(1.5), color: Colors.theme, fontFamily: Fonts.medium }
})
