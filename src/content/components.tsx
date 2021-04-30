/* eslint-disable react/prop-types */
import { MindfulProps, ToxicityElementProps } from "../types";
import * as React from "react";
import "./content.css";
import { Popover, Pane, Text } from "evergreen-ui";

export const MindfulComponent: React.FC<MindfulProps> = ({
  emoji,
  hasError,
  toxicityList,
  isLoading,
  isTrancelucent,
}) => {
  return (
    <div
      id="mindful-wrapper"
      style={
        isTrancelucent
          ? {
              opacity: 0.15,
              transition: "opacity .15s ease-in-out",
              filter: "alpha(opacity=15)",
            }
          : { opacity: 1, transition: "opacity .15s ease-in" }
      }
    >
      <Emoji emoji={emoji} />

      {/* Emoji */}
      {isLoading && <Loader />}
      {/* Loader */}
      {hasError && <Pill text="Unavalible" />}
      {toxicityList?.length > 0 && (
        <ToxicityElements toxicityList={toxicityList} />
      )}
    </div>
  );
};

const Emoji: React.FC<{ emoji: string }> = ({ emoji }) => {
  return (
    <Popover
      shouldCloseOnExternalClick={true}
      content={() => (
        <Pane>
          <Text>Hello</Text>
        </Pane>
      )}
    >
      <span className="mindful-span-elements">{emoji}</span>
    </Popover>
  );
};

const ToxicityElements = (props: ToxicityElementProps) => {
  return (
    <>
      {props.toxicityList.map((item, index) => (
        <Pill key={index} text={item} />
      ))}
    </>
  );
};

const Pill: React.FC<{ text: string }> = ({ text }) => {
  return <span className="mindful-red-pill">{text}</span>;
};

const Loader = () => {
  return (
    <div className="mindful-span-elements la-ball-clip-rotate">
      <div></div>
      {/* needs child div to show properly */}
    </div>
  );
};
