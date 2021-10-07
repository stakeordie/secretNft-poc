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
    mintNft({ padding }, token_id = "", owner = "", public_metadata  = {}, private_metadata  = {}, serial_number = {}, royalty_info  = {}, memo = "") {
      return {
        handleMsg: {
          mint_nft: { token_id, owner, public_metadata, private_metadata, serial_number, royalty_info, memo, padding },
        },
      };
    },
    burnNFT({ padding }, token_id) {
      return {
        handleMsg: {
          burn_nft: {token_id, padding},
        },
      };
    },
    batchMintNft({ padding }, mints = []) {
      return {
        handleMsg: {
          batch_mint_nft: { mints, padding }
        },
      };
    },
    setGlobalApproval({padding}, requestObject = {}, expires) {
      return {
        handleMsg: {
          set_global_approval: {expires, requestObject, padding}
        },
      };
    },
    makeOwnershipPrivate({padding}) {
      return {
        handleMsg: {
          make_ownership_private: {padding}
        },
      };
    },
    setMetadata({padding}, token_id, public_metadata  = {}) {
      return {
        handleMsg: {
          set_metadata: {public_metadata, token_id, padding}
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
export const sodt = createContract({
  id: "sodt",
  at: "secret13jtj93gecfx26d6sgzxcseff44s3ka4z7syyn2",
  definition: extendContract(snip721Def, def),
});
