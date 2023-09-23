import React, { useEffect, useState, } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Header } from '@components';
import Pdf from 'react-native-pdf';
import { Spinner, BackgroundView } from '@common';
import services from "@services";
import constants from "@constants";
export default function CustomerPdf({ route }) {
    const [source, setSource] = useState(null);
    const [spinner, setSpinner] = useState(true);
    const { service, item } = route.params;
    // const source = { uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true };
    useEffect(() => {
        if (service === "warranty") {
            setSource({ uri: item.pdf_file, cache: true })
            setSpinner(false)
        } else {
            fetchData()
        }

    }, []);
    const fetchData = () => {
        services(constants.API_BASE_URL + "/" + service).then((response) => {
            if (response) {

                setSource({ uri: response[0].pdf_file, cache: true })
                setSpinner(false)
            }
        });
    };
    return (
        <View style={styles.container}>
            <View style={{ flex: 0.1 }}>
                <Header />
            </View>
            <View style={{ flex: 0.9 }}>
                {spinner ? (
                    <Spinner initialLoad />
                ) : (
                    <Pdf
                        source={source}
                        onLoadComplete={(numberOfPages, filePath) => {
                            console.log(`number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            console.log(`current page: ${page}`);
                        }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        onPressLink={(uri) => {
                            console.log(`Link presse: ${uri}`)
                        }}
                        style={styles.pdf} />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'white'
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});