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
      stroke="#FFC9ED"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </View>
);
