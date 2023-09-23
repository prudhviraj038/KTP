import React, { useEffect, useState, useContext } from 'react'
import { View, Text, Platform, Linking, TouchableHighlight } from 'react-native'
import { Header } from '@components';
import { Fonts, Colors } from '@Themes';
import styles from './styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { Spinner, BackgroundView } from '@common';
import services from "@services";
import constants from "@constants";
import { LanguageContext } from '@context/lang-context';
const Latitude_Delta = 0.015;
const Longitude_Delta = 0.0121;
export default function LocateDistributor() {
    const { lang, setLang } = useContext(LanguageContext);
    const [region, setRegion] = useState(null);
    const [spinner, setSpinner] = useState(true);
    const [distributors, setDistributors] = useState([])
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
                fetchDistributors()
                // setSpinner(false)
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    function fetchDistributors() {
        services(constants.API_BASE_URL + "/distributors?limit=0").then((response) => {
            if (response) {
                // console.log(response, "onSubmitonSubmit")
                setDistributors(response);
                setSpinner(false)
            }
        });
    }
    function onMarkerClick(marker) {
        var url = "https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=" + marker.latitude + "," + marker.longitude;
        // var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
        // var url = scheme + `${marker.latitude},${marker.longitude}`;
        // Linking.openURL(url);
        // console.log(url, "url")
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));

    }
    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Header />
            </View>
            <View style={styles.subHeader}>

                <Text style={styles.headerText}>{lang["Location"]}</Text>
            </View>
            <View style={styles.content}>
                {spinner ? (
                    <Spinner initialLoad />
                ) : (
                    <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        region={region}
                        showsUserLocation
                    >
                        {distributors.map((marker, index) => (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: parseFloat(marker.latitude),
                                    longitude: parseFloat(marker.longitude)
                                }}
                                title={marker.fullname}
                                onPress={() => onMarkerClick(marker)}
                            //   description={marker.description}
                            >

                            </Marker>
                        ))}
                    </MapView>
                )}
            </View>
        </View>
    )
}
