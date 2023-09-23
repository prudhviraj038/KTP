import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, Pressable, Alert } from 'react-native'
import { Header } from '@components'
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Spinner, BackgroundView } from '@common';
import { Images, Colors, Fonts } from '@Themes';
import { useNavigation } from '@react-navigation/native';
import services from "@services";
import constants from "@constants";
import { LanguageContext } from '@context/lang-context';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
const Latitude_Delta = 0.015;
const Longitude_Delta = 0.0121;

export default function MapDistributor({ route }) {
    const { lang, setLang } = useContext(LanguageContext);
    const [region, setRegion] = useState(null);
    const [spinner, setSpinner] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { item } = route.params;
    // console.log(item, "itemitemitemitem")
    useEffect(() => {
        // fetchDistributors()
        getCurrentLocation()
    }, [])
    function getCurrentLocation() {
        Geolocation.getCurrentPosition(
            (position) => {
                // console.log(position, "-------------");
                setRegion({
                    latitude: parseFloat(position.coords.latitude),
                    longitude: parseFloat(position.coords.longitude),
                    latitudeDelta: Latitude_Delta,
                    longitudeDelta: Longitude_Delta,
                })
                // fetchDistributors()
                setSpinner(false)
                setLoading(false)
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
                setSpinner(false)
                setLoading(false)
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    function onSave() {
        var data = {
            "member_id": item.id.toString(),
            "latitude": region.latitude.toString(),
            "longitude": region.longitude.toString()
        }
        // console.log(data, "datadata")
        setLoading(true)
        services(constants.API_BASE_URL + "/distributor_update", data, "POST").then((response) => {
            if (response && response.status === "Success") {
                Alert.alert(
                    lang["KTP"],
                    response.message,
                    [

                        {
                            text: lang["Ok"], onPress: () => {
                                setLoading(false);
                                navigation.pop();
                            }
                        }
                    ]
                );

            } else {

            }
        });
    }
    function onRegionChange(region) {
        // console.log(region, "regionregionregion")
        setRegion(region)
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
            </View>
            <View style={styles.content}>
                {spinner ? (
                    <Spinner initialLoad />
                ) : (
                    <View style={{ flex: 1 }}>
                        <MapView
                            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                            style={styles.map}
                            region={region}
                            onRegionChangeComplete={onRegionChange}
                        // showsUserLocation
                        >

                            {/* {distributors.map((marker, index) => (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: parseFloat(marker.latitude),
                                    longitude: parseFloat(marker.longitude)
                                }}
                                title={marker.fullname}
                            //   description={marker.description}
                            />
                        ))} */}
                        </MapView>
                        <View style={styles.markerFixed}>
                            <Image style={styles.pinIcon} source={Images.icons.pin} />
                        </View>
                        <View style={[styles.headerView, { backgroundColor: "transparent" }]}>
                            <Pressable
                                onPress={() => {
                                    setLoading(true);
                                    getCurrentLocation()
                                }}
                                style={styles.gpsIconView}>
                                <Image style={styles.gpsIcon} source={Images.icons.gps} />
                            </Pressable>
                        </View>
                    </View>
                )}
            </View>
            <Pressable
                onPress={() => onSave()}
                style={styles.buttonView} >
                <Text style={styles.buttonText}>{lang["Save"]}</Text>
            </Pressable>
            {loading && <Spinner />}
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,

    },
    map: {
        flex: 1
    },
    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '50%'
    },
    headerView: {
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
        top: 0,
        position: 'absolute',
        width: '100%',
        // flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-end',
        // zIndex: -1
        // marginBottom: 10
    },
    buttonView: { flex: 0.07, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theme },
    buttonText: {
        fontFamily: Fonts.medium,
        color: "white",
        fontSize: rf(2)
    },
    header: { flex: 0.1 },
    content: { flex: 0.83 },
    pinIcon: {
        height: rh(2.5),
        width: rh(2.5),
        // tintColor: Colors.theme
        tintColor: "#2275FF"
    }, gpsIconView: {
        height: rh(4), width: rh(4), backgroundColor: 'white',
        alignItems: 'center', justifyContent: 'center',
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 5,
        borderRadius: 2,
        margin: 10
    },
    gpsIcon: {
        height: rh(2.5),
        width: rh(2.5),
        // tintColor: Colors.theme
        tintColor: "black"
    }
})