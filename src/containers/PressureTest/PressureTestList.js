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
function ShowText({
    name,
    title,
}) {
    return (
        <Text style={styles.idText}>{title} : <Text style={{ fontFamily: Fonts.medium }}> {user.fullname}</Text>  </Text>
    )
}
export default function PressureTestList() {
    const { lang, setLang } = useContext(LanguageContext);
    const { user, setUser } = useContext(UserContext);
    const [entries, setEntries] = useState([]);
    const [spinner, setSpinner] = useState(true);
    const navigation = useNavigation();
    useEffect(() => {

        checkUserType()
    }, []);
    const fetchReportsList = (text) => {
        console.log(constants.API_BASE_URL + "/" + text + "/" + user.id, "//////")
        services(constants.API_BASE_URL + "/" + text + "/" + user.id).then((response) => {
            if (response && response.length > 0) {

                setEntries(response)

                setSpinner(false)

            } else {
                setSpinner(false)
            }
        });
    };
    function checkUserType() {
        if (user.usertype === 7) {
            fetchReportsList("pressure_tests_tech")
        } else if (user.usertype === 2 || user.usertype === 11) {
            fetchReportsList("pressure_tests_cust")
        } else {
            fetchReportsList("pressure_tests_plumb")
        }
    }
    function handleBack() {
        setSpinner(true)
        checkUserType()
    }
    function _renderItem({ item, index }) {
        return (
            <View style={styles.rowData}>
                <View style={styles.nameView}>
                    {
                        user.usertype === 2 || user.usertype === 11 || user.usertype === 3 ? (
                            <Text style={styles.text}>{item.technician_id.fullname}</Text>
                        ) : <Text style={styles.text}>{item.customer_id.fullname}</Text>
                    }

                </View>
                <View style={styles.reportView}>
                    <Text style={styles.text}>{moment(item.now).format('YYYY-MM-DD')}</Text>
                </View>
                <View style={styles.reportView}>
                    {user.usertype === 3 ? (
                        <Text style={styles.text}>{item.customer_id.fullname}</Text>
                    ) : (null)}
                    {/* <Text style={styles.text}>{item.PY_SUP.fullname}</Text> */}
                </View>
                {/* <View style={{ flex: 0.15, justifyContent: 'center', }}>
                    <Text style={styles.text}>{item.PY_AMT}</Text>
                </View> */}
                {/* <View style={{ flex: 0.3, justifyContent: 'center', }}>
                    <Text style={styles.text}>{item.PY_TYPE.title}</Text>
                </View> */}
                <View style={styles.iconView}>
                    <Pressable onPress={() => navigation.push("PressureTestDetails", { item })}>
                        <Text style={[styles.text, { color: Colors.theme }]}>{lang["View"]}</Text>
                    </Pressable>
                </View>
            </View>
        )
    }
    function _renderHeader({ item, index }) {
        return (
            <View style={styles.rowHeader}>
                <View style={styles.nameView}>
                    {
                        user.usertype === 2 || user.usertype === 11 || user.usertype === 3 ? (
                            <Text style={styles.header}>{lang["Technician Name"]}</Text>
                        ) : <Text style={styles.header}>{lang["Customer Name"]}</Text>
                    }


                </View>
                <View style={styles.reportView}>
                    <Text style={styles.header}>{lang["Date of Report"]}</Text>
                </View>
                <View style={styles.reportView}>
                    {user.usertype === 3 ? (
                        <Text style={styles.header}>{lang["Customer Name"]}</Text>
                    ) : (null)}
                    {/* <Text style={styles.header}>{lang["Receipt No"]}.</Text> */}
                </View>
                {/* <View style={{ flex: 0.15, justifyContent: 'center', }}>
                    <Text style={styles.header}>Amount</Text>
                </View> */}
                {/* <View style={{ flex: 0.3, justifyContent: 'center', }}>
                    <Text style={styles.header}>Receipt {"\n"} Type</Text>
                </View> */}
                <View style={styles.iconView}>
                    {/* <Pressable >
                        <Image source={Images.icons.edit} style={{ height: 13, width: 13, tintColor: Colors.theme }} />
                    </Pressable> */}
                </View>
            </View>
        )
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
                                <Text style={styles.headerText}>{lang["Pressure Test"]}</Text>

                                {user.usertype === 7 ? (
                                    <View style={styles.borderLine}>

                                        <Text style={styles.idText}>{lang["Technician Name"]} : <Text style={{ fontFamily: Fonts.medium }}> {user.fullname}</Text>  </Text>

                                        <Pressable
                                            style={styles.requestButton}
                                            onPress={() => navigation.push("PressureTest", { onNavigatingBack: handleBack })}
                                        >
                                            <Text style={styles.requestButtonText}>{lang["New Report"]}</Text>
                                        </Pressable>
                                    </View>
                                ) : null}
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
