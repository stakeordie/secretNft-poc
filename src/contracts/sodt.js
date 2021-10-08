import {
  createContract,
  snip721Def,
  extendContract,
} from "@stakeordie/griptape.js";

const def = {
  messages: {
    addMinters({ padding }, minters) {
      return {
        handleMsg: {
          add_minters: { minters, padding },
        },
      };
    },
    mintNft(
      { padding },
      token_id = "",
      owner = "",
      public_metadata = {},
      private_metadata = {},
      serial_number = {},
      royalty_info = {},
      memo = ""
    ) {
      return {
        handleMsg: {
          mint_nft: {
            token_id,
            owner,
            public_metadata,
            private_metadata,
            serial_number,
            royalty_info,
            memo,
            padding,
          },
        },
      };
    },
    burnNFT({ padding }, token_id) {
      return {
        handleMsg: {
          burn_nft: { token_id, padding },
        },
      };
    },
    batchMintNft({ padding }, mints = []) {
      return {
        handleMsg: {
          batch_mint_nft: { mints, padding },
        },
      };
    },
    setGlobalApproval({ padding }, requestObject = {}, expires) {
      return {
        handleMsg: {
          set_global_approval: { expires, requestObject, padding },
        },
      };
    },
    makeOwnershipPrivate({ padding }) {
      return {
        handleMsg: {
          make_ownership_private: { padding },
        },
      };
    },
    setMetadata({ padding }, token_id, public_metadata = {}) {
      return {
        handleMsg: {
          set_metadata: { public_metadata, token_id, padding },
        },
      };
    },
  },
  queries: {
    getMinters() {
      return {
        minters: {},
      };
    },
    allTokens() {
      return {
        all_tokens: {},
      };
    },
    contractInfo() {
      return {
        contract_info: {},
      };
    },
    contractConfig() {
      return {
        contract_config: {},
      };
    },
  },
};

const contractAddress = "secret15pk3jjm99prlqtd6sxs568swav5vy6x33zgmuz";

export const sodt = createContract({
  id: contractAddress,
  at: contractAddress,
  definition: extendContract(snip721Def, def),
});
