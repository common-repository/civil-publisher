import { actionTypes } from "./constants";
import { SignatureData } from "./interfaces";
import { AnyAction } from "redux";
import { userMetaKeys } from "../../constants";
import { EthAddress } from "@joincivil/core";

export const isNewsroomEditor = (state: boolean | null = null, action: AnyAction): boolean | null => {
  switch (action.type) {
    case actionTypes.SET_IS_NEWSROOM_EDITOR:
      return !!action.data;
    default:
      return state;
  }
};

export const newsroomName = (state: string | null = null, action: AnyAction): string | null => {
  switch (action.type) {
    case actionTypes.SET_NAME:
      return action.data;
    default:
      return state;
  }
};

export const userData = (state: { [id: number]: any } = {}, action: AnyAction): { [id: number]: any } => {
  switch (action.type) {
    case actionTypes.SET_USER_DATA: {
      const { id, userData: _userData } = action.data;
      const newState = { ...state, [id]: _userData };
      if (id === "me") {
        // also index by actual ID
        newState[_userData.id] = _userData;
      }
      return newState;
    }
    case actionTypes.SET_WP_USER_ADDRESS: {
      const { id, address } = action.data;
      return {
        ...state,
        [id]: {
          ...(state[id] || {}),
          [userMetaKeys.WALLET_ADDRESS]: address,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export const web3ProviderAddress = (state: EthAddress | null = null, action: AnyAction): EthAddress | null => {
  switch (action.type) {
    case actionTypes.SET_WEB3_PROVIDER_ADDRESS:
      return action.data || null;
    default:
      return state;
  }
};

export const currentUserId = (state: number | null = null, action: AnyAction): number | null => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_USER_ID:
      return action.data;
    default:
      return state;
  }
};

export const publishedStatus = (state: any[] = [], action: AnyAction): any => {
  switch (action.type) {
    case actionTypes.UPDATE_PUBLISHED_STATE:
      const publishedRevisionIDs = state.map(revision => revision.revisionID);
      if (publishedRevisionIDs.includes(action.data.revisionID)) {
        return state;
      }
      return state.concat([action.data]);
    default:
      return state;
  }
};

export const currentVersionWasPublished = (state: boolean = false, action: AnyAction): boolean => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_VERSION_WAS_PUBLISHED:
      return action.data;
    default:
      return state;
  }
};

export const lastRevisionId = (state: number | null = null, action: AnyAction): number | null => {
  switch (action.type) {
    case actionTypes.SET_LAST_REVISION_ID:
      if (!action.data) {
        return state;
      }
      // Since in most cases when you save in gutenberg, we do a regular save and a meta box save because of our revisions hack, and after both we hit our endpoint to get last revision ID, and there's a chance those requests come back in the wrong order, so get the max of new and old:
      return Math.max(state!, action.data);
    default:
      return state;
  }
};

export const revisions = (state: any = {}, action: AnyAction): any => {
  switch (action.type) {
    case actionTypes.ADD_OR_UPDATE_REVISION:
      const { revisionID, revisionData } = action.data;
      return { ...state, [revisionID]: revisionData };
    default:
      return state;
  }
};

export const civilContentID = (state: string | null = null, action: AnyAction): string | null => {
  switch (action.type) {
    case actionTypes.SET_CIVIL_CONTENT_ID:
      return action.data.civilContentID || null;
    default:
      return state;
  }
};

export const signatures = (state: SignatureData = {}, action: AnyAction): SignatureData => {
  switch (action.type) {
    case actionTypes.UPDATE_SIGNATURES:
      return { ...state, ...action.data };
    default:
      return state;
  }
};

export const network = (
  state: { isCorrectNetwork: boolean; metaMaskEnabled: boolean } = { isCorrectNetwork: true, metaMaskEnabled: false },
  action: AnyAction,
) => {
  switch (action.type) {
    case actionTypes.CHANGE_NETWORK:
    case actionTypes.SET_METAMASK_ENABLED:
      return { ...state, ...action.data };
    default:
      return state;
  }
};

export const uiControl = (state: { openTabIndex: number } = { openTabIndex: 0 }, action: AnyAction) => {
  switch (action.type) {
    case actionTypes.SET_OPEN_TAB:
      return action.data;
    default:
      return state;
  }
};
