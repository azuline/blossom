/* eslint-disable */

export const moonlightPalette = {
  neutral: {
    "6": "#08051B",
    "14": "#1F1D2D",
    "21": "#2E2C3D",
    "28": "#413E52",
    "38": "#5B586B",
    "48": "#757285",
    "62": "#9896A8",
    "77": "#BEBCCC",
    "85": "#D3D1E0",
    "92": "#E7E6F0",
    "95": "#F1F1F6",
    "98": "#F9F9FB",
  },
  brand: {
    "40": "#3F319A",
    "48": "#4E3DBA",
    "54": "#5B4BC7",
    "59": "#6B5BD2",
    "64": "#7D6EDA",
    "82": "#BDB6ED",
    "90": "#D8D4F5",
    "94": "#EAE8F9",
  },
  overlay: { "38": "#5B586B33", "48": "#75728526", "62": "#9896A81a" },
  red: {
    "29": "#84190F",
    "35": "#9F2216",
    "44": "#BA3928",
    "49": "#CC4530",
    "57": "#DC5E48",
    "76": "#F69282",
    "86": "#FFC4B8",
    "91": "#F8E1DA",
  },
  orange: {
    "28": "#893C06",
    "35": "#A14E11",
    "43": "#BA601F",
    "49": "#CD702D",
    "57": "#ED8935",
    "67": "#FCAA58",
    "76": "#FDC589",
    "89": "#FFE4C6",
  },
  green: {
    "22": "#066B54",
    "28": "#0A876A",
    "38": "#11B38C",
    "45": "#17CDA2",
    "49": "#14E7B9",
    "72": "#73FBDA",
    "84": "#B1FBEC",
    "94": "#E1FEF9",
  },
} as const;

export const moonlightLight = {
  background: {
    neutral: { base: moonlightPalette["neutral"]["95"], raised: moonlightPalette["neutral"]["98"] },
    inverse: { base: moonlightPalette["neutral"]["14"], raised: moonlightPalette["neutral"]["21"] },
    overlay: {
      hover: moonlightPalette["overlay"]["62"],
      active: moonlightPalette["overlay"]["48"],
    },
    brand: {
      default: moonlightPalette["brand"]["54"],
      hover: moonlightPalette["brand"]["59"],
      active: moonlightPalette["brand"]["48"],
    },
    positive: {
      default: moonlightPalette["green"]["38"],
      hover: moonlightPalette["green"]["45"],
      active: moonlightPalette["green"]["28"],
    },
    caution: {
      default: moonlightPalette["orange"]["43"],
      hover: moonlightPalette["orange"]["49"],
      active: moonlightPalette["orange"]["35"],
    },
    negative: {
      default: moonlightPalette["red"]["44"],
      hover: moonlightPalette["red"]["49"],
      active: moonlightPalette["red"]["35"],
    },
    decoration: { weak: moonlightPalette["brand"]["94"] },
  },
  content: {
    neutral: {
      strong: moonlightPalette["neutral"]["6"],
      default: moonlightPalette["neutral"]["28"],
      weak: moonlightPalette["neutral"]["48"],
      loader: "linear-gradient(91.22deg, "
        + moonlightPalette["neutral"]["92"]
        + " 0%, "
        + moonlightPalette["neutral"]["85"]
        + " 80%)",
    },
    inverse: {
      strong: moonlightPalette["neutral"]["98"],
      default: moonlightPalette["neutral"]["92"],
      weak: moonlightPalette["neutral"]["77"],
      loader: "linear-gradient(91.22deg, "
        + moonlightPalette["neutral"]["21"]
        + " 0%, "
        + moonlightPalette["neutral"]["38"]
        + " 80%)",
    },
    brand: {
      tint: moonlightPalette["brand"]["94"],
      default: moonlightPalette["brand"]["48"],
      hover: moonlightPalette["brand"]["64"],
      disabled: moonlightPalette["brand"]["64"],
    },
    positive: {
      tint: moonlightPalette["green"]["94"],
      default: moonlightPalette["green"]["38"],
      disabled: moonlightPalette["green"]["49"],
    },
    caution: {
      tint: moonlightPalette["orange"]["89"],
      default: moonlightPalette["orange"]["43"],
      disabled: moonlightPalette["orange"]["57"],
    },
    negative: {
      tint: moonlightPalette["red"]["91"],
      default: moonlightPalette["red"]["44"],
      disabled: moonlightPalette["red"]["57"],
    },
  },
  border: {
    neutral: {
      strong: moonlightPalette["neutral"]["62"],
      default: moonlightPalette["neutral"]["77"],
      weak: moonlightPalette["neutral"]["85"],
    },
    inverse: {
      strong: moonlightPalette["neutral"]["62"],
      default: moonlightPalette["neutral"]["38"],
      weak: moonlightPalette["neutral"]["21"],
    },
    brand: { default: moonlightPalette["brand"]["48"], disabled: moonlightPalette["brand"]["82"] },
    positive: {
      default: moonlightPalette["green"]["45"],
      disabled: moonlightPalette["green"]["84"],
    },
    caution: {
      default: moonlightPalette["orange"]["43"],
      disabled: moonlightPalette["orange"]["76"],
    },
    negative: { default: moonlightPalette["red"]["49"], disabled: moonlightPalette["red"]["86"] },
  },
} as const;

export const moonlightDark = {
  background: {
    neutral: { base: moonlightPalette["neutral"]["14"], raised: moonlightPalette["neutral"]["21"] },
    inverse: { base: moonlightPalette["neutral"]["92"], raised: moonlightPalette["neutral"]["95"] },
    overlay: {
      hover: moonlightPalette["overlay"]["62"],
      active: moonlightPalette["overlay"]["38"],
    },
    brand: {
      default: moonlightPalette["brand"]["54"],
      hover: moonlightPalette["brand"]["59"],
      active: moonlightPalette["brand"]["48"],
    },
    positive: {
      default: moonlightPalette["green"]["38"],
      hover: moonlightPalette["green"]["45"],
      active: moonlightPalette["green"]["28"],
    },
    caution: {
      default: moonlightPalette["orange"]["43"],
      hover: moonlightPalette["orange"]["49"],
      active: moonlightPalette["orange"]["35"],
    },
    negative: {
      default: moonlightPalette["red"]["44"],
      hover: moonlightPalette["red"]["49"],
      active: moonlightPalette["red"]["35"],
    },
    decoration: { weak: moonlightPalette["neutral"]["21"] },
  },
  content: {
    neutral: {
      strong: moonlightPalette["neutral"]["98"],
      default: moonlightPalette["neutral"]["85"],
      weak: moonlightPalette["neutral"]["62"],
      loader: "linear-gradient(91.22deg, "
        + moonlightPalette["neutral"]["21"]
        + " 0%, "
        + moonlightPalette["neutral"]["38"]
        + " 80%)",
    },
    inverse: {
      strong: moonlightPalette["neutral"]["6"],
      default: moonlightPalette["neutral"]["21"],
      weak: moonlightPalette["neutral"]["48"],
      loader: "linear-gradient(91.22deg, "
        + moonlightPalette["neutral"]["92"]
        + " 0%, "
        + moonlightPalette["neutral"]["85"]
        + " 80%)",
    },
    brand: {
      tint: moonlightPalette["brand"]["94"],
      disabled: moonlightPalette["brand"]["64"],
      default: moonlightPalette["brand"]["82"],
      hover: moonlightPalette["brand"]["94"],
    },
    negative: {
      tint: moonlightPalette["red"]["91"],
      disabled: moonlightPalette["red"]["57"],
      default: moonlightPalette["red"]["76"],
    },
    positive: {
      tint: moonlightPalette["green"]["94"],
      disabled: moonlightPalette["green"]["49"],
      default: moonlightPalette["green"]["72"],
    },
    caution: {
      tint: moonlightPalette["orange"]["89"],
      disabled: moonlightPalette["orange"]["57"],
      default: moonlightPalette["orange"]["67"],
    },
  },
  border: {
    neutral: {
      strong: moonlightPalette["neutral"]["62"],
      default: moonlightPalette["neutral"]["38"],
      weak: moonlightPalette["neutral"]["21"],
    },
    inverse: {
      strong: moonlightPalette["neutral"]["62"],
      default: moonlightPalette["neutral"]["77"],
      weak: moonlightPalette["neutral"]["85"],
    },
    brand: { default: moonlightPalette["brand"]["40"], disabled: moonlightPalette["brand"]["54"] },
    positive: {
      default: moonlightPalette["green"]["28"],
      disabled: moonlightPalette["green"]["49"],
    },
    caution: {
      default: moonlightPalette["orange"]["28"],
      disabled: moonlightPalette["orange"]["57"],
    },
    negative: { default: moonlightPalette["red"]["35"], disabled: moonlightPalette["red"]["57"] },
  },
} as const;
