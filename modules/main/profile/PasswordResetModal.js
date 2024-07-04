import React, { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Text, StyleService, useStyleSheet } from '@ui-kitten/components'
import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import MyButton from "../../../components/myButton";
import PasswordField from "../../../components/passwordField";
import { postChangePassowrd } from "@modules/social-login/auth";

const PasswordResetModal = ({ modalVisible, setModalVisible }) => {
    const styles = useStyleSheet(themedStyles);
    const [new_password1, setNewPassword1] = useState("")
    const [new_password2, setNewPassword2] = useState("")

    const [validationError, setValidationError] = useState({
        new_password1: "",
        new_password2: ""
    })

    const { api } = useSelector(state => state.login)
    const dispatch = useDispatch()

    const onPasswordChange = (key, value) => {
        if (key === 'new_password1') {
            setNewPassword1(value)
        }

        if (key === 'new_password2') {
            setNewPassword2(value)
        }
    }

    const onPasswordChangePress = async () => {

        let errors = {
            new_password2: "",
            new_password1: ""
        };
        let isErrorDetected = false;
        if (!new_password1) {
            errors.new_password1 = "This field is required."
            isErrorDetected = true
        }

        if (!new_password2) {
            errors.new_password2 = "This field is required."
            isErrorDetected = true
        }

        if (new_password1 !== new_password2) {
            errors.new_password2 = "Password does not match."
            isErrorDetected = true
        }

        setValidationError({ ...errors })

        if (isErrorDetected) return
        console.log({ new_password1, new_password2 })
        dispatch(postChangePassowrd({ new_password1, new_password2 }))
            .then(unwrapResult)
            .then(res => {
                setModalVisible(false)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <Pressable
                style={{ flex: 1 }}
                onPress={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.centeredView}>

                    <View style={styles.modalView}>
                        <Text category="h5" style={styles.header}>Change Password</Text>
                        <View>
                            <PasswordField
                                placeholder="Enter New Password"
                                fieldKey="new_password1"
                                onChange={onPasswordChange}
                                value={{ new_password1 }}
                                error={validationError.new_password1}
                                style={styles.input}
                            />

                            <PasswordField
                                placeholder="Confirm New Password"
                                fieldKey="new_password2"
                                onChange={onPasswordChange}
                                value={{ new_password2 }}
                                error={validationError.new_password2}
                                style={styles.input}
                            />

                        </View>

                        {api.error ? <Text style={styles.errorMessage} status={"danger"}>{api.error.message}</Text> : null}

                        <MyButton
                            style={styles.button}
                            onPress={onPasswordChangePress}
                            disabled={api.loading}
                            loading={api.loading}>
                            RESET PASSWORD
                        </MyButton>
                    </View>

                </View>
            </Pressable>
        </Modal>
    );
};

export default PasswordResetModal;

const themedStyles = StyleService.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalView: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingVertical: 40,
        padding: 25,
        width: '90%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 3,
        elevation: 5
    },
    header: {
        textAlign: 'center',
        marginBottom: 25,
    },
    input: {
        marginTop: 15,
        width: '100%'
    },

    button: {
        width: '100%',
        marginTop: 25
    },
    errorMessage: {
        marginVertical: 15
    }

});
