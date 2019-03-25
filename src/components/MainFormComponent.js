import React from 'react';
import { Form, Input, Steps, Button, Upload, message, Icon, Row, Col, Select, Popconfirm, Progress } from 'antd';
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
    //if this.state.current === 3 then...
    //else pop an notification, ask for comfirmation
    if (this.state.current === 3) {
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
    if (cur === 0) {
      //Input passphrase
      return (
        <React.Fragment>
          <p>Type your passphrase here and please keep secret it.</p>
          <Input.Password placeholder="Type PassPhrase" value={this.state.passPhrase} onChange={this.handleChangePassphrase}/>
        </React.Fragment>
        
      );
    }
    else if (cur === 1) {
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
    else if (cur === 2){
      if ( this.state.hasRes && this.state.resBlobToDownload )
        message.success("Successfully Encryption");
      return (
        <div>
          {(this.state.hasRes && this.state.resBlobToDownload) ? 
            <p>
              Your keys pair has been created successfully, please press Next button to download it.&nbsp;
              <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
            </p> :
            <Button type="dashed" size="large" onClick={() => this.start() }>
              <Icon type="rocket" />Start to Generate
            </Button>
          }
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
    if (cur === 0) {
      return (
        <Button type="primary" onClick={() => this.next()} disabled={this.state.passPhrase === ''} >Next</Button>
      )
    }
    else if (cur === 1) {
      return (
        <React.Fragment>
          <Button type="primary" onClick={() => this.next()}>Next</Button>
          <Button style={{ marginLeft: 8 }} onClick={() => this.reset()}>Reset</Button>
        </React.Fragment>
      );
    }
    else if (cur === 2) {
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
    const b64 = CryptoJS.DES.encrypt(plain, this.state.key).toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    const res  = e64.toString(CryptoJS.enc.Hex);
    this.setState({
        plain: plain,
        cipher: res
    });
  }

  handleKeyChange(event) {
    const key = event.target.value;
    const b64 = CryptoJS.DES.encrypt(this.state.plain, key).toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    const res  = e64.toString(CryptoJS.enc.Hex);
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
    const b64 = CryptoJS.AES.encrypt(plain, this.state.key).toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    const res  = e64.toString(CryptoJS.enc.Hex);
    this.setState({
        plain: plain,
        cipher: res
    });
  }

  handleKeyChange(event) {
    const key = event.target.value;
    const b64 = CryptoJS.AES.encrypt(this.state.plain, key).toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    const res  = e64.toString(CryptoJS.enc.Hex);
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
    const reb64 = CryptoJS.enc.Hex.parse(cipher);
    const bytes = reb64.toString(CryptoJS.enc.Base64);
    const decrypt = CryptoJS.DES.decrypt(bytes, this.state.key);
    const res = (decrypt !== null) ? decrypt.toString(CryptoJS.enc.Utf8) : 'Not valid';
    this.setState({
        cipher: cipher,
        plain: res
    });
  }

  handleKeyChange(event) {
    const key = event.target.value;
    const reb64 = CryptoJS.enc.Hex.parse(this.state.cipher);
    const bytes = reb64.toString(CryptoJS.enc.Base64);
    const decrypt = CryptoJS.DES.decrypt(bytes, key);
    const res = (decrypt !== null) ? decrypt.toString(CryptoJS.enc.Utf8) : 'Not valid';
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
    const reb64 = CryptoJS.enc.Hex.parse(cipher);
    const bytes = reb64.toString(CryptoJS.enc.Base64);
    const decrypt = CryptoJS.AES.decrypt(bytes, this.state.key);
    const res = (decrypt !== null) ? decrypt.toString(CryptoJS.enc.Utf8) : 'Not valid';
    this.setState({
        cipher: cipher,
        plain: res
    });
  }

  handleKeyChange(event) {
    const key = event.target.value;
    const reb64 = CryptoJS.enc.Hex.parse(this.state.cipher);
    const bytes = reb64.toString(CryptoJS.enc.Base64);
    const decrypt = CryptoJS.AES.decrypt(bytes, key);
    const res = (decrypt !== null) ? decrypt.toString(CryptoJS.enc.Utf8) : 'Not valid';
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
          plain: (res === null) ? '' : res.plaintext
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
        plain:(res === null) ? '' : res.plaintext
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

const getExtentionOfFile = (fileName) => {
  let lst = fileName.split('.');
  let ext = lst[lst.length - 1];
  let name = '';
  for (let i = 0; i < lst.length - 1; i++){
    name += lst[i];
  }
  return [ext, name];
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
      popUp: true,
      progress: 0,
      isProcessing: false,
      isFolder: false,
      current: 0
    };
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.handleUploadFolder = this.handleUploadFolder.bind(this);
  }

  onDownload(){
    FileSaver.saveAs(this.state.resBlobToDownload, 'result');
  }

  handleUploadFolder() {
    if ( this.state.curFile !== null)
      message.warning("You can only upload one file or folder");
    else {
      this.setState({
        popUp: false,
        isFolder: true
      });
      document.getElementById("upload-file").click();
      this.setState({
        popUp: true
      });
    }
  }

  handleUploadFile() {
    if ( this.state.curFile !== null)
      message.warning("You can only upload one file or folder");
    else {
      this.setState({
        popUp: false,
        isFolder: false
      });
      document.getElementById("upload-file").click();
      this.setState({
        popUp: true
      });
    }
  }

  next() {
    let current = this.state.current;
    if (current === 0) {
      
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        this.setState({
          contentFileToProcess: fileReader.result,
          hasRes: false
        })
      }
      fileReader.readAsDataURL(this.state.curFile);

    }
    else if (current === 1) {

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
    //if this.state.current === 3 then...
    //else pop an notification, ask for comfirmation
    if (this.state.current === 3) {
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
      current: 0,
      popUp: true,
      progress: 0,
      isProcessing: false,
      isFolder: false
    });
  }

  start() {
    
  }

  steps(cur) {
    
  }
  
  buttons(cur) {
    if (cur === 0) {
      return (
        <Button type="primary" onClick={() => this.next()} disabled={this.state.curFile === null}>Next</Button>
      )
    }
    else if (cur === 1) {
      return (
        <React.Fragment>
          <Button type="primary" onClick={() => this.next()} disabled={this.state.curKeyFile === null}>Next</Button>
          <Button style={{ marginLeft: 8 }} onClick={() => this.reset()}>Reset</Button>
        </React.Fragment>
      );
    }
    else if (cur === 2) {
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

  progressBar() {
    if (true) {
      return <Progress percent={this.state.progress} strokeWidth={15} />;
    }
    return null;
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
  }

  steps(cur) {
    if (cur === 0) {
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
        disabled: this.state.popUp
      };
      
      if (this.state.flag === -1) {
        fileProps.fileList = [];
        this.setState({
          flag: 0
        });
      }

      return (
        <div>
          <p>Upload your file for encryption. If you want to encrypt a folder, please zip it and upload to here.</p>
          <Upload id="upload-file" {...fileProps}>
            <Popconfirm 
              title="File or Folder?" 
              icon={<Icon type="question-circle-o" />} 
              okText="folder" cancelText="file"
              onConfirm={this.handleUploadFolder} onCancel={this.handleUploadFile}
              >
              <Button>
                <Icon type="upload" /> Upload your file
              </Button>
            </Popconfirm>
            
          </Upload>
        </div>        
      );
    }
    else if (cur === 1) {
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

      if (this.state.flag === 0)
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
    else if (cur === 2){
      if ( this.state.hasRes && this.state.resBlobToDownload && !this.state.isProcessing)
        message.success("Successfully Encryption");
      return (
        <div>
          <Button type="dashed" size="large" onClick={() => this.start() }>
            <Icon type="rocket" />Start to Encrypt
          </Button>
          <br />
          <br />
          {(this.state.hasRes && this.state.resBlobToDownload) ? 
            <p>
               Your result.zip has been created successfully, please press Next button to download it.&nbsp; 
              <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
              </p> :
            <Button type="dashed" size="large" onClick={() => this.start() }>
              <Icon type="rocket" />Start to Encrypt
            </Button>
          }
          <br />
          <br />
          {this.progressBar()}
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
          <Icon type="paper-clip" style={{ marginLeft: 8 }}/> <b>result.zip</b>
        </React.Fragment>
        
      );
    }
  }

  sEncrypt() {}

  start() {
    this.setState({
      isProcessing: true,
      progress: 0
    });
    const zip = JSZip();
    if ( !this.state.isFolder) {
      let cipherText;
      cipherText = this.sEncrypt();
      this.setState({
        progress: 30
      });
      const md5OriginFile  = getMD5(this.state.contentFileToProcess);
      this.setState({
        progress: 50
      });
      zip.file("md5.txt", md5OriginFile);
      zip.file("cipher.txt", cipherText);
      this.setState({
        progress: 80
      });
      zip.generateAsync({type:"blob"}).then((content) => {
        this.setState({
          resBlobToDownload: content,
          hasRes: true,
          progress: 100
        });
        this.setState({
          isProcessing: false,
        });
      }).catch((err) =>{
          message.error('Fail to process: ' + err);
      });
    }
    else {
      let bs64 = this.state.contentFileToProcess.split(',')[1];
      zip.loadAsync(atob(bs64)).then((zip) => {
        this.setState({
          progress: 10
        });
        let resZip = JSZip();
        let lstFile = [];
        let lstFileName = [];
        zip.folder().forEach((relativePath, file) => {    
          if(!file.dir){
            lstFile.push(zip.file(file.name).async('base64'));
            lstFileName.push(file.name);
          }
        });
        this.setState({
          progress: 30
        })
        Promise.all(lstFile).then((res) => {
          const num = lstFile.length;
          const dis = Math.round((55 / num) * 100) / 100;
          for (let i = 0; i < num; i++) {
            const fullNameFile = getExtentionOfFile(lstFileName[i]);
            const fileName = fullNameFile[1]; 
            const tailFile = fullNameFile[0];
            resZip.file(fileName + '.txt', this.sEncrypt(res[i] + ' ' + tailFile) + ' ' + getMD5(res[i]));
            this.setState({
              progress: this.state.progress + dis
            });
          }

          resZip.generateAsync({type:"blob"}).then((content) => {
            this.setState({
              resBlobToDownload: content,
              hasRes: true,
              progress: 100,
            });
            this.setState({
              isProcessing: false
            });
          })
        }).catch((err) => {
          message.error('Fail to process: ' + err);
        });
      })
    }
  }
}

class DESFileEncryptForm extends FileEncryptForm {
  
  sEncrypt() {
    let plain = this.state.contentFileToProcess;
    if (arguments.length > 0)
      plain = arguments[0];
    const b64 = CryptoJS.DES.encrypt(plain, this.state.contentKeyFile).toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    return e64.toString(CryptoJS.enc.Hex);
  }
}

class AESFileEncryptForm extends FileEncryptForm {
  sEncrypt() {
    let plain = this.state.contentFileToProcess;
    if (arguments.length > 0)
      plain = arguments[0];
    const b64 = CryptoJS.AES.encrypt(plain, this.state.contentKeyFile).toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    return e64.toString(CryptoJS.enc.Hex);
  }
}

class RSAFileEncryptForm extends FileEncryptForm {
  sEncrypt() {
    let plain = this.state.contentFileToProcess;
    if (arguments.length > 0)
      plain = arguments[0];
    return cryptico.encrypt(plain, this.state.contentKeyFile).cipher;
  }
}

class FileDecryptForm extends FileCryptoForm {
  constructor(props) {
    super(props);
    this.titles = ['Upload zip file', 'Upload key file', 'Start Decrypting', 'Finish'];
  }

  steps(cur) {
    if (cur === 0) {
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
        disabled: this.state.popUp
      };
      
      if (this.state.flag === -1) {
        fileProps.fileList = [];
        this.setState({
          flag: 0
        });
      }

      return (
        <div>
          <p>Upload your zip file for decryption. That zip must contains two files as cipher and md5 hash.</p>
          <Upload id="upload-file" {...fileProps}>
            <Popconfirm 
              title="File or Folder?" 
              icon={<Icon type="question-circle-o" />} 
              okText="folder" cancelText="file"
              onConfirm={this.handleUploadFolder} onCancel={this.handleUploadFile}
              >
              <Button>
                <Icon type="upload" /> Upload your file
              </Button>
            </Popconfirm>
            
          </Upload>
        </div>        
      );
    }
    else if (cur === 1) {
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

      if (this.state.flag === 0)
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
    else if (cur === 2){
      if ( this.state.hasRes && this.state.resBlobToDownload && !this.state.isProcessing)
        message.success("Successfully Decryption");
      return (
        <div>
          <Button type="dashed" size="large" onClick={() => this.start() }>
            <Icon type="rocket" />Start to Decrypt
          </Button>
          <br />
          <br />
          {(this.state.hasRes && this.state.resBlobToDownload) ? 
            <p>
              Your result file has been created successfully, please press Next button to download it.&nbsp;
              <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
              </p> :
            <Button type="dashed" size="large" onClick={() => this.start() }>
              <Icon type="rocket" />Start to Decrypt
            </Button>
          }
          <br />
          <br />
          {this.progressBar()}
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
          <Icon type="paper-clip" style={{ marginLeft: 8 }}/> <b>result.xyz</b>
        </React.Fragment>
        
      );
    }
  }
  
  sDecrypt(cipher) {}

  start() {
    this.setState({
      progress: 0,
      isProcessing: true
    })
    const zip = JSZip();
    if (!this.state.isFolder) {
      let bs64 = this.state.contentFileToProcess.split(',')[1];
      zip.loadAsync(atob(bs64)).then((zip) => {
          // read file md5.txt to get md5 hash value of origin file 
          zip.file("md5.txt").async("string").then((md5) => {
            // read file cipher.txt to get ciphertext 
            zip.file("cipher.txt").async("string").then((cipherText) => {
              this.setState({
                progress: 20
              });
              const plain = this.sDecrypt(cipherText); 
              //decrypt 
              this.setState({
                progress: 70
              });
              if (plain !== null) {
                if (md5 === getMD5(plain)) {
                  message.success('Correct MD5 hash value');
                  this.setState({
                    progress: 80
                  });
                }
                this.setState({
                  resBlobToDownload: dataUrlToBlob(plain),
                  hasRes: true,
                  progress: 100
                })
              }
            });
            this.setState({
              isProcessing: false
            });
          })
      }).catch((err) => {
        message.error("Fail to processing " + err);
      });
    }
    else {
      let bs64 = this.state.contentFileToProcess.split(',')[1];
      zip.loadAsync(atob(bs64)).then((zip) => {
        this.setState({
          progress: 10
        });
        let resZip = JSZip();
        let lstFile = [];
        let lstFileName = [];
        zip.folder().forEach((relativePath, file) => {    
          if(!file.dir){
            lstFile.push(zip.file(file.name).async('string'));
            lstFileName.push(file.name);
          }
        });
        this.setState({
          progress: 20
        });
        Promise.all(lstFile)
        .then((res) => {
          const num = lstFile.length;
          const dis = Math.round((65 / num) * 100) / 100;
          for (let i = 0; i < num; i++){    
            const fullNameFile = getExtentionOfFile(lstFileName[i]);
            const fileName = fullNameFile[1]; 
            const tailFile = fullNameFile[0]; 
            res[i] = res[i].split(' ');
            const cipher = res[i][0];
            const md5 = res[i][1];
            const plain = this.sDecrypt(cipher);
            let ext = plain.split(' ')[1];
            let file = plain.split(' ')[0];
            if (getMD5(file) === md5 ){
              resZip.file(fileName + '.' + ext, file ,{base64: true});
              message.success('Check MD5 hash value of file ' + fileName + '.' + tailFile + 'CORRECT');
            }
            else {
              message.error('Check MD5 hash value of file ' + fileName + '.' + tailFile + 'FAILED');
            }
            this.setState({
              progress: this.state.progress + dis
            });
          }
          resZip.generateAsync({type:"blob"}).then((content) => {
            this.setState({
              resBlobToDownload: content,
              hasRes: true,
              progress: 100
            });
            this.setState({
              isProcessing: false
            });
          })
        }).catch((err) => {
            message.error("Fail to processing " + err);
        });
      });  
    }
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