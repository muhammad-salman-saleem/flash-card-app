import * as React from "react"
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg"

const PromoGradient = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 361 438"
    fill="none"
    {...props}
    preserveAspectRatio="xMinYMin slice"
  >
    <Rect width={361} height={438} fill="#FFC61C" fillOpacity={0.8} />
    <Rect width={361} height={438} fill="url(#a)" />
    <Defs>
      <LinearGradient
        id="a"
        x1={-111.834}
        y1={-209.076}
        x2={443.503}
        y2={90.71}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#fff" />
        <Stop offset={1} stopColor="#fff" stopOpacity={0} />
      </LinearGradient>
    </Defs>
  </Svg>
)

export default PromoGradient
