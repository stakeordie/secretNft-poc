<template>
  <div class="mint-nft">
    <div class="upload-nft">
      <input type="file" id="assetsFieldHandle" @change="uploadDocument" ref="fileInput" accept="image/*">
    </div>
    <div class="quantity">
      <span class="header">Quantity</span> <br/>
      <input type="number" v-model="quantity"> <br/>  
    </div>
    <div class="public-metadata">
      <h3>Public Metadata</h3>
      <span class="header">Name</span> <br/>
      <input type="text" v-model="publicMetadata.name"> <br/>
      <span class="header">Description</span> <br/>
      <input type="text" v-model="publicMetadata.description">
    </div>
    <div class="private-metadata">
      <h3>Private Metadata</h3>
      <span class="header">Name</span> <br/>
      <input type="text" v-model="privateMetadata.name"> <br/>
      <span class="header">Description</span> <br/>
      <input type="text" v-model="privateMetadata.description">
    </div>
    <div class="royalty-info">
      <h3>Royalty Info</h3>
      <span class="header">Decimal places in rates</span> <br/>
      <input type="number" min="1" v-model="royaltyInfo.decimal_places_in_rates"> <br/>
      <span class="header">Rate</span> <br/>
      <input type="number" min="0" v-model="rate">
    </div>
    <div>
      <h3>Memo</h3>
      <span>Memo</span> <br/>
      <input type="text" v-model="memo">
    </div>
    <button @click="saveFilesOnPinata()" :disabled="isFilesEmpty">Save Files</button>
  </div>
</template>

<script>
import { sodt } from "../contracts/sodt.js";
import { pinFileToIPFS } from "../services/pinataApi.js"
import { getAddress, onAccountAvailable } from "@stakeordie/griptape.js";

const pinataApiKey = 'fd6daaa9a29774dcf5bd';
const pinataApiSecret = 'c03398c484f3b133f8f59c1ce1f368164f878233d1d666128e4502f625a76bbe';
const pinataImageUrlBase = 'https://gateway.pinata.cloud/ipfs/';

export default {
    name: "MintNft",
    data() {
        return {
            publicMetadata: {
                name: '',
                description: '',
                image: '',
            },
            privateMetadata: {
                name: '',
                description: '',
            },
            serialNumber: {
                mint_run: 1,
                serial_number: 1,
                quantity_minted_this_run: 1,
            },
            royaltyInfo: {
                decimal_places_in_rates: 1,
                royalties: [],
            },
            rate: 0,
            quantity: null,
            memo: "",
            files: [],
        }
    },
    computed: {
        isFilesEmpty() {
            console.log
            return (this.files.length === 0 || !this.publicMetadata.name || !this.publicMetadata.description ||
                !this.privateMetadata.name || !this.privateMetadata.description);
        }
    },
    async mounted() {
        onAccountAvailable(async () => {});
    },
    methods: {
        generateRoyaltyInfo(address) {
            return {
                recipient: address,
                rate: this.rate,
            };
        },
        generateUuid() {   
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        generateMintList(address) {
            const mints = [];
            for(let i = 0; i < this.quantity; i++) {
                let mint = {
                    token_id: this.generateUuid(),
                    owner: address,
                    public_metadata: this.publicMetadata,
                    private_metadata: this.privateMetadata,
                    memo: this.memo
                }
                mints.push(mint);
            }
            return mints;
        },
        async mintNft(imagePath) {
            const tokenId = this.generateUuid();
            const address = getAddress();
            const royalty = this.generateRoyaltyInfo(address);

            this.publicMetadata.image = imagePath;
            this.privateMetadata.image = imagePath;
            this.royaltyInfo.royalties.push(royalty); 

            if(this.quantity && typeof Number(this.quantity) === 'number' && this.quantity > 1) {

                const mints = this.generateMintList(address);
                const response = await sodt.batchMintNft(mints);

                if (response.isEmpty()) {
                    return;
                }
                const parsed = response.parse();
                console.log("mintNftClones", parsed);   

            } else {
                const response = await sodt.mintNft(tokenId, address, this.publicMetadata, this.privateMetadata, this.serialNumber, this.royaltyInfo, this.memo);

                if (response.isEmpty()) {
                    return;
                }
                const parsed = response.parse();
                console.log("mintNft", parsed);   
            }

            this.clearForm();
        },
        uploadDocument(event) {
            this.files.push(...event.target.files);
        },
        async saveFilesOnPinata() {
            const file = this.files.at(-1);
            const response = await pinFileToIPFS(pinataApiKey, pinataApiSecret, file);

            if (response.status == 200) {
                const { data } = response;
                const imageHash = data.IpfsHash;
                const imagePath = pinataImageUrlBase.concat('/', imageHash);
                this.mintNft(imagePath);
            }
        },
        clearForm() {
            this.publicMetadata = {
                name: '',
                description: '',
                image: '',
            };
            this.privateMetadata = {
                name: '',
                description: '',
            };
            this.serialNumber = {
                mint_run: 1,
                serial_number: 1,
                quantity_minted_this_run: 1,
            };
            this.royaltyInfo = {
                decimal_places_in_rates: 1,
                royalties: [],
            },
            this.rate = 0;
            this.memo = "";
            this.files = [];
            this.quantity = null;
            document.getElementById('assetsFieldHandle').value = null;
        }
    }
}
</script>

<style>

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield; 
}

input[type=file] {
  margin: 8px 0px; 
}


button {
    margin: 8px 8px 0px 0px;
}

div.mint-nft {
    padding-top: 32px;
}

</style>