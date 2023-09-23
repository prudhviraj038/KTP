import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  I18nManager,
  Pressable,
  StyleSheet,
} from "react-native";
import { Images, Colors } from "@Themes";
import { useNavigation } from "@react-navigation/native";
import AutoHeightImage from "react-native-auto-height-image";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
export default function Header({ onBack, routing, routingFrom }) {
  const navigation = useNavigation();
  function onClick() {
    if (onBack) {
      onBack();
    } else {
      navigation.pop();
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.iconView}>
        <Pressable onPress={() => onClick()} style={styles.pressableView}>
          <Image
            source={
              I18nManager.isRTL ? Images.icons.back_ar : Images.icons.back
            }
            style={styles.icon}
          />
        </Pressable>
      </View>
      <View style={styles.middleView}>
        {routing ? null : (
          <AutoHeightImage source={Images.logo} width={rh(15)} />
        )}
      </View>
      <View style={styles.iconView}>
        {routing || routingFrom ? null : (
          // <Image source={Images.icons.bell} style={styles.icon} />
          <Pressable
            onPress={() => navigation.push("Notifications")}
            style={styles.pressableView}
          >
            <Image source={Images.icons.bell} style={styles.icon} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 0,
    borderColor: "lightgrey",
  },
  iconView: { flex: 0.15, justifyContent: "center", alignItems: "center" },
  pressableView: {
    height: rh(4.5),
    width: rh(4.5),
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { height: rh(3), width: rh(3), tintColor: Colors.theme },
  middleView: { flex: 0.7, justifyContent: "center", alignItems: "center" },
});
