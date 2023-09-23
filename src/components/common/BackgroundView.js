import React from "react";
import { View, Text, Image } from "react-native";
import { Images, Colors, Fonts } from "@Themes";
import AutoHeightImage from "react-native-auto-height-image";
export default function BackgroundView() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* <AutoHeightImage source={Images.pipes} style={{ width: 704 / 2.3, height: 454 / 2.3, }} /> */}
      <AutoHeightImage source={Images.pipes} width={704 / 2.3} />
    </View>
  );
}
