import React, { useState } from 'react'
import { View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { BackButton, MenuButton, Card } from '@components';
import { Text, } from '@ui-kitten/components';
import Upgrade from './';
import Checkout from './checkout';
import PaymentMethod from './paymentMethod';
import { TermsAndConditionScreen } from '../termsAndConditions';

const Stack = createStackNavigator();

const UpgradeStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="Subscriptions">
      <Stack.Screen
        options={{
          title: <Text category="s1"></Text>,
          headerTitleAlign: 'center',
          headerLeft: () => <MenuButton
            navigation={navigation} />
        }}
        name="Subscriptions"
      >
        {props => <Upgrade HeaderLeft={() => <MenuButton navigation={props.navigation} />} {...props} />}
      </Stack.Screen>

      <Stack.Screen
        name="Checkout"
        options={{
          headerTitleAlign: 'center',
        }}
        component={Checkout}
      />

      <Stack.Screen
        name="PaymentMethod"
        options={{
          headerTitleAlign: 'center',
        }}
        component={PaymentMethod}
      />

      <Stack.Screen
        options={{
          title: <Text category="s1">TERMS AND CONDITIONS</Text>,
          headerTitleAlign: 'center',
          headerLeft: () => <BackButton navigation={navigation} />
        }}
        name="PaymentTermsAndConditionScreen"
        component={TermsAndConditionScreen}
      />
    </Stack.Navigator>
  )
}

export default UpgradeStackScreen
