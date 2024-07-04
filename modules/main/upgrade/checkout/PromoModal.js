import React from "react";
import { Modal, Pressable, View, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { Text, StyleService, useStyleSheet, Button, Input, CheckBox } from '@ui-kitten/components'
import PromoGradient from "./PromoGradient";
import { Dimensions } from "react-native";

const windowHeight = Dimensions.get('window').height;

const PromoModal = ({ modalVisible, setModalVisible, coupon, setCoupon, onApplyCoupon, api }) => {

    const styles = useStyleSheet(themedStyles);

    return (
        <Modal
            animationType="slide"
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
                        <PromoGradient style={styles.promoBG} />
                        <View style={styles.modalContent}>
                            <Text category="h4" style={styles.header}>Enter the promotion code below</Text>
                            <Input
                                style={styles.input}
                                textStyle={styles.inputText}
                                value={coupon}
                                onChangeText={setCoupon}
                            />
                            <Button
                                disabled={api.loading.validateCoupon}
                                accessoryLeft={api.loading.validateCoupon ? <ActivityIndicator color={'white'} /> : null}
                                onPress={onApplyCoupon}

                                style={styles.button}>
                                {eva => <Text {...eva} style={styles.buttonTextStyle}>APPLY CODE</Text>}
                            </Button>

                            {api.couponError ? <Text style={styles.errorMessage}>{api.couponError}</Text> : null}
                        </View>
                    </View>

                </View>
            </Pressable>
        </Modal>
    );
};

export default PromoModal;

const themedStyles = StyleService.create({
    centeredView: {
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: windowHeight * 0.2,
        shadowColor: "#332200",
        shadowOffset: {
            width: 20,
            height: 38,
        },
        shadowOpacity: 0.35,
        shadowRadius: 30.00,
        elevation: 24,
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    promoBG: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    modalView: {
        borderRadius: 16,
        width: '90%',
        maxWidth: 368,
        alignItems: "center",
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#FFF',
    },
    modalContent: {
        padding: 38,
        width: '100%'
    },
    header: {
        textAlign: 'center',
        lineHeight: 32
    },
    input: {
        marginTop: 24,
        borderColor: '#FFC61C',
        borderWidth: 0.5,
        height: 45,
    },
    inputText: {
        fontSize: 18,
        fontWeight: '900',
        textAlign: 'center',
        textTransform: 'uppercase',
        fontFamily: 'Gilroy-Bold',
        height: 45,
        color: '#1D2B48',
        letterSpacing: 2
    },
    button: {
        backgroundColor: '#FFC61C',
        borderColor: '#FFF',
        borderWidth: 0.5,
        width: '100%',
        height: 60,
        marginTop: 40,
    },
    buttonTextStyle: {
        fontSize: 16,
        letterSpacing: 1,
        color: '#FFF',
        fontFamily: 'Gilroy-Bold',
    },
    errorMessage: {
        marginTop: 20,
        textAlign: 'center'
    }
});
