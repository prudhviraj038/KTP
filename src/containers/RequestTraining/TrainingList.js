import React, { useEffect, useState, useContext } from 'react'
import { View, Text, Modal, StyleSheet, Image, Alert, ScrollView, FlatList, I18nManager, Pressable, Keyboard } from 'react-native'

import { BackgroundView, TextField, Spinner } from '@common';
import { Header } from '@components'
import { useNavigation } from '@react-navigation/native';
import services from "@services";
import constants from "@constants";

import HTML from "react-native-render-html";
import styles from "./styles";
import { LanguageContext } from '@context/lang-context';
import { Fonts, Colors, Images } from '@Themes';
import { UserContext } from "@context/user-context";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import moment from "moment";
export default function TrainingList() {
    const { lang, setLang } = useContext(LanguageContext);
    const { user, setUser } = useContext(UserContext);
    const [trainingList, setTrainingList] = useState([]);
    const [spinner, setSpinner] = useState(true);
    const navigation = useNavigation();
    useEffect(() => {
        fetchTrainingList()
        // let res = await fetch(
        //     "https://food.webykw.com/app/",
        //     {
        //         method: 'GET',

        //         headers: {
        //             'Content-Type': 'application/json; ',
        //         },
        //     }
        // );
        // let responseJson = await res.json();
        // console.log(responseJson, "responseJsonresponseJson")
    }, []);
    function handleBack() {
        setSpinner(true)
        fetchTrainingList()
    }
    const fetchTrainingList = () => {
        // console.log(constants.API_BASE_URL + "/" + text + "/" + user.id, "//////")
        var type = "0"
        if (user.usertype === 4) {
            type = "1"
        } else if (user.usertype === 7) {
            type = "2"
        }
        services(constants.API_BASE_URL + "/request_trainings/" + user.id + "/" + type).then((response) => {
            if (response && response.length > 0) {

                setTrainingList(response)

                setSpinner(false)

            } else {
                setSpinner(false)
            }
        });
    };
    function onItemPressed(item) {
        var routing = "TrainingDetails"
        if (user.usertype === 4) {
            routing = "RequestTrainingSupervisor"
        } else if (user.usertype === 7) {
            routing = "TrainingDetails"
        }
        navigation.push(routing, { item, onNavigatingBack: handleBack })
    }
    function _renderData(item, index) {
        var color = "black";
        var status = ""
        if (item.cur_status === 0) {
            color = "black"
            status = lang["Under Review"]
        } else if (item.cur_status === 1) {
            color = Colors.theme
            if (user.usertype === 7) {
                status = lang["New"]
            } else {
                status = lang["Assigned"]
            }
        } else if (item.cur_status === 2) {
            color = Colors.orange
            status = lang["Started"]
        } else if (item.cur_status === 3) {
            color = Colors.theme
            status = lang["Completed"]
        }
        return (
            <View style={styles.rowData}>
                <View style={styles.idView}>
                    <Text style={styles.text}>{item.id}</Text>
                </View>

                <View style={styles.msgView}>
                    <Text style={styles.text}>{item.message}</Text>

                </View>

                <View style={styles.statusView}>

                    <Text style={[styles.text, { color: color }]}>{status}</Text>

                </View>
            </View>
        )
    }
    function _renderItem({ item, index }) {

        return (

            <Pressable onPress={() => onItemPressed(item)}>
                {_renderData(item, index,)}
            </Pressable>
        )
    }
    function _renderHeader() {
        return (
            <View style={styles.rowHeader}>
                <View style={styles.idView}>

                    <Text style={styles.header}>{lang["Training Id"]}</Text>

                </View>
                <View style={styles.msgView}>
                    <Text style={styles.header}>{lang["Message"]}</Text>
                </View>

                <View style={styles.statusView}>
                    <Text style={styles.header}>{lang["Status"]}</Text>
                </View>
            </View>
        )
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
                    ) :
                        (<ScrollView>
                            <View style={styles.subContent}>
                                <Text style={styles.headerText}>{lang["Request Training"]}</Text>
                                {user.usertype === 2 ? (
                                    <Pressable
                                        style={styles.requestButton}
                                        onPress={() => navigation.push("RequestTraining", { onNavigatingBack: handleBack })}
                                    >
                                        <Text style={styles.requestButtonText}>{lang["New Request"]}</Text>
                                    </Pressable>
                                ) : (
                                    null
                                )}
                                {trainingList && trainingList.length > 0 ? (
                                    <FlatList
                                        data={trainingList}
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
