import React from 'react';
import { Form, FormGroup, Label, Input, Button} from 'reactstrap';
const CryptoJS = require('crypto-js');
const JSZip = require('jszip');
const FileSaver = require('file-saver')


/*  SOME HELPER FUNCTION */
const dataUrlToBlob = (dataURI) => {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var arrayBuffer = new ArrayBuffer(byteString.length);
  var _ia = new Uint8Array(arrayBuffer);
  for (var i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
  }
  var dataView = new DataView(arrayBuffer);
  var blob = new Blob([dataView], { type: mimeString });
  return blob;
}

const sEncrypt = (mess, key, cipherType) => {
  let b64 = null;
  if (cipherType === 'des'){
    b64 = CryptoJS.DES.encrypt(mess, key).toString();
  }
  else if (cipherType === 'aes'){
    b64 = CryptoJS.AES.encrypt(mess, key).toString();
  }
  else if (cipherType === 'rsa') {
    // TO BE CONTINUE 
  }
  let e64 = CryptoJS.enc.Base64.parse(b64);
  let eHex = e64.toString(CryptoJS.enc.Hex);
  return eHex;
}

const getMD5 = (mess) => {
  return CryptoJS.MD5(mess).toString();
}

const sDecrypt = (cipher, key, cipherType) => {
  let reb64 = CryptoJS.enc.Hex.parse(cipher);
  let bytes = reb64.toString(CryptoJS.enc.Base64);
  let decrypt = null;
  if (cipherType === 'des'){
    decrypt = CryptoJS.DES.decrypt(bytes, key);
  }
  else if (cipherType === 'aes'){
    decrypt = CryptoJS.AES.decrypt(bytes, key);
  }
  else if (cipherType === 'rsa') {
    // TO BE CONTINUE 
  }
  let plain = null;
  if (decrypt !== null)
    plain = decrypt.toString(CryptoJS.enc.Utf8);
  return plain;
}

class MainForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            plain: '',
            cipher: '',
            key: '',
            isNeedKey: true,
            contentFileToProcess: '',
            nameFileIsProcessing: '',
            contentKeyFile: '',
            hasRes: false,
            cipherType: 'des',
            isEncrypt: true,
            resBlobToDownload: null,
        }
        this.onPlainTextChange = this.onPlainTextChange.bind(this);  
        this.onKeyChange = this.onKeyChange.bind(this);  
        this.onBtnSubmitClick = this.onBtnSubmitClick.bind(this);  
        this.handleMessFileChosen = this.handleMessFileChosen.bind(this); 
        this.handleKeyFileChosen = this.handleKeyFileChosen.bind(this);
        this.onCipherTypeChange = this.onCipherTypeChange.bind(this);
        this.onChangeIsEncrypt = this.onChangeIsEncrypt.bind(this);
        this.onDownloadBtnClick = this.onDownloadBtnClick.bind(this);
    }

    onDownloadBtnClick(){
      // download
      FileSaver.saveAs(this.state.resBlobToDownload, 'result');
    }

    onChangeIsEncrypt(e){
      if (e.target.value === 'enc'){
        this.setState({
          isEncrypt: true
        })
      }
      else {
        this.setState({
          isEncrypt: false
        })
      }
    }

    onCipherTypeChange(e){
      this.setState({
        cipherType: e.target.value
      })
    }

    onPlainTextChange(event){
        const plain = event.target.value;
        if (plain === ''){
          this.setState({
            plain: '',
            cipher: ''
          })
        }
        else {
          const res = CryptoJS.DES.encrypt(plain, this.state.key)
          this.setState({
              plain: plain,
              cipher: res
          });
        }
    }

    onKeyChange(event){
      const key = event.target.value;
      if (key === ''){
        this.setState({
          key: '',
          cipher: ''
        })
      }
      else {
        const res = CryptoJS.DES.encrypt(this.state.plain, key)
        this.setState({
            key: key,
            cipher: res
        })
      }
    }

    onBtnSubmitClick(){
        if (this.state.contentKeyFile === '' || this.state.contentFileToProcess === ''){
          alert("Please chose both key file and input file to process !!!")
        }
        else {
          const zip = JSZip();
          if (this.state.isEncrypt){
            // Encryption phase 
            let cipherText;

            if (this.state.cipherType === 'aes'){
              cipherText = sEncrypt(this.state.contentFileToProcess, this.state.contentKeyFile, 'aes');
            } 

            else if (this.state.cipherType === 'des'){
              cipherText = sEncrypt(this.state.contentFileToProcess, this.state.contentKeyFile, 'des');
            }

            else if (this.state.cipherType === 'rsa'){
              // TO BE CONTINUE 
            }

            /* Form file to download 
               Result file is zip file, after unzipping, we have two text files:
               * cipher.txt: ciphertext of file (hex)
               * md5.txt: md5 hash of origin file, using to check the integrity  */
            const md5OriginFile  = getMD5(this.state.contentFileToProcess);
            zip.file("md5.txt", md5OriginFile);
            zip.file("cipher.txt", cipherText)
            zip.generateAsync({type:"blob"})
            .then((content) => {
              this.setState({
                resBlobToDownload: content,
                hasRes: true,
              });
            })
            .catch((err) =>{
                alert(err)
            });    
          }

          else {
            // Decryption phase 
            // get base64 from dataURl 
            let bs64 = this.state.contentFileToProcess.split(',')[1];
            zip.loadAsync(atob(bs64))
            .then((zip) => {
                // read file md5.txt to get md5 hash value of origin file 
                zip.file("md5.txt").async("string")
                .then((md5) => {

                  // read file cipher.txt to get ciphertext 
                  zip.file("cipher.txt").async("string")
                  .then((cipherText) => {
                    let plain = null; 
                    //decrypt 
                    if (this.state.cipherType  === 'des'){
                      plain = sDecrypt(cipherText, this.state.contentKeyFile, 'des');
                    }
                    else if (this.state.cipherType  === 'aes'){
                      plain = sDecrypt(cipherText, this.state.contentKeyFile, 'aes');
                    }
                    else if (this.state.cipherType === 'rsa'){
                      // TO BE CONTINUE 
                    }
                    if (plain !== null){
                      if (md5 === getMD5(plain)) {
                        alert('Check MD5 hash value is succesfull!');
                      }
                      this.setState({
                        resBlobToDownload: dataUrlToBlob(plain),
                        hasRes: true,
                      })
                    }
                  })
                })
            })
            .catch((err) => {
              alert(err);
            })
          }
        }
    }

    handleMessFileChosen(e){
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        this.setState({
          contentFileToProcess: fileReader.result,
          hasRes: false
        })
      }
      fileReader.readAsDataURL(file)
    };

    handleKeyFileChosen(e){
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        this.setState({
          contentKeyFile: fileReader.result,
          hasRes: false
        })
      }
      fileReader.readAsText(file)
    };

    renderDownloadResultButton(){
      if (this.state.hasRes){
        return(
          <Button  style={{marginLeft: 20}} onClick = {this.onDownloadBtnClick}>Download result file</Button>
        )
      }
    }

    render() {
        return (
        <Form style ={{marginLeft: 20, marginTop: 20}}>
            <FormGroup>
            <Label for="exampleText">Input</Label>
            <Input type="textarea" name="text" value = {this.state.plain} onChange = {this.onPlainTextChange}/>
            <Label for="exampleText">Key</Label>
            <Input type="textarea" name="text" value = {this.state.key} onChange = {this.onKeyChange}/>
            <Label for="exampleText">Result</Label>
            <Input type="textarea" name="text" value = {this.state.cipher} />
            </FormGroup>
            <FormGroup>
            <Label for="exampleFile">Input</Label>
            <Input type="file" 
                   name="fileMess" 
                   onChange={this.handleMessFileChosen}/>
            <Label for="exampleFile">Key</Label>
            <Input type="file" 
                   name="fileKey" 
                   accept='.txt' 
                   onChange={this.handleKeyFileChosen} />
            </FormGroup>
            <FormGroup check>
            <Label check>
              <Input type="radio" name="isEn" value='enc' checked={this.state.isEncrypt}
                     onChange = {this.onChangeIsEncrypt}/>
              {' '}
              Encrypt
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="radio" name="isEn" value='dec' checked={!this.state.isEncrypt}
                     onChange = {this.onChangeIsEncrypt}/>
              {' '}
              Decrypt
            </Label>
          </FormGroup>
          <Button onClick = {this.onBtnSubmitClick}> Submit </Button>
          {this.renderDownloadResultButton()}
          <FormGroup tag="fieldset">
          <legend>SYMMETRIC CIPHER</legend>
          <FormGroup check>
            <Label check>
              <Input type="radio" value='des' 
                    name="typeCipher" 
                    checked={this.state.cipherType === 'des'}
                    onChange={this.onCipherTypeChange}/>
                {' '} DES
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
            <Input type="radio" value='aes' 
                    name="typeCipher" 
                    checked={this.state.cipherType === 'aes'}
                    onChange={this.onCipherTypeChange}/>
              {' '}  AES
            </Label>
          </FormGroup>
        </FormGroup>
        <legend>ASYMMETRIC CIPHER</legend>
          <FormGroup check>
            <Label check>
            <Input type="radio" value='rsa' 
                    name="typeCipher" 
                    checked={this.state.cipherType === 'rsa'}
                    onChange={this.onCipherTypeChange}/>
              {' '} RSA 
            </Label>
          </FormGroup>
        </Form>
        );
    }
}

export default MainForm;