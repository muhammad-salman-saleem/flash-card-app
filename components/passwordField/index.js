import React, { useState } from "react";
import { TouchableWithoutFeedback } from "react-native"
import { Input, Text } from "@ui-kitten/components"
import Ionicons from "react-native-vector-icons/Ionicons"

const PasswordField = ({ placeholder, fieldKey, value, onChange, error, ...props }) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const renderIcon = () => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Ionicons size={24} color="#656E78" name={secureTextEntry ? 'md-eye-off' : 'md-eye'} />
        </TouchableWithoutFeedback>
    );

    const renderCaption = () => error ? <Text status={'danger'} style={{marginTop: 5, marginBottom: 10}}>{error}</Text> : null

    return <Input
        label=""
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onChangeText={val => onChange(fieldKey, val)}
        value={value[fieldKey]}
        error={error}
        status={error ? "danger" : ""}
        caption={renderCaption}
        accessoryLeft={() => (
            <Ionicons name="md-lock-closed" size={24} color="#656E78" />
        )}
        accessoryRight={renderIcon}
        style={props.style}
    />
}

export default PasswordField