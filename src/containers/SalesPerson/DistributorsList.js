import React, { useContext, useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, Pressable, } from 'react-native'
import { UserContext } from "@context/user-context";
import { BackgroundView, TextField, Spinner } from '@common';
import { Header } from '@components'
import { useNavigation } from '@react-navigation/native';
import { Fonts, Colors } from '@Themes'
import services from "@services";
import constants from "@constants";
import { LanguageContext } from '@context/lang-context';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'TATA',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Sabic',
    },
];
export default function DistributorsList() {
    const { lang, setLang } = useContext(LanguageContext);
    const navigation = useNavigation();
    const { user, setUser } = useContext(UserContext);
    const [spinner, setSpinner] = useState(true);
    const [distributors, setDistributors] = useState([]);
    useEffect(() => {

        fetchDistributors()


    }, []);
    const fetchDistributors = () => {
        services(constants.API_BASE_URL + "/sales_distributors?s_code=" + user.s_code + "&limit=0").then((response) => {
            if (response && response.length > 0) {


                // fetchPages()
                // console.log(response[0].description, "responsesresponsesresponses")

                setDistributors(response)
                setSpinner(false)
                // getCountry();
            }
        });
    };
    const _renderItem = ({ item, index }) => (
        <Pressable style={[styles.item, { marginTop: index === 0 ? 10 : 0 }]} onPress={() => navigation.push("MapDistributor", { item })}>
            <Text style={styles.title}>{item.fullname}</Text>
            {item.latitude && item.longitude ? (
                <Text style={styles.text}>{lang["Updated"]}</Text>
            ) : (
                <Text style={styles.text1}>{lang["Not Updated"]}</Text>
            )}

        </Pressable>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Header />
            </View>
            <View style={styles.content}>
                <BackgroundView />

                <View style={styles.contentView}>
                    {spinner ? (
                        <Spinner initialLoad />
                    ) : (
                        <FlatList
                            data={distributors}
                            renderItem={_renderItem}
                            keyExtractor={item => item.id}
                        />
                    )}

                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'white'
    },
    headerView: { flex: 0.1 },
    content: { flex: 0.9 },
    item: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        // marginVertical: 6,
        marginHorizontal: 10,
        borderRadius: 5,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    title: {
        fontSize: rf(1.5),
        fontFamily: Fonts.regular,
        color: "black"
    },
    text: {
        fontSize: rf(1.5),
        fontFamily: Fonts.medium,
        color: Colors.green
    },
    text1: {
        fontSize: rf(1.5),
        fontFamily: Fonts.medium,
        color: Colors.reject
    },
    contentView: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: Colors.overlayWhite }
});