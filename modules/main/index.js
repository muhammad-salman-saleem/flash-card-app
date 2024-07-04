import React from 'react'
import { Image } from 'react-native'
import { StyleService, useStyleSheet } from '@ui-kitten/components'
import { AnimateStackOnDrawerToggle } from '@components';
import Home from './home';
import UserProfile from './profile';
import FAQ from './faq';
import Resources from './resources';
import Blank from '../blank';
import UpgradeStackScreen from './upgrade/UpgradeStackScreen';
import PrivacyPolicy from './privacyPolicy';
import TermsAndCondition from './termsAndConditions';

const stackScreens = [
  // {
  //   id: 1,
  //   name: "Straight a nursing",
  //   component: (props) => <Home {...props} />,
  //   show: true,
  //   icon: () => <Image source={require("@assets/images/drawerIcon/upgrade.png")} />
  // },
  {
    id: 1,
    name: "Upgrade",
    component: (props) => <UpgradeStackScreen {...props} />,
    show: true,
    icon: () => <Image source={require("@assets/images/drawerIcon/upgrade.png")} />
  },
  {
    id: 2,
    name: "Study",
    component: (props) => <Home {...props} />,
    show: true,
    icon: () => <Image source={require("@assets/images/drawerIcon/study.png")} />
  },
  {
    id: 3,
    name: "FAQ",
    component: (props) => <FAQ {...props} />,
    show: true,
    icon: () => <Image source={require("@assets/images/drawerIcon/faq.png")} />
  },
  {
    id: 4,
    name: "Resources",
    component: (props) => <Resources {...props} />,
    show: true,
    icon: () => <Image source={require("@assets/images/drawerIcon/resources.png")} />
  },
  {
    id: 4,
    name: "Privacy Policy",
    component: (props) => <PrivacyPolicy {...props} />,
    show: true,
    icon: () => <Image source={require("@assets/images/drawerIcon/resources.png")} />
  },
  {
    id: 4,
    name: "Terms & Conditions",
    component: (props) => <TermsAndCondition {...props} />,
    show: true,
    icon: () => <Image source={require("@assets/images/drawerIcon/resources.png")} />
  },
  {
    id: 5,
    name: "Profile",
    component: (props) => <UserProfile {...props} />,
    show: false,
    icon: null
  }
];

const Main = () => {
  const styles = useStyleSheet(themedStyles)

  return (
    <AnimateStackOnDrawerToggle stackScreens={stackScreens} />
  )
}

const themedStyles = StyleService.create({

})

export default {
  title: "Main",
  navigator: Main
}
