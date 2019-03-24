import React from 'react';
import { Form, Input, Steps, Button, Upload, message, Icon, Row, Col, Select } from 'antd';
import '../css/mainform/mainform.css';
const CryptoJS = require('crypto-js');
const JSZip = require('jszip');
const FileSaver = require('file-saver');
const cryptico = require('cryptico');
// const RSAKey = require('cryptico');

window.alert = () => {};

const { Option, OptGroup } = Select;

class RSAKeyGeneratorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passPhrase: '',
      numBits: 512,
      hasRes: false,
      resBlobToDownload: null,
      current: 0
    }
    this.handleChangePassphrase = this.handleChangePassphrase.bind(this);
    this.handleBitLengthChange = this.handleBitLengthChange.bind(this);
  }

  handleChangePassphrase(e) {
    const newPass = e.target.value;
    this.setState({
      passPhrase: newPass
    });
  }

  handleBitLengthChange(value, op) {
    this.setState({
      numBits: value
    });
  }

  onDownload(){
    FileSaver.saveAs(this.state.resBlobToDownload, 'keysPair');
  }

  next() {
    let { current } = this.state;
    current++;
    this.setState({
      current: current
    });
  }

  reset() {
    //if this.state.current == 3 then...
    //else pop an notification, ask for comfirmation
    if (this.state.current == 3) {
      message.success("고맙습니다");
    }
    else {
    }

    this.setState({
      current: 0,
      numBits: 512,
      passPhrase: '',
      hasRes: false,
      resBlobToDownload: null
    });
  }

  start() {
    const { passPhrase, numBits } = this.state;
    const privateKey = cryptico.generateRSAKey(passPhrase, numBits);
    const publicKey = cryptico.publicKeyString(privateKey);
    const zip = JSZip();
    zip.file("publicKey.txt", publicKey);
    zip.file("privateKey.txt", JSON.stringify(privateKey.toJSON()));
    zip.generateAsync({type:"blob"}).then((content) => {
      this.setState({
        resBlobToDownload: content,
        hasRes: true,
      });
    }).catch((err) =>{
        message.error('Fail to generate key: ' + err);
    });
  }

  steps(cur) {
    if (cur == 0) {
      //Input passphrase
      return (
        <React.Fragment>
          <p>Type your passphrase here and please keep secret it.</p>
          <Input.Password placeholder="Type PassPhrase" value={this.state.passPhrase} onChange={this.handleChangePassphrase}/>
        </React.Fragment>
        
      );
    }
    else if (cur == 1) {
      //get num bits
      return (
        <React.Fragment>
          <p>Please choose RSA key length. The longer the key, the better the security</p>
          <Select defaultValue={this.state.numBits} style={{ width: "40%" }} onChange={this.handleBitLengthChange}>
            <OptGroup label="Medium">
              <Option value="512">512 bits</Option>
              <Option value="1024">1024 bits</Option>
              <Option value="2048">2048 bits</Option>
            </OptGroup>
            <OptGroup label="Large">
              <Option value="4096">4096 bits</Option>
              <Option value="8192">8192 bits</Option>
            </OptGroup>
          </Select>
        </React.Fragment>
        
      );
      //Upload key file
    }
    else if (cur == 2){
      if ( this.state.hasRes && this.state.resBlobToDownload )
        message.success("Successfully Encryption");
      return (
        <div>
          <Button type="dashed" onClick={() => this.start() }>
            <Icon type="rocket" />Generate Keys
          </Button>
          <br />
          <br />
          {(this.state.hasRes && this.state.resBlobToDownload) ? <p>Your keys pair has been generated successfully. Press Next button to get it.</p> : null}
        </div>
      );
    }
    else {
      //download file
      return (
        <React.Fragment>
          <Button type="primary" onClick={() => this.onDownload()}>
            <Icon type="download" /> Download result
          </Button>
          <Icon type="paper-clip" style={{ marginLeft: 8 }}/> <b>keysPair.zip</b>
        </React.Fragment>
        
      );
    }
  }
  
  buttons(cur) {
    if (cur == 0) {
      return (
        <Button type="primary" onClick={() => this.next()} disabled={this.state.passPhrase == ''} >Next</Button>
      )
    }
    else if (cur == 1) {
      return (
        <React.Fragment>
          <Button type="primary" onClick={() => this.next()}>Next</Button>
          <Button style={{ marginLeft: 8 }} onClick={() => this.reset()}>Reset</Button>
        </React.Fragment>
      );
    }
    else if (cur == 2) {
      return (
        <React.Fragment>
          <Button type="primary" onClick={() => this.next()} disabled={!this.state.hasRes || this.state.resBlobToDownload === null}>
            Next
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => this.reset()}>Reset</Button>
        </React.Fragment>
      );
    }
    else {
      return (
        <Button type="primary" onClick={() => this.reset()} >Done</Button>
      )
    }
  }

  render() {
    const { current } = this.state;
    return (
      <Row>
          <Col span={4} offset={2}>
          <Steps current={current} direction="vertical" size="small">
            <Step title="PassPhrase" icon={<Icon type="lock" />}/>
            <Step title="Length" icon={<Icon type="code" />}/>
            <Step title="Process" icon={<Icon type="rocket" />} />
            <Step title="Finish" icon={<Icon type="smile-o" />} />
          </Steps>
          </Col>
          <Col span={16}>
            <div className="steps-content mt-0" style={{ backgroundColor: '#F0FFF0' }}>{this.steps(current)}</div>
            <div className="steps-action">
              {this.buttons(current)}
            </div>
          </Col>
      </Row>
    );
  }
}
class DirectEncryptForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plain: '',
      key: '',
      cipher: ''
    }
  }

  handlePlainChange(event) {
  }

  handleKeyChange(event) {
    
  }

  render() {
    return (
      <Form layout="vertical">
        <Form.Item label="PlainText">
          <Input.TextArea autosize={{minRows: 5, maxRows: 8}} onChange={this.handlePlainChange} value={this.state.plain}/>
        </Form.Item>
        <Form.Item label="Key">
          <Input.TextArea rows={2} onChange={this.handleKeyChange} value={this.state.key}/>
        </Form.Item>
        <Form.Item label="CipherText">
          <Input.TextArea autosize={{minRows: 7, maxRows: 10}} value={this.state.cipher}/>
        </Form.Item>
      </Form>
    );
  }
}

class DirectDecryptForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cipher: '',
      key: '',
      plain: ''
    }
  }

  handleCipherChange(event) {

  }

  handleKeyChange(event) {

  }

  render() {
    return (
      <Form layout="vertical">
        <Form.Item label="CipherText">
          <Input.TextArea autosize={{minRows: 5, maxRows: 8}} onChange={this.handleCipherChange} value={this.state.cipher}/>
        </Form.Item>
        <Form.Item label="Key">
          <Input.TextArea rows={2} onChange={this.handleKeyChange} value={this.state.key}/>
        </Form.Item>
        <Form.Item label="PlainText">
          <Input.TextArea autosize={{minRows: 7, maxRows: 10}} value={this.state.plain}/>
        </Form.Item>
      </Form>
    );
  }
}

class DESDirectEncryptForm extends DirectEncryptForm {
  constructor(props) {
    super(props);
    this.handlePlainChange = this.handlePlainChange.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
  }

  handlePlainChange(event) {
    const plain = event.target.value;
    if (plain === ''){
      this.setState({
        plain: '',
        cipher: ''
      })
    }
    else {
      const res = CryptoJS.DES.encrypt(plain, this.state.key);
      this.setState({
          plain: plain,
          cipher: res
      });
    }
  }

  handleKeyChange(event) {
    const key = event.target.value;
    const res = CryptoJS.DES.encrypt(this.state.plain, key)
    this.setState({
        key: key,
        cipher: res
    })
  }
}

class AESDirectEncryptForm extends DirectEncryptForm {
  constructor(props) {
    super(props);
    this.handlePlainChange = this.handlePlainChange.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
  }

  handlePlainChange(event) {
    const plain = event.target.value;
    if (plain === ''){
      this.setState({
        plain: '',
        cipher: ''
      })
    }
    else {
      const res = CryptoJS.AES.encrypt(plain, this.state.key)
      this.setState({
          plain: plain,
          cipher: res
      });
    }
  }

  handleKeyChange(event) {
    const key = event.target.value;
    const res = CryptoJS.AES.encrypt(this.state.plain, key)
    this.setState({
        key: key,
        cipher: res
    })
  }
}

