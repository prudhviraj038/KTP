import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Keyboard, I18nManager, Pressable } from 'react-native';
import { BackgroundView, TextField, Spinner, SearchBar } from '@common';
import { Header, OurProducts } from '@components'
import styles from './styles';
import { Fonts, Colors } from '@Themes'
import services from "@services";
import constants from "@constants";


export default function Products() {
    const [categories, setCategories] = useState([]);
    const [indexCat, setIndexCat] = useState(0);
    const [categoryId, setCategoryId] = useState(null);
    const [products, setProducts] = useState([]);
    const [spinner, setSpinner] = useState(true);
    const [loading, setLoading] = useState(false);
    useEffect(() => {

        fetchCategories()


    }, []);
    const fetchCategories = () => {
        services(constants.API_BASE_URL + "/categories").then((response) => {
            if (response) {
                setCategories(response.categories)
                // setSpinner(false)
                // setProductId(response.categories[0].id)
                setCategoryId(response.categories[0].id)
                fetchProducts(response.categories[0].id)
                setIndexCat(0)
                setSpinner(false)
            }
        });
    };

    const fetchProducts = (categoryId) => {
        setLoading(true)
        // console.log(constants.API_BASE_URL + "/products?categories=" + productId + "&page=0")
        services(constants.API_BASE_URL + "/products?category=" + categoryId + "&page=0").then((response) => {
            if (response) {
                setProducts(response)
                // console.log("response.lengthhhhhh", response.length)
                // setSpinner(false)
                setLoading(false)
            }
        });
    };
    function onItem(item, index) {
        setIndexCat(index)
        setCategoryId(item.id)
        fetchProducts(item.id)
    }
    function renderData(item, index) {
        return (
            <View style={[styles.itemView, { backgroundColor: index === indexCat ? Colors.theme : Colors.bfbcbc }]}>
                <Text style={styles.title}>{I18nManager.isRTL ? item.title_ar : item.title}</Text>
            </View>
        )

    }
    const _renderItem = ({ item, index }) => {

        return (
            index === indexCat ? (
                renderData(item, index)
            ) :
                (<Pressable onPress={() => onItem(item, index)}>
                    {renderData(item, index)}
                </Pressable>)
        )
    };
    function onSearch(text) {
        Keyboard.dismiss()
        // console.log(text, "text")
        setLoading(true)
        // console.log(constants.API_BASE_URL + "/products?categories=" + productId + "&page=0")
        services(constants.API_BASE_URL + "/products?categories=" + categoryId + "&page=0&search=" + text).then((response) => {
            if (response) {
                setProducts(response)
                // console.log("response.lengthhhhhh", response.length)
                // setSpinner(false)
                setLoading(false)
            }
        });
    }
    return (
        <View style={styles.container}>
            <View style={{ flex: 0.1 }}>
                <Header />
            </View>
            <View style={{ flex: 0.9 }}>
                <BackgroundView />
                <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#ffffffd1" }}>

                    {spinner ? (
                        <Spinner initialLoad />
                    ) : (
                        <View style={{ flex: 1, }}>
                            <View style={{ flex: 0.1, }}>
                                <FlatList
                                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
                                    data={categories}
                                    renderItem={_renderItem}
                                    keyExtractor={item => item.id}
                                    horizontal
                                />
                            </View>
                            <View style={{ flex: 0.1 }} >
                                <SearchBar onSearch={onSearch} />
                            </View>
                            <View style={{ flex: 0.8 }} >
                                <OurProducts products={products} />
                            </View>
                        </View>
                    )}


                </View>
            </View>
            {loading && <Spinner />}
        </View>
    )
}
