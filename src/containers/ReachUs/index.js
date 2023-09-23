import React, { useEffect, useState, useContext } from 'react'
import { View, Text, Modal, TouchableOpacity, Image, Alert } from 'react-native'
import { UserContext } from "@context/user-context";
import { BackgroundView, TextField, Spinner } from '@common';
import { Header } from '@components'
import { useNavigation } from '@react-navigation/native';
import { Fonts, Colors } from '@Themes'
import services from "@services";
import constants from "@constants";
import Images from '../../Themes/Images';
import { LanguageContext } from '@context/lang-context';
import styles from './styles';
function ListView({ title, icon }) {

    return (
        <View style={styles.textViewContainer}>
            <View style={styles.imageView}>
                <Image source={icon} style={styles.img} />
            </View>
            <View style={styles.textView}>
                <Text style={styles.text}>{title}</Text>
            </View>
        </View>
    )
}
export default function ReachUs() {
    const { lang, setLang } = useContext(LanguageContext);
    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Header />
            </View>
            <View style={styles.content}>
                <BackgroundView />

                <View style={styles.contentView}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.headerView1}>
                            <Text style={styles.header1}>{lang["Contact KTP"]}</Text>
                        </View>
                        <View style={styles.headerView2}>
                            <Text style={styles.title}>{lang["Head Office"]}</Text>
                            <ListView title="Al Malaz P.O Box: 157, Riyadh - 11411 Kingdom of Saudi Arabia" icon={Images.icons.address} />
                            <ListView title="info@alkoblan.com.sa" icon={Images.icons.email} />
                            <ListView title="+966 (01)-4760663/ 4767962 / 4724676" icon={Images.icons.phone} />
                            <ListView title="+966 (011)-4762389" icon={Images.icons.fax} />
                        </View>
                        <View style={styles.headerView3}>
                            <Text style={styles.header2}>{lang["Branch Office"]}</Text>
                            <Text style={styles.header3}>{lang["Dammam"]}</Text>
                            <ListView title="+966 (013)-8473637" icon={Images.icons.phone} />
                            <ListView title="+966 (013)-84736" icon={Images.icons.fax} />
                        </View>
                        <View style={styles.headerView4}>
                            <Text style={styles.header3}>{lang["Riyadh"]}</Text>
                            <ListView title="+966 (012)-6657281" icon={Images.icons.phone} />
                            <ListView title="+966 (012)-6657281" icon={Images.icons.fax} />
                        </View>
                        <View style={styles.emptyView}>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