class DESDirectDecryptForm extends DirectDecryptForm {
  constructor(props) {
    super(props);
    this.handleCipherChange = this.handleCipherChange.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
  }

  handleCipherChange(event) {
    const cipher = event.target.value;
    if (cipher === ''){
      this.setState({
        cipher: '',
        plain: ''
      })
    }
    else {
      const res = CryptoJS.DES.decrypt(cipher, this.state.key).toString(CryptoJS.enc.Utf8);
      this.setState({
          cipher: cipher,
          plain: res
      });
    }
  }

  handleKeyChange(event) {
    const key = event.target.value;
    const res = CryptoJS.DES.decrypt(this.state.cipher, key).toString(CryptoJS.enc.Utf8);
    this.setState({
        key: key,
        plain: res
    })
  }
}

class AESDirectDecryptForm extends DirectDecryptForm {
  constructor(props) {
    super(props);
    this.handleCipherChange = this.handleCipherChange.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
  }

  handleCipherChange(event) {
    const cipher = event.target.value;
    if (cipher === ''){
      this.setState({
        cipher: '',
        plain: ''
      })
    }
    else {
      const res = CryptoJS.AES.decrypt(cipher, this.state.key).toString(CryptoJS.enc.Utf8);
      this.setState({
          cipher: cipher,
          plain: res
      });
    }
  }

  handleKeyChange(event) {
    const key = event.target.value;
    const res = CryptoJS.AES.decrypt(this.state.cipher, key).toString(CryptoJS.enc.Utf8);
    this.setState({
        key: key,
        plain: res
    })
  }
}

class RSADirectEncryptForm extends DirectEncryptForm {
  constructor(props) {
    super(props);
    this.handlePlainChange = this.handlePlainChange.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);

  }

  handlePlainChange(event) {
    const plain = event.target.value;
    if (plain === ''){
      this.setState({
        plain: '',
        cipher: ''
      })
    }
    else {
      let res = null;
      try {
        res = cryptico.encrypt(plain, this.state.key);
      }
      catch(e) {
        message.error("Error encryption, " + e);
      }
      this.setState({
          plain: plain,
          cipher: res.cipher
      });
    }
  }

  handleKeyChange(event) {
    const key = event.target.value;
    const res = cryptico.encrypt(this.state.plain, key);
    this.setState({
        key: key,
        cipher: res.cipher
    })
  }
}

class RSADirectDecryptForm extends DirectDecryptForm {
  constructor(props) {
    super(props);
    this.handleCipherChange = this.handleCipherChange.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
  }

  handleCipherChange(event) {
    const cipher = event.target.value;
    if (cipher === ''){
      this.setState({
        cipher: '',
        plain: ''
      })
    }
    else {
      let res = null;

      try {
        res = cryptico.decrypt(cipher, cryptico.RSAKey.parse(this.state.key));
      }
      catch(err) {
        message.error("Improper private key, " + err);
      }

      this.setState({
          cipher: cipher,
          plain: (res == null) ? '' : res.plaintext
      });
    }
  }

  handleKeyChange(event) {
    const key = event.target.value;
    let res = null;
    try {
      res = cryptico.decrypt(this.state.cipher, cryptico.RSAKey.parse(key));
    }
    catch(err) {
      message.error("Improper private key, " + err);
    }
    this.setState({
        key: key,
        plain:(res == null) ? '' : res.plaintext
    })
  }
}

const getMD5 = (mess) => {
  return CryptoJS.MD5(mess).toString();
}

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

const Step = Steps.Step;

class FileCryptoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentFileToProcess: '',
      curFile: null,
      flag: 0,
      contentKeyFile: '',
      curKeyFile: null,
      hasRes: false,
      resBlobToDownload: null,
      current: 0
    }
  }

  onDownload(){
    FileSaver.saveAs(this.state.resBlobToDownload, 'result');
  }

  next() {
    let current = this.state.current;
    if (current == 0) {
      
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        this.setState({
          contentFileToProcess: fileReader.result,
          hasRes: false
        })
      }
      fileReader.readAsDataURL(this.state.curFile);

    }
    else if (current == 1) {

      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        this.setState({
          contentKeyFile: fileReader.result,
          hasRes: false
        })
      }
      fileReader.readAsText(this.state.curKeyFile);
    }

    current++;
    this.setState({
      current: current
    });
  }

  reset() {
    //if this.state.current == 3 then...
    //else pop an notification, ask for comfirmation
    if (this.state.current == 3) {
      message.success("고맙습니다");
    }
    else {
    }

    this.setState({
      contentFileToProcess: '',
      curFile: null,
      flag: -1,
      contentKeyFile: '',
      curKeyFile: null,
      hasRes: false,
      resBlobToDownload: null,
      current: 0
    });
  }

  start() {
    
  }

  steps(cur) {
    if (cur == 0) {
      //Upload file
      const fileProps = {
        name: 'mainfile',
        beforeUpload: (file) => {
          this.setState({
            curFile: file
          });
          return false;
        },
        onRemove: (file) => {
          this.setState({
            curFile: null
          })
        },
        disabled: (this.state.curFile !== null)
      };
      
      if (this.state.flag == -1) {
        fileProps.fileList = [];
        this.setState({
          flag: 0
        });
      }

      return (
        <div>
          <p>{ this.uploadFileSlogan }</p>
          <Upload {...fileProps}>
            <Button>
              <Icon type="upload" /> Upload your file
            </Button>
          </Upload>
        </div>        
      );
    }
    else if (cur == 1) {
      const keyProps = {
        name: 'keyfile',
        beforeUpload: (file) => {
          this.setState({
            curKeyFile: file,
          });
          return false;
        },
        onRemove: (file) => {
          this.setState({
            curKeyFile: null
          })
        },
        disabled: (this.state.curKeyFile !== null),
      };

      if (this.state.flag == 0)
      {  
        keyProps.fileList = [];
        this.setState({
          flag: -1
        });
      }

      return (
        <div>
          <p>Upload your key file here.</p>
          <Upload {...keyProps}>
            <Button>
              <Icon type="upload" /> Upload your key
            </Button>
          </Upload>
        </div>
      );
      //Upload key file
    }
    else if (cur == 2){
      if ( this.state.hasRes && this.state.resBlobToDownload )
        message.success("Successfully Encryption");
      return (
        <div>
          <Button type="dashed" size="large" onClick={() => this.start() }>
            <Icon type="rocket" />Start to Process
          </Button>
          <br />
          <br />
          {(this.state.hasRes && this.state.resBlobToDownload) ? <p>{this.finishSlogan}</p> : null}
        </div>
      );
    }
    else {
      //download file
      return (
        <React.Fragment>
          <Button type="primary" size="large" onClick={() => this.onDownload()}>
            <Icon type="download" /> Download result
          </Button>
          <Icon type="paper-clip" style={{ marginLeft: 8 }}/> <b>{this.endFile}</b>
        </React.Fragment>
        
      );
    }
  }
  
  buttons(cur) {
    if (cur == 0) {
      return (
        <Button type="primary" onClick={() => this.next()} disabled={this.state.curFile === null}>Next</Button>
      )
    }
    else if (cur == 1) {
      return (
        <React.Fragment>
          <Button type="primary" onClick={() => this.next()} disabled={this.state.curKeyFile === null}>Next</Button>
          <Button style={{ marginLeft: 8 }} onClick={() => this.reset()}>Reset</Button>
        </React.Fragment>
      );
    }
    else if (cur == 2) {
      return (
        <React.Fragment>
          <Button type="primary" onClick={() => this.next()} disabled={!this.state.hasRes || this.state.resBlobToDownload === null}>
            Next
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => this.reset()}>Reset</Button>
        </React.Fragment>
      );
    }
    else {
      return (
        <Button type="primary" onClick={() => this.reset()} >Done</Button>
      )
    }
  }

  render() {
    const { current } = this.state;
    return (
      <div>
        <Form>
          <Steps current={current} direction="horizontal">
            {this.titles.map(title => <Step key={title} title={title} />)}
          </Steps>
          <div className="steps-content">{this.steps(current)}</div>
          <div className="steps-action">
            {this.buttons(current)}
          </div>
        </Form>
      </div>
    );
  }
}

class FileEncryptForm extends FileCryptoForm {
  constructor(props) {
    super(props);
    this.titles = ['Upload file', 'Upload key file', 'Start Encrypting', 'Finish'];
    this.uploadFileSlogan = 'Upload your file for encryption. If you want to encrypt a folder, please zip it and upload to here.';
    this.endFile = 'result.zip';
    this.finishSlogan = 'Your result.zip has been created successfully, please press Next button to download it.';
  }

