import React from "react";
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button } from '@ui-kitten/components';

const LoadingIndicator = (props) => (
    <View style={[props.style, styles.indicator]}>
        <ActivityIndicator size="small" color={props.status === 'basic' ? "#F78171" : "#FFFFFF"} />
    </View>
);

// UI Kitten button wrapper that adds loading field to the button
const MyButton = (props) => <Button
    accessoryLeft={props.loading ? <LoadingIndicator status={props.status} /> : null}
    {...props}>
    {props.children}
</Button>

export default MyButton

const styles = StyleSheet.create({
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});