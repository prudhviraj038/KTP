
import React, { useEffect, useState, useContext } from 'react'
import { View, Text, Modal, TouchableOpacity, Image, Alert, ScrollView, useWindowDimensions, I18nManager } from 'react-native'
import { UserContext } from "@context/user-context";
import { BackgroundView, TextField, Spinner } from '@common';
import { Header } from '@components'
import { useNavigation } from '@react-navigation/native';
import { Fonts, Colors } from '@Themes'
import services from "@services";
import constants from "@constants";
import Images from '../../Themes/Images';
import HTML from "react-native-render-html";
import styles from "./styles";
export default function MissionVision() {
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState(null);
    const contentWidth = useWindowDimensions().width;

    useEffect(() => {

        fetchPages()


    }, []);
    const fetchPages = () => {
        services(constants.API_BASE_URL + "/pages").then((response) => {
            if (response) {


                // fetchPages()
                // console.log(response[0].description, "responsesresponsesresponses")
                if (I18nManager.isRTL) {
                    setData(response[0].description_ar)
                } else {
                    setData(response[0].description)
                }
                // setData(response[0].description)
                setSpinner(false)
                // getCountry();
            }
        });
    };
    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Header />
            </View>
            <View style={styles.content}>
                <BackgroundView />

                <View style={styles.contentView}>
                    <View style={styles.subContent}>
                        {spinner ? (
                            <Spinner initialLoad />
                        ) : data ? (
                            <ScrollView >
                                <HTML tagsStyles={{
                                    p: styles.paragraphText,
                                    div: styles.divText
                                }}
                                    source={{ html: data }}
                                    // html={data || '<p></p>'}
                                    contentWidth={contentWidth} />
                            </ScrollView>) : null}
                    </View>
                </View>
            </View>
        </View>
    )
}