  sEncrypt() {}

  start() {
    const zip = JSZip();
    let cipherText;
    cipherText = this.sEncrypt();
    const md5OriginFile  = getMD5(this.state.contentFileToProcess);
    zip.file("md5.txt", md5OriginFile);
    zip.file("cipher.txt", cipherText)
    zip.generateAsync({type:"blob"}).then((content) => {
      this.setState({
        resBlobToDownload: content,
        hasRes: true,
      });
    }).catch((err) =>{
        message.error('Fail to process: ' + err);
    });
  }
}
class DESFileEncryptForm extends FileEncryptForm {
  
  sEncrypt() {
    const b64 = CryptoJS.DES.encrypt(this.state.contentFileToProcess, this.state.contentKeyFile).toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    return e64.toString(CryptoJS.enc.Hex);
  }
}

class AESFileEncryptForm extends FileEncryptForm {
  sEncrypt() {
    const b64 = CryptoJS.AES.encrypt(this.state.contentFileToProcess, this.state.contentKeyFile).toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    return e64.toString(CryptoJS.enc.Hex);
  }
}

class RSAFileEncryptForm extends FileEncryptForm {
  sEncrypt() {
    return cryptico.encrypt(this.state.contentFileToProcess, this.state.contentKeyFile).cipher;
  }
}

class FileDecryptForm extends FileCryptoForm {
  constructor(props) {
    super(props);
    this.titles = ['Upload zip file', 'Upload key file', 'Start Decrypting', 'Finish'];
    this.uploadFileSlogan = 'Upload your zip file for dcryption. That zip must contains two files as cipher and md5 hash.';
    this.finishSlogan = 'Your result file has been created successfully, please press Next button to download it.';
    this.endFile = 'result.xyz';
  }

  sDecrypt(cipher) {}

  start() {
    const zip = JSZip();
    let bs64 = this.state.contentFileToProcess.split(',')[1];
    zip.loadAsync(atob(bs64)).then((zip) => {
        // read file md5.txt to get md5 hash value of origin file 
        zip.file("md5.txt").async("string").then((md5) => {
          // read file cipher.txt to get ciphertext 
          zip.file("cipher.txt").async("string").then((cipherText) => {
            const plain = this.sDecrypt(cipherText); 
            //decrypt 
            if (plain !== null) {
              if (md5 === getMD5(plain)) {
                message.success('Correct MD5 hash value');
              }
              this.setState({
                resBlobToDownload: dataUrlToBlob(plain),
                hasRes: true,
              })
            }
          })
        })
    }).catch((err) => {
      message.error("Fail to processing " + err);
    })
  }
}

class DESFileDecryptForm extends FileDecryptForm {
  sDecrypt(cipher) {
    const reb64 = CryptoJS.enc.Hex.parse(cipher);
    const bytes = reb64.toString(CryptoJS.enc.Base64);
    const decrypt = CryptoJS.DES.decrypt(bytes, this.state.contentKeyFile);
    return (decrypt !== null) ? decrypt.toString(CryptoJS.enc.Utf8) : null;
  }
}

class AESFileDecryptForm extends FileDecryptForm {
  sDecrypt(cipher) {
    const reb64 = CryptoJS.enc.Hex.parse(cipher);
    const bytes = reb64.toString(CryptoJS.enc.Base64);
    const decrypt = CryptoJS.AES.decrypt(bytes, this.state.contentKeyFile);
    return (decrypt !== null) ? decrypt.toString(CryptoJS.enc.Utf8) : null;
  }
}

class RSAFileDecryptForm extends FileDecryptForm {
  sDecrypt(cipher) {
    const keyObj = cryptico.RSAKey.parse(this.state.contentKeyFile);
    const decrypt = cryptico.decrypt(cipher, keyObj);
    return (decrypt != null) ? decrypt.plaintext : null;
  }
}

export { DESDirectEncryptForm, AESDirectEncryptForm, DESDirectDecryptForm, AESDirectDecryptForm, 
          DESFileEncryptForm, AESFileEncryptForm, DESFileDecryptForm, AESFileDecryptForm,
          RSADirectDecryptForm, RSADirectEncryptForm, RSAFileEncryptForm, RSAFileDecryptForm, RSAKeyGeneratorForm };