import React from 'react';
import { Form, FormGroup, Label, Input, Button} from 'reactstrap';
const CryptoJS = require('crypto-js');
const JSZip = require('jszip');
const FileSaver = require('file-saver')

class MainForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            plain: '',
            cipher: '',
            key: '',
            isNeedKey: true,
            contentFileToEncrypt: '',
            contentKeyFile: '',
            hasRes: false,
            cipherType: 'des',
            isEncrypt: true,
        }
        this.onPlainTextChange = this.onPlainTextChange.bind(this)  
        this.onKeyChange = this.onKeyChange.bind(this)  
        this.onBtnSubmitClick = this.onBtnSubmitClick.bind(this)  
        this.handleMessFileChosen = this.handleMessFileChosen.bind(this) 
        this.handleKeyFileChosen = this.handleKeyFileChosen.bind(this)
        this.onCipherTypeChange = this.onCipherTypeChange.bind(this)
        this.onChangeIsEncrypt = this.onChangeIsEncrypt.bind(this)
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
        if (this.state.contentKeyFile === '' || this.state.contentFileToEncrypt === ''){
          alert("Please chose both key file and input file to process !!!")
        }
        else {
          const zip = JSZip();
          if (this.state.isEncrypt){
            // encryption
            let cipherText = '';
            if (this.state.cipherType === 'aes'){
              cipherText = CryptoJS.AES.encrypt(this.state.contentFileToEncrypt, this.state.contentKeyFile).toString()
            } 
            else if (this.state.cipherType === 'des'){
              cipherText = CryptoJS.DES.encrypt(this.state.contentFileToEncrypt, this.state.contentKeyFile).toString()
            }
            else if (this.state.cipherType === 'rsa'){
              // cipherText = CryptoJS.algo.
            }
            zip.file("md5.txt", CryptoJS.MD5(this.state.contentFileToEncrypt).toString())
            zip.file("cipher.txt", cipherText)
            zip.generateAsync({type:"blob"})
            .then((content) => {
              FileSaver.saveAs(content, "example.zip");
              this.setState({
                hasRes: true
              });
            })
            .catch((err) =>{
              alert(err)
            });    
          }
          else {
            // decryption
            let md5 = '';
            let cipherText = ''
            zip.loadAsync(this.state.contentFileToEncrypt)
            .then((zip) => {
                zip.file("md5.txt").async("string")
                .then((res) => {
                  md5 = res;
                  alert(md5)
                  zip.file("cipher.txt").async("string")
                  .then((cipher) => {
                    cipherText = cipher;
                    let plain = CryptoJS.DES.decrypt(cipherText, this.state.contentKeyFile).toString();
                    alert(CryptoJS.MD5(plain).toString());
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
          contentFileToEncrypt: fileReader.result
        })
      }
      fileReader.readAsBinaryString(file)
    };

    handleKeyFileChosen(e){
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        this.setState({
          contentKeyFile: fileReader.result
        })
      }
      fileReader.readAsText(file)
    };

    renderDownloadResultButton(){
      if (this.state.hasRes){
        return(
          <Button  style={{marginLeft: 20}} onClick = {this.onBtnSubmitClick}>Download result file</Button>
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