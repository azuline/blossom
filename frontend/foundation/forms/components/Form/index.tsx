import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  onSubmit: (() => void) | (() => Promise<void>);
};

export const Form: FC<Props> = props => {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        void props.onSubmit();
      }}
    >
      {props.children}
    </form>
  );
};
