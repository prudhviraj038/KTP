import React, { useEffect, useState, useContext } from 'react'
import { View, Text, Modal, StyleSheet, Image, Alert, ScrollView, useWindowDimensions, I18nManager, Pressable, Keyboard, FlatList } from 'react-native'

import { BackgroundView, TextField, Spinner } from '@common';
import { Header } from '@components'
import { useNavigation } from '@react-navigation/native';
import services from "@services";
import constants from "@constants";
import styles from "./styles";
import { LanguageContext } from '@context/lang-context';
import { Fonts, Colors, Images } from '@Themes';
import { UserContext } from "@context/user-context";
import moment from "moment";
import DocumentPicker from 'react-native-document-picker'
// import RNFetchBlob from 'rn-fetch-blob'
var RNFS = require('react-native-fs');
import RNFetchBlob from 'rn-fetch-blob';
export default function CollectionEntryList() {
    const { lang, setLang } = useContext(LanguageContext);
    const { user, setUser } = useContext(UserContext);
    const [entries, setEntries] = useState([]);
    const [spinner, setSpinner] = useState(true);
    const navigation = useNavigation();
    useEffect(() => {

        fetchCollectionEntry()


    }, []);
    const fetchCollectionEntry = () => {
        services(constants.API_BASE_URL + "/collection_entries?scode=" + user.s_code).then((response) => {
            if (response && response.length > 0) {
                // console.log(response, "reeeeeeee")
                // if (response.types && response.types.length > 0) {
                //     response.types.map((res, key) => {
                //         res.value = res.id;
                //         res.label = I18nManager.isRTL ? res.title_ar : res.title
                //     })
                // }
                // if (response.customers && response.customers.length > 0) {
                //     response.customers.map((customer, key) => {
                //         customer.value = customer.id;
                //         customer.label = customer.c_code
                //     })
                // }
                setEntries(response)
                // setCustomers(response.customers)
                setSpinner(false)

            } else {
                setSpinner(false)
            }
        });
    };
    function handleBack() {
        setSpinner(true)
        fetchCollectionEntry()
    }
    function _renderItem({ item, index }) {
        return (
            <View style={styles.rowContent}>
                <View style={styles.receiptView}>
                    <Text style={styles.text}>{item.PY_INV}</Text>
                </View>
                <View style={styles.dateView}>
                    <Text style={styles.text}>{moment(item.now).format('YYYY-MM-DD')}</Text>
                </View>
                <View style={styles.customerView}>
                    <Text style={styles.text}>{item.PY_SUP.fullname}</Text>
                </View>
                {/* <View style={{ flex: 0.15, justifyContent: 'center', }}>
                    <Text style={styles.text}>{item.PY_AMT}</Text>
                </View> */}
                {/* <View style={{ flex: 0.3, justifyContent: 'center', }}>
                    <Text style={styles.text}>{item.PY_TYPE.title}</Text>
                </View> */}
                <View style={styles.editIconView}>
                    <Pressable onPress={() => navigation.push("CollectionEntry", { onNavigatingBack: handleBack, item })}>
                        <Image source={Images.icons.edit} style={styles.editIcon} />
                    </Pressable>
                </View>
            </View>
        )
    }
    function _renderHeader({ item, index }) {
        return (
            <View style={styles.row}>
                <View style={styles.receiptView}>
                    <Text style={styles.header}>{lang["Receipt No"]}.</Text>
                </View>
                <View style={styles.dateView}>
                    <Text style={styles.header}>{lang["Date of Receipt"]}</Text>
                </View>
                <View style={styles.customerView}>
                    <Text style={styles.header}>{lang["Customer Name"]}</Text>
                </View>
                {/* <View style={{ flex: 0.15, justifyContent: 'center', }}>
                    <Text style={styles.header}>Amount</Text>
                </View> */}
                {/* <View style={{ flex: 0.3, justifyContent: 'center', }}>
                    <Text style={styles.header}>Receipt {"\n"} Type</Text>
                </View> */}
                <View style={styles.editIconView}>
                    {/* <Pressable >
                        <Image source={Images.icons.edit} style={{ height: 13, width: 13, tintColor: Colors.theme }} />
                    </Pressable> */}
                </View>
            </View>
        )
    }
    async function pickFile() {
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.allFiles],
            })
            for (const res of results) {
                console.log(
                    res.uri,
                    res.type, // mime type
                    res.name,
                    res.size,
                    "pppppppppp"
                )
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err
            }
        }
    }
    function downloadFile() {
        // RNFetchBlob
        //     .config({
        //         // add this option that makes response data to be stored as a file,
        //         // this is much more performant.
        //         fileCache: true,
        //     })
        //     .fetch('GET', 'https://wallpaperaccess.com/full/1376490.jpg', {
        //         //some headers ..
        //     })
        //     .then((res) => {
        //         // the temp file path
        //         // let status = res.info().status;

        //         console.log('The file saved to ', res.path())


        //     })


        let downloadDest = `${RNFS.ExternalStorageDirectoryPath}/Download/123.pdf`;

        RNFetchBlob.config({
            addAndroidDownloads: {
                useDownloadManager: true,
                path: downloadDest,
                notification: true,
                mime: '/'
            }
        })
            .fetch('GET', 'http://www.africau.edu/images/default/sample.pdf', {
                //some headers ..
            })
            .then((res) => {
                // RNFetchBlob.android.actionViewIntent(res.path(), '/')
            })

    }
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
                        <ScrollView>
                            <View style={styles.subContent}>
                                <Text style={styles.headerText}>{lang["Collection Entry"]}</Text>

                                <View style={styles.borderLine}>
                                    <Text style={styles.idText}>{lang["Sales Person ID"]} : <Text style={{ fontFamily: Fonts.medium }}> {user.s_code}</Text>  </Text>

                                    <Pressable
                                        style={styles.requestButton}
                                        onPress={() => navigation.push("CollectionEntry", { onNavigatingBack: handleBack })}
                                    >
                                        <Text style={styles.requestButtonText}>{lang["New Receipt"]}</Text>
                                    </Pressable>
                                </View>

                                {entries && entries.length > 0 ? (
                                    <FlatList
                                        data={entries}
                                        renderItem={_renderItem}
                                        keyExtractor={item => item.id}
                                        ListHeaderComponent={_renderHeader}
                                        // numColumns={3}
                                        style={styles.flatlist}
                                        showsVerticalScrollIndicator={false}

                                    />
                                ) : (
                                    <Text style={styles.noData}>{lang["No Data Found"]}</Text>
                                )}


                            </View>
                        </ScrollView>)}
                </View>

            </View>
        </View>
    )
}
