import React, { useMemo } from "react";
import { Box } from "@twilio-paste/core";
import {
  MenuButton,
  Menu,
  MenuItem,
  MenuSeparator,
  useMenuState,
} from "@twilio-paste/menu";
import {
  MediaObject,
  MediaFigure,
  MediaBody,
} from "@twilio-paste/media-object";
import { FileVideoIcon } from "@twilio-paste/icons/esm/FileVideoIcon";
import { MoreIcon } from "@twilio-paste/icons/esm/MoreIcon";
import { UserIcon } from "@twilio-paste/icons/esm/UserIcon";
import { ArrowBackIcon } from "@twilio-paste/icons/esm/ArrowBackIcon";
import { Text } from "@twilio-paste/text";
import { NotificationLevel } from "@twilio/conversations";

import { NotificationsType } from "../../store/reducers/notificationsReducer";
import { NOTIFICATION_LEVEL } from "../../constants";
import Bell from "../icons/Bell";
import BellMuted from "../icons/BellMuted";
import styles from "../../styles";
import { ReduxConversation } from "../../store/reducers/convoReducer";
import { getSdkConversationObject } from "../../conversations-objects";
import { AppState } from "../../store";
import { getTranslation } from "./../../utils/localUtils";
import { useSelector } from "react-redux";

interface SettingsMenuProps {
  leaveConvo: () => void;
  conversation: ReduxConversation;
  onParticipantListOpen: () => void;
  addNotifications: (messages: NotificationsType) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = (
  props: SettingsMenuProps
) => {
  const menu = useMenuState();
  const { notificationLevel } = props.conversation;
  const local = useSelector((state: AppState) => state.local);
  const manageParticipants = getTranslation(local, "manageParticipants");
  const leaveConvo = getTranslation(local, "leaveConvo");
  const muteConvo = getTranslation(local, "muteConvo");
  const unmuteConvo = getTranslation(local, "unmuteConvo");
  const muted = notificationLevel === NOTIFICATION_LEVEL.MUTED;
  const sdkConvo = useMemo(
    () => getSdkConversationObject(props.conversation),
    [props.conversation.sid]
  );

  const toggleMuteConversation = () => {
    sdkConvo.setUserNotificationLevel(
      muted
        ? (NOTIFICATION_LEVEL.DEFAULT as NotificationLevel)
        : (NOTIFICATION_LEVEL.MUTED as NotificationLevel)
    );
  };

  const getConversationPayload = async () => {
    const convoId = props.conversation.sid;
    try {
      const response = await fetch(
        `https://convert.foundifyai.com/retrieve/conversation:${convoId}`
      );
      const body = await response.json();

      return body?.record;
    } catch (e: any) {
      console.log("demo error", e);
      return undefined;
    }
  };

  const requestDemoVideo = async (payload: any) => {
    const raw = JSON.stringify({
      companyName: payload.companyName,
      reviews: payload.reviews,
    });

    const requestOptions: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://hooks.zapier.com/hooks/catch/10351426/217yfy0/",
        requestOptions
      );
      const body = await response.json();
      if (body?.status === "success") {
        alert("Demo Submitted");
        return true;
      } else {
        alert("Something Went Wrong");
        return false;
      }
    } catch (e) {
      console.log("demo error", e);
      return false;
    }
  };

  return (
    <Box style={styles.settingsWrapper}>
      <MenuButton {...menu} variant="link" size="reset">
        <MoreIcon decorative={false} title="Settings" />
      </MenuButton>
      <Menu {...menu} aria-label="Preferences">
        <MenuItem {...menu}>
          <MediaObject verticalAlign="center" onClick={toggleMuteConversation}>
            <MediaFigure spacing="space20">
              {muted ? <Bell /> : <BellMuted />}
            </MediaFigure>
            <MediaBody>{muted ? unmuteConvo : muteConvo}</MediaBody>
          </MediaObject>
        </MenuItem>
        <MenuItem {...menu} onClick={props.onParticipantListOpen}>
          <MediaObject verticalAlign="center">
            <MediaFigure spacing="space20">
              <UserIcon
                decorative={false}
                title="information"
                color="colorTextIcon"
              />
            </MediaFigure>
            <MediaBody>{manageParticipants}</MediaBody>
          </MediaObject>
        </MenuItem>
        <MenuItem
          {...menu}
          onClick={async () => {
            const record = await getConversationPayload();
            if (!record || !record.companyName || !record.reviews) {
              alert("No Record Found");
            } else {
              const result = await requestDemoVideo(record);
            }
          }}
        >
          <MediaObject verticalAlign="center">
            <MediaFigure spacing="space20">
              <FileVideoIcon
                decorative={false}
                title="demo"
                color="colorTextIcon"
              />
            </MediaFigure>
            <MediaBody>{"Send Demo Video"}</MediaBody>
          </MediaObject>
        </MenuItem>
        <MenuSeparator {...menu} />
        <MenuItem {...menu} onClick={props.leaveConvo}>
          <MediaObject verticalAlign="center">
            <MediaFigure spacing="space20">
              <ArrowBackIcon
                decorative={false}
                title="information"
                color="colorTextError"
              />
            </MediaFigure>
            <MediaBody>
              <Text
                as="a"
                color="colorTextError"
                _hover={{ color: "colorTextError", cursor: "pointer" }}
              >
                {leaveConvo}
              </Text>
            </MediaBody>
          </MediaObject>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SettingsMenu;
