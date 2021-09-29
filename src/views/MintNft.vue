<template>
  <div class="mint-nft">
    <div class="upload-nft">
      <input type="file" id="assetsFieldHandle" @change="uploadDocument" ref="fileInput" accept="image/*">
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
    <div class="serial-number">
      <h3>Serial Number</h3>
      <span class="header">Mint Run</span> <br/>
      <input type="number" min="1" v-model="serialNumber.mint_run"> <br/>
      <span class="header">Serial Number</span> <br/>
      <input type="number" min="1" v-model="serialNumber.serial_number"> <br/>
      <span class="header">Quantity minted this run</span> <br/>
      <input type="number" min="1" v-model="serialNumber.quantity_minted_this_run">
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
    <button @click="$router.push({name: 'TransferAsset'})">Transfer Asset View</button>
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
    mounted() {
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
        async mintNft(imagePath) {
            const tokenId = this.generateUuid();
            const address = getAddress();
            const royalty = this.generateRoyaltyInfo(address);
            
            this.publicMetadata.image = imagePath;
            this.privateMetadata.image = imagePath;
            this.royaltyInfo.royalties.push(royalty); 

            const response = await sodt.mintNft(tokenId, address, this.publicMetadata, this.privateMetadata, this.serialNumber, this.royaltyInfo, this.memo);
            console.log("mintNft", response);

            if (response.isEmpty()) {
                return;
            }
            const parsed = response.parse();
            console.log("parsed", parsed);

            this.clearForm();
        },
        uploadDocument(event) {
            this.files.push(...event.target.files);
        },
        async saveFilesOnPinata() {
            const file = this.files.at(-1);
            const response = await pinFileToIPFS(pinataApiKey, pinataApiSecret, file);
            const { data } = response;
            const imageHash = data.IpfsHash;
            const imagePath = pinataImageUrlBase.concat('/', imageHash);

            if (response.status == 200) {
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


button {
    margin: 8px 8px 0px 0px;
}

</style>