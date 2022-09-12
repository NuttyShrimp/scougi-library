declare module "react-pageflip" {
  import { IEventProps, IFlipSetting } from "react-pageflip/build/html-flip-book/settings";

  interface IProps extends Partial<IFlipSetting>, IEventProps {
    className?: string;
    style?: React.CSSProperties;
    renderOnlyPageLengthChange?: boolean;
  }

  export const HTMLFlipBook: React.MemoExoticComponent<
    React.ForwardRefExoticComponent<React.PropsWithChildren<IProps & React.RefAttributes<any>>>
  >;

  export default HTMLFlipBook;
}
