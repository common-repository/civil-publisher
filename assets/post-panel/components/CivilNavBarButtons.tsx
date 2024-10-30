import * as React from "react";
import { ArticleIndexIcon, ArticleSignIcon, CivilLogo, ToolTip } from "@joincivil/components";
import { TxHash } from "@joincivil/core";
import { CircleIndicator, indicatorColors } from "./CircleIndicator";
import { colors } from "../styles";
import styled from "styled-components";

const Wrapper = styled.div`
  border-radius: 4px;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const CivilButton = styled.span`
  padding: 7px 13px;
  margin: 0;
  top: 1px;
  svg {
    height: 12px;
    width: auto;
  }
`;

const IconSection = styled.span`
  display: flex;
  align-items: center;
  background-color: "transparent";
  border-radius: 0 4px 4px 0;
  cursor: pointer;
`;

const PanelButtonSign = styled<{ open: boolean }, "span">("span")`
  display: flex;
  align-items: center;
  background-color: ${props => (props.open ? colors.navIcon.BG_ACTIVE : colors.navIcon.BG)};
  border-radius: 4px 0px 0px 4px;
  padding: 5px 10px;
`;

const PanelButtonPublish = styled(PanelButtonSign)`
  border-radius: 0px 4px 4px 0px;
  margin-left: 1px;
`;

export interface CivilNavBarButtonsProps {
  isOpen?: boolean;
  txHash?: TxHash;
  lastpublishedRevision?: any;
  currentIsVersionPublished?: boolean;
  isSignaturePresent?: boolean;
  isSignatureValid?: boolean;
  openTab: number;
  setOpenTab(index: number): void;
  openCivilSidebar(): void;
}

export class CivilNavBarButtons extends React.Component<CivilNavBarButtonsProps> {
  public render(): JSX.Element {
    return (
      <Wrapper>
        <CivilButton>
          <CivilLogo />
        </CivilButton>
        <IconSection>
          <ToolTip
            explainerText="Sign"
            positionBottom={true}
            verticalOffset={10}
            width={50}
            onClick={ev => this.onClickIcon(ev, 0)}
          >
            <PanelButtonSign open={this.props.isOpen! && this.props.openTab === 0}>
              <ArticleSignIcon
                color={
                  this.props.isOpen! && this.props.openTab === 0 ? colors.navIcon.COLOR_ACTIVE : colors.navIcon.COLOR
                }
              />
              <CircleIndicator
                border={!this.props.isOpen! || this.props.openTab !== 0}
                indicatorColor={this.signIndicatorColor()}
              />
            </PanelButtonSign>
          </ToolTip>
          <ToolTip
            explainerText="Publish"
            positionBottom={true}
            verticalOffset={10}
            width={50}
            onClick={ev => this.onClickIcon(ev, 1)}
          >
            <PanelButtonPublish open={this.props.isOpen! && this.props.openTab === 1}>
              <ArticleIndexIcon
                color={
                  this.props.isOpen! && this.props.openTab === 1 ? colors.navIcon.COLOR_ACTIVE : colors.navIcon.COLOR
                }
              />
              <CircleIndicator
                border={!this.props.isOpen! || this.props.openTab !== 1}
                indicatorColor={this.indexIndicatorColor()}
              />
            </PanelButtonPublish>
          </ToolTip>
        </IconSection>
      </Wrapper>
    );
  }

  private indexIndicatorColor = (): indicatorColors => {
    if (this.props.txHash && this.props.txHash.length) {
      return indicatorColors.YELLOW;
    } else if (this.props.lastpublishedRevision && !this.props.currentIsVersionPublished) {
      return indicatorColors.RED;
    } else if (this.props.currentIsVersionPublished) {
      return indicatorColors.GREEN;
    }
    return indicatorColors.WHITE;
  };

  private signIndicatorColor = (): indicatorColors => {
    if (!this.props.isSignaturePresent) {
      return indicatorColors.WHITE;
    }
    if (this.props.isSignatureValid) {
      return indicatorColors.GREEN;
    }
    return indicatorColors.RED;
  };

  private onClickIcon = (ev: any, index: number) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!this.props.isOpen) {
      this.props.openCivilSidebar();
    }
    this.props.setOpenTab(index);
  };
}
