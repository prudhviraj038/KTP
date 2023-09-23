import React, { useContext } from 'react'
import { View, Text, ImageBackground, Dimensions, TouchableOpacity, I18nManager } from 'react-native'
import { Fonts, Colors, Images } from '@Themes';
const { height, width } = Dimensions.get('window')
import AutoHeightImage from 'react-native-auto-height-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectLanguageContext } from '@context/selectLang-context';
import RNRestart from 'react-native-restart';
export default function Language() {
    const { selectLang, setSelectLang } = useContext(SelectLanguageContext);
    // console.log(height, "=======", width)
    function selectLanguage(value) {
        // const getValue = await AsyncStorage.getItem('@LANGUAGE');
        AsyncStorage.setItem(
            '@LANGUAGE',
            JSON.stringify(value)
        );
        setSelectLang(value)
        // const getValue = JSON.parse(value)
        if (value === "Arabic") {
            I18nManager.forceRTL(true)
            RNRestart.Restart();
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <AutoHeightImage source={Images.background} style={{ height: "100%", width: "100%" }}>
                <View style={{ flex: 1, }}>
                    <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'center', }} >
                        <AutoHeightImage source={Images.logo} width={width / 1.56} />
                    </View>
                    <View style={{ flex: 0.45 }} />
                    <View style={{ flex: 0.3, justifyContent: 'flex-end', }}>

                        <AutoHeightImage
                            width={width}
                            source={Images.shape}
                        // fallbackSource={image}
                        />
                    </View>
                </View>
            </AutoHeightImage>
            <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, }}>

                <View style={{ flex: 0.68 }} />
                <View style={{ flex: 0.32, alignItems: 'center', }}>
                    <Text style={{
                        fontSize: 16, fontFamily: Fonts.medium, color: "black",

                    }}>Please Select Language</Text>
                    <TouchableOpacity style={{
                        marginTop: 15, width: width / 1.95, height: 40,
                        backgroundColor: Colors.theme, borderRadius: 5,
                        justifyContent: 'center', alignItems: 'center',
                    }}
                        onPress={() => selectLanguage("English")}>
                        <Text style={{
                            fontSize: 14, fontFamily: Fonts.medium, color: "white",

                        }}>English</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        marginTop: 20, width: width / 1.95, height: 40, backgroundColor: Colors.white,
                        borderRadius: 5, justifyContent: 'center', alignItems: 'center',
                        borderWidth: 0.5, borderColor: "lightgrey"
                    }}
                        onPress={() => selectLanguage("Arabic")}>
                        <Text style={{
                            fontSize: 14, fontFamily: Fonts.medium, color: Colors.theme,

                        }}>Arabic</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
