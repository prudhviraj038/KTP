import React, { useState, useEffect, useContext } from 'react'
import {
    View, Text,
    FlatList, SafeAreaView,
    Image, TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    I18nManager,
    Platform, Pressable
} from 'react-native'
import { Fonts, Colors, Images } from '@Themes';
import { BackgroundView, TextField, Spinner } from '@common';
import services from "@services";
import constants from "@constants";
import { Chase } from 'react-native-animated-spinkit';

import { LanguageContext } from '@context/lang-context';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
const { height, width } = Dimensions.get("window")
export default function SalesReportModal({ onClose, getData, customers }) {
    const { lang, setLang } = useContext(LanguageContext);
    // const [spinner, setSpinner] = useState(true);
    // const [loading, setLoading] = useState(false);
    // const [stock, setStock] = useState([]);
    // const [offset, setOffset] = useState(0);
    // const [isListEnd, setIsListEnd] = useState(false);
    // const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {

        // fetchStock()
        // console.log(selectedStock, "selectedStockselectedStockselectedStock")

    }, []);



    const _renderItem = ({ item, index }) => {
        return (
            <Pressable style={styles.rowContainer}
                onPress={() => getData(item)}
            >
                {/* <View style={styles.codeView}> */}
                <Text style={styles.text}>{item.c_code}</Text>
                {/* </View>
                <View style={styles.titleView}> */}
                <Text style={styles.text}>
                    {item.fullname}</Text>
                {/* </View> */}

            </Pressable>
        )
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentView}>
                <Pressable onPress={onClose} style={{ alignItems: 'flex-end', }}>
                    <Image source={Images.icons.cancel} style={styles.icon} />
                </Pressable>

                <FlatList
                    data={customers}
                    renderItem={_renderItem}
                    keyExtractor={item => item.id}
                    style={styles.listView}
                    showsVerticalScrollIndicator={false}

                />
            </View>
            {/* {loading && <Spinner />} */}
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({

    container: {

        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.overlay
    },

    contentView: {
        // flex: 1,
        margin: rh(3),
        backgroundColor: 'white',
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        borderRadius: 5,
        padding: rh(2),
    },
    icon: { height: rh(3), width: rh(3), tintColor: "red" },

    listView: { marginTop: 10 },
    rowContainer: {
        paddingHorizontal: 5, alignItems: 'center',
        flexDirection: 'row',
        // borderTopWidth: 0,
        borderBottomWidth: 1,
        borderColor: "#cbcbcb",
        // backgroundColor: "#f2f2f27a",
        paddingVertical: 10,
        justifyContent: 'space-between',
    },
    codeView: { flex: 0.4, },
    titleView: { flex: 0.6, },
    text: {
        fontSize: rf(1.5), fontFamily: Fonts.regular, textAlign: 'left'
    }
});