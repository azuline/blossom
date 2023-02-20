import { SX } from "@foundation/style/sprinkles.css";
import { View } from "@foundation/ui/View";

type Props = {
  size: SX["w"];
};

export const IconLogo: React.FC<Props> = props => (
  <View
    style={{ display: "inline-block", lineHeight: 0 }}
    sx={{ w: props.size, h: props.size }}
  >
    <svg
      fill="none"
      height="100%"
      stroke="#5B4BC7"
      viewBox="0 0 20 20"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.354 13.354C16.7172 14.0122 14.9231 14.1748 13.1946 13.8217C11.4662 13.4686 9.87962 12.6153 8.63217 11.3678C7.38472 10.1204 6.53139 8.53381 6.17827 6.80535C5.82514 5.0769 5.98779 3.28277 6.64599 1.646C4.7077 2.42673 3.10135 3.85739 2.10232 5.69272C1.10328 7.52805 0.773783 9.65374 1.17031 11.7054C1.56683 13.757 2.66467 15.6069 4.27565 16.9378C5.88662 18.2687 7.91037 18.9977 9.99999 19C11.7969 19.0001 13.5527 18.4624 15.0415 17.4562C16.5303 16.45 17.684 15.0213 18.354 13.354Z"
        fill="#5B4BC7"
        stroke="#5B4BC7"
      />
    </svg>
  </View>
);
