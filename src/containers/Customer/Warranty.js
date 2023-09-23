import React, { useEffect, useState, useContext } from 'react'
import { View, Text, StyleSheet, Dimensions, Pressable, FlatList, I18nManager, Image } from 'react-native'
import { Header } from '@components';
import Pdf from 'react-native-pdf';
import { Spinner, BackgroundView } from '@common';
import services from "@services";
import constants from "@constants";
import { Fonts, Colors, Images } from '@Themes';
import { UserContext } from "@context/user-context";
import { LanguageContext } from '@context/lang-context';
import moment from "moment";
import { useNavigation } from '@react-navigation/native';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
export default function Warranty() {
    const { user, setUser } = useContext(UserContext);
    const { lang, setLang } = useContext(LanguageContext);
    const [warrantyList, setWarrantyList] = useState([]);
    const navigation = useNavigation();
    const [spinner, setSpinner] = useState(true)
    // const source = { uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true };
    useEffect(() => {
        fetchWarrantyList()
    }, []);
    const fetchWarrantyList = () => {
        // console.log(constants.API_BASE_URL + "/warranty_cards?member_id=" + user.id)
        services(constants.API_BASE_URL + "/warranty_cards?member_id=" + user.id).then((response) => {
            if (response && response.length > 0) {

                setWarrantyList(response)
                setSpinner(false)
            } else {
                setWarrantyList([])
                setSpinner(false)
            }
        });
    };

    const _renderItem = ({ item, index }) => (
        <Pressable style={[styles.item, { borderBottomLeftRadius: index + 1 === warrantyList.length ? 5 : 0, borderBottomRightRadius: index + 1 === warrantyList.length ? 5 : 0 }]} onPress={() => navigation.push("CustomerPdf", { service: "warranty", item })}>

            <View style={{ flex: 0.3, justifyContent: 'center', }}>
                <Text style={styles.text}>{moment(item.now).format('YYYY-MM-DD')}</Text>
            </View>
            <View style={{ flex: 0.6, justifyContent: 'center', }}>
                <Text style={styles.text}>{I18nManager.isRTL ? item.title_ar : item.title}</Text>
            </View>
            <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', }}>
                <Image source={Images.icons.pdf_icon} style={{ height: rh(3), width: rh(3), }} />
            </View>
        </Pressable>
    );
    const _renderHeader = ({ item, index }) => (
        <View style={styles.headerView} >

            <View style={{ flex: 0.3 }}>
                <Text style={styles.textHeader}>{lang["Date"]}</Text>
            </View>
            <View style={{ flex: 0.6 }}>
                <Text style={styles.textHeader}>{lang["Warranty List"]}</Text>
            </View>
            <View style={{ flex: 0.1 }}>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flex: 0.1 }}>
                <Header />
            </View>
            <View style={{ flex: 0.9 }}>
                <BackgroundView />

                <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#ffffffd1" }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerText}>{lang["Warranty"]}</Text>
                        {spinner ? (
                            <Spinner initialLoad />
                        ) : warrantyList && warrantyList.length > 0 ? (
                            <FlatList
                                data={warrantyList}
                                renderItem={_renderItem}
                                ListHeaderComponent={_renderHeader}
                                keyExtractor={item => item.id}
                            />) : (
                            <Text style={{
                                fontSize: 14, fontFamily: Fonts.regular, textAlign: 'center',
                                marginTop: 15,

                            }}>{lang["No Data Found"]}</Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    item: {
        backgroundColor: 'white',
        padding: 15,
        // marginTop: 10,
        // marginVertical: 6,
        marginHorizontal: 10,
        // borderRadius: 5,
        // shadowColor: 'grey',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.8,
        // shadowRadius: 1,
        // elevation: 5,
        flexDirection: 'row',
        backgroundColor: "#f8f8f8",
        borderTopWidth: 0,
        borderWidth: 1,
        borderColor: "#e6e6e6",
        // justifyContent: "space-between"
    },
    title: {
        fontSize: rf(1.5),
        fontFamily: Fonts.regular,
        color: "black"
    },
    textHeader: {
        fontSize: rf(1.5),
        fontFamily: Fonts.medium,
        textAlign: "left"
        // color: Colors.green
    },
    text: {
        fontSize: rf(1.5),
        fontFamily: Fonts.regular,
        textAlign: "left"
        // color: Colors.reject
    },
    headerView: {
        backgroundColor: "#f8f8f8",
        padding: 15,
        marginHorizontal: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: "#e6e6e6",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
        // justifyContent: "space-between"
    },
    headerText: {
        fontSize: rf(2), fontFamily: Fonts.medium, textAlign: 'center',
        marginBottom: 15,
    }
});
