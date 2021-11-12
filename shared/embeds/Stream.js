// @flow
import * as React from "react";
import Frame from "./components/Frame";

const URL_REGEX = /(?:https?:\/\/)?(?:www\.)?web\.microsoftstream\.com\/(?:embed\/)?video\/([a-z0-9-]{36})(?:\?.*)?$/i;

type Props = {|
  isSelected: boolean,
  attrs: {|
    href: string,
    matches: string[],
  |},
|};

export default class Stream extends React.Component<Props> {
  static ENABLED = [URL_REGEX];

  render() {
    const { matches } = this.props.attrs;
    const videoId = matches[1];

    return (
      <Frame
        {...this.props}
	src={`https://web.microsoftstream.com/embed/video/${videoId}?autoplay=false&showinfo=true`}
        title={`Microsoft Stream (${videoId})`}
      />
    );
  }
}
