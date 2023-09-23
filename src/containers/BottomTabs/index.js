import React, { useContext, useState } from 'react';
import { View, Text, Image, Modal, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Images, Colors, Fonts } from "@Themes";
import {
    Home,
    Profile,
    ReachUs,
    MissionVision,
    Products,
    Chat,
    Quotation,
    OrderRequest,
    OrderRequestList,
    LocateDistributor,
    DistributorsList,
    MapDistributor,
    CollectionEntry,
    // PriceList,
    // Catalog,
    Warranty,
    CustomerPdf,
    ManifoldCustomization,
    MaintenanceList,
    ManifoldList,
    SalesReport,
    ViewMaintenance,
    CollectionEntryList,
    PressureTest,
    PressureTestList,
    PressureTestDetails,
    RequestTraining,
    RequestTrainingSupervisor,
    TrainingList,
    TrainingDetails,
    AccountSystem,
} from '@containers';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from "@context/user-context";
import { ModalView } from '@common'
import { createStackNavigator } from '@react-navigation/stack';
import { LanguageContext } from '@context/lang-context';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="LocateDistributor" component={LocateDistributor} />
            <Stack.Screen name="ReachUs" component={ReachUs} />
            <Stack.Screen name="MissionVision" component={MissionVision} />
            <Stack.Screen name="Products" component={Products} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Quotation" component={Quotation} />
            <Stack.Screen name="OrderRequest" component={OrderRequest} />
            <Stack.Screen name="OrderRequestList" component={OrderRequestList} />
            <Stack.Screen name="DistributorsList" component={DistributorsList} />
            <Stack.Screen name="MapDistributor" component={MapDistributor} />
            {/* <Stack.Screen name="PriceList" component={PriceList} />
            <Stack.Screen name="Catalog" component={Catalog} /> */}
            <Stack.Screen name="Warranty" component={Warranty} />
            <Stack.Screen name="CustomerPdf" component={CustomerPdf} />
            <Stack.Screen name="ManifoldCustomization" component={ManifoldCustomization} />
            <Stack.Screen name="MaintenanceList" component={MaintenanceList} />
            <Stack.Screen name="ManifoldList" component={ManifoldList} />
            <Stack.Screen name="SalesReport" component={SalesReport} />
            <Stack.Screen name="ViewMaintenance" component={ViewMaintenance} />
            <Stack.Screen name="CollectionEntry" component={CollectionEntry} />
            <Stack.Screen name="CollectionEntryList" component={CollectionEntryList} />
            <Stack.Screen name="PressureTest" component={PressureTest} />
            <Stack.Screen name="PressureTestList" component={PressureTestList} />
            <Stack.Screen name="PressureTestDetails" component={PressureTestDetails} />
            <Stack.Screen name="RequestTraining" component={RequestTraining} />
            <Stack.Screen name="RequestTrainingSupervisor" component={RequestTrainingSupervisor} />
            <Stack.Screen name="TrainingList" component={TrainingList} />
            <Stack.Screen name="TrainingDetails" component={TrainingDetails} />
            <Stack.Screen name="AccountSystem" component={AccountSystem} />

        </Stack.Navigator>
    );
}
function BottomTabs() {
    const [modalVisible, setModalVisible] = useState(false)
    const navigation = useNavigation();
    const { user, setUser } = useContext(UserContext);
    const { lang, setLang } = useContext(LanguageContext);
    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                initialRouteName="Home"
                tabBarOptions={{

                    tabStyle: {
                        paddingVertical: 8,

                    },
                    activeTintColor: Colors.theme,
                    inactiveTintColor: Colors.grey,
                    // size: rh(4),

                    style: {
                        // padding: 10,
                        height: 60,
                        backgroundColor: '#eef5ed',
                    },
                    labelStyle: {
                        fontSize: rf(1.5),
                        margin: 0,
                        padding: 0,
                        fontFamily: Fonts.medium
                    },
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeStack}
                    options={{
                        unmountOnBlur: true,
                        tabBarLabel: lang['Home'],
                        tabBarIcon: ({ color, size }) => (
                            <Image source={Images.bottomTabs.home} style={[styles.icon, { tintColor: color }]} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="MyProfile"
                    // component={Profile}
                    children={() => <Profile onBack={() => navigation.navigate("Home")} />}
                    listeners={{
                        tabPress: e => {
                            // Prevent default action
                            e.preventDefault();
                            if (user) {
                                navigation.jumpTo('MyProfile');
                            } else {
                                setModalVisible(true)
                            }

                        },
                    }}
                    options={{
                        tabBarLabel: lang['My Profile'],
                        tabBarIcon: ({ color, size }) => (
                            <Image source={Images.bottomTabs.user} style={[styles.icon, { tintColor: color }]} />
                        ),
                        // tabBarBadge: 3,
                    }}
                />
                <Tab.Screen

                    name="Chat"
                    // component={Chat}
                    children={() => <Chat onBack={() => navigation.navigate("Home")} />}
                    listeners={{
                        tabPress: e => {
                            // Prevent default action
                            e.preventDefault();
                            if (user) {
                                navigation.jumpTo('Chat');
                            } else {
                                setModalVisible(true)
                            }

                        },
                    }}
                    options={{
                        tabBarVisible: false,
                        tabBarLabel: lang['Chat'],
                        tabBarIcon: ({ color, size }) => (
                            <Image source={Images.bottomTabs.chat} style={[styles.icon, { tintColor: color }]} />
                        ),
                    }}
                />
            </Tab.Navigator>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <ModalView
                    title={lang["KTP"]}
                    subTitle={lang["Please Login or Signup to access services"]}
                    leftButtonText={lang["Login"]}
                    rightButtonText={lang["Signup"]}
                    onRightPress={
                        () => {
                            setModalVisible(false);
                            navigation.push("SignUp");
                        }
                    }
                    onLeftPress={
                        () => {
                            setModalVisible(false);
                            navigation.push("Login");
                            //  props.navigation.goBack();
                        }
                    }
                    onClose={() => setModalVisible(false)}
                    closeIcon={true}
                />
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    icon: {
        height: rh(3), width: rh(3),
    }
})

export default BottomTabs;