import * as React from "react";
const { withSelect } = window.wp.data;
import { SelectType } from "../../../typings/gutenberg";
import { ErrorText, ErrorHeading, Heading, MainHeading, BodySection } from "../styles";
import { RevisionLinks } from "./RevisionLinks";

export interface PostStatusProps {
  requirePublish?: boolean;
  actionString?: string;
  lastPublishedRevision?: any;
  lastArchivedRevision?: any;
  saved: boolean;
  published: boolean;
  updated: boolean;
  url: string;
  isSavingPost: boolean;
  pluginDataMissing: boolean;
  contentId?: number;
}

const NoMarginHeading = MainHeading.extend`
  margin-bottom: 0;
`;

class PostStatusComponent extends React.Component<PostStatusProps> {
  public render(): JSX.Element {
    let content;
    let heading = <Heading>WordPress Post Status</Heading>;

    if (this.props.saved && this.props.pluginDataMissing) {
      heading = <ErrorHeading>WordPress Post Status</ErrorHeading>;
      content = (
        <ErrorText>
          This post was {this.props.published ? "published" : "last saved"} before the Civil plugin was activated, and
          so isn't fully processed. Please{" "}
          {this.props.published ? 're-publish by hitting the "Update" button' : "save again"} before continuing.
        </ErrorText>
      );
    } else if (this.props.published) {
      if (this.props.requirePublish) {
        content = <p>Your post is published to your site and is ready to be published on the Civil network.</p>;
      } else {
        content = <p>Post published.</p>;
      }
    } else {
      if (this.props.requirePublish) {
        heading = <ErrorHeading>WordPress Post Status</ErrorHeading>;
        content = (
          <ErrorText>
            Waiting for this post to be published on your WordPress site before you can publish to the Civil network.
          </ErrorText>
        );
      } else if (this.props.saved) {
        content = <p>Post saved.</p>;
      }
    }

    if (!this.props.saved && !(this.props.requirePublish && !this.props.published)) {
      content = (
        <>
          {content}
          <ErrorText>
            {this.props.isSavingPost ? (
              "Saving post..."
            ) : (
              <>
                Please save {this.props.published && "updates to"} this post before{" "}
                {this.props.actionString || "continuing"}.
              </>
            )}
          </ErrorText>
        </>
      );
    }

    if (this.props.contentId && this.props.lastPublishedRevision) {
      heading = <NoMarginHeading>Civil publish status</NoMarginHeading>;
      content = (
        <RevisionLinks
          lastArchivedRevision={this.props.lastArchivedRevision}
          lastPublishedRevision={this.props.lastPublishedRevision}
        />
      );
    }

    return (
      <BodySection>
        {heading}
        {content}
      </BodySection>
    );
  }
}

export const PostStatus = withSelect(
  (selectStore: SelectType, ownProps: Partial<PostStatusProps>): Partial<PostStatusProps> => {
    const {
      getEditedPostAttribute,
      isEditedPostDirty,
      isCleanNewPost,
      isCurrentPostPublished,
      isSavingPost,
      hasAutosave,
    } = selectStore("core/editor");
    const { isSavingMetaBoxes } = selectStore("core/edit-post");
    const { isPluginDataMissing } = selectStore("civil/blockchain");

    const pluginDataMissing = isPluginDataMissing();
    const onlyAutosaved = pluginDataMissing && hasAutosave();
    const savingPost = isSavingPost() || isSavingMetaBoxes();
    const saved = !isEditedPostDirty() && !isCleanNewPost() && !onlyAutosaved && !savingPost;

    return {
      requirePublish: ownProps.requirePublish,
      saved,
      published: isCurrentPostPublished(),
      url: getEditedPostAttribute("link"),
      isSavingPost: savingPost,
      pluginDataMissing,
    };
  },
)(PostStatusComponent);
