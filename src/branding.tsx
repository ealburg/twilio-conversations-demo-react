import { LogoTwilioIcon } from "@twilio-paste/icons/esm/LogoTwilioIcon";
import React from "react";
import { IconSize, TextColor } from "@twilio-paste/style-props";

export const LOGO_TITLE = "Clicki Leads";
export const LOGO_SUB_TITLE = "Sms Conversations";
export const APP_TITLE = "Clicki Leads";

interface LogoTwilioIconProps {
  decorative?: boolean;
  color?: TextColor | undefined;
  size?: IconSize | undefined;
  title?: string;
}

export const AppLogo: React.FC<LogoTwilioIconProps> = ({
  decorative = false,
  color = "colorTextBrandHighlight",
  size = "sizeIcon40",
  title = "app logo",
}) => (
  <LogoTwilioIcon
    decorative={decorative}
    color={color}
    size={size}
    title={title}
  />
);
