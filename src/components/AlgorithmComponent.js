import React, { Component } from 'react';
import '../css/algo/algo.css';
import { Tabs, Radio, Switch, Button } from 'antd';
import { DESDirectEncryptForm, AESDirectEncryptForm, DESDirectDecryptForm, AESDirectDecryptForm,
        DESFileEncryptForm, AESFileEncryptForm, AESFileDecryptForm, DESFileDecryptForm,
        RSADirectDecryptForm, RSADirectEncryptForm, RSAFileDecryptForm, RSAFileEncryptForm, RSAKeyGeneratorForm } from './MainFormComponent';
const TabPane = Tabs.TabPane;

function RenderOptions({ onChange, mode }) {
    return (
        <Radio.Group onChange={onChange} value={mode} style={{ marginBottom: 8 }}>
            <Radio.Button value="top">Top</Radio.Button>
            <Radio.Button value="bottom">Bottom</Radio.Button>
            <Radio.Button value="left">Left</Radio.Button>
            <Radio.Button value="right">Right</Radio.Button>
        </Radio.Group>
    );
}
class SuperNodeAlgorithm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            directDecrypt: false,
            fileDecrypt: false,
            mode: 'top',
            type: '',
            ref: '',
        };
    }

    handleModeChange = (e) => {
        const mode = e.target.value;
        this.setState({ mode });
    }

    handleDirectSwitchChange = (checked, event) => {
        this.setState({
            directDecrypt: checked
        });
    }

    handleFileSwitchChange = (checked, event) => {
        this.setState({
            fileDecrypt: checked
        });
    }

    directCryptoTab() {}

    fileCryptoTab() {}

    render() {
        
        return (
            <div></div>
        );
    }

}

class SymmetricAlgorithm extends SuperNodeAlgorithm {

    render() {
        const { mode } = this.state;
        const directTab = this.directCryptoTab();
        const fileTab = this.fileCryptoTab();
        const tabPaneStyles = (mode != 'top') ? {marginTop: 20} : null;
        const extraStyles = (mode === 'left' || mode === 'right') ? {lineHeight: '200px'} : null;
        const extra =<div style={extraStyles}><Button><a href={this.state.ref}>{this.state.type} Reference</a></Button></div>
        return (
            <div className="container algo-container">
                <div className="col-12">
                    <RenderOptions onChange={this.handleModeChange} mode={mode}/>
                    <Tabs
                        defaultActiveKey="1"
                        tabPosition={mode}
                        tabBarExtraContent={extra}
                    >
                        <TabPane tab="Direct Cryptography" key="1" style={tabPaneStyles}>
                            <span>Decryption: &nbsp;&nbsp;</span> { this.state.directDecrypt ? 
                                <Switch checkedChildren="DEC" unCheckedChildren="ENC" defaultChecked onChange={this.handleDirectSwitchChange}/> :
                                <Switch checkedChildren="DEC" unCheckedChildren="ENC" onChange={this.handleDirectSwitchChange}/>}
                            <div className="tab-content">
                                {directTab}
                            </div>
                        </TabPane>
                        <TabPane tab="File Cryptography" key="2" style={tabPaneStyles}>
                            <span>Decryption: &nbsp;&nbsp;</span> { this.state.fileDecrypt ? 
                                <Switch checkedChildren="DEC" unCheckedChildren="ENC" defaultChecked onChange={this.handleFileSwitchChange}/> :
                                <Switch checkedChildren="DEC" unCheckedChildren="ENC" onChange={this.handleFileSwitchChange}/>}
                            <div className="tab-content">
                                {fileTab}
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

class AssymmetricAlgorithm extends SuperNodeAlgorithm {
    keyGenerateTab() {}

    render() {
        const { mode } = this.state;
        const directTab = this.directCryptoTab();
        const fileTab = this.fileCryptoTab();
        const keyGenerateTab = this.keyGenerateTab();
        const tabPaneStyles = (mode != 'top') ? {marginTop: 20} : null;
        const extraStyles = (mode === 'left' || mode === 'right') ? {lineHeight: '200px'} : null;
        const extra =<div style={extraStyles}><Button><a href={this.state.ref}>{this.state.type} Reference</a></Button></div>
        return (
            <div className="container algo-container">
                <div className="col-12">
                    <RenderOptions onChange={this.handleModeChange} mode={mode}/>
                    <Tabs
                        defaultActiveKey="1"
                        tabPosition={mode}
                        tabBarExtraContent={extra}
                    >
                        <TabPane tab="Direct Cryptography" key="1" style={tabPaneStyles}>
                            <span>Decryption: &nbsp;&nbsp;</span> { this.state.directDecrypt ? 
                                <Switch checkedChildren="DEC" unCheckedChildren="ENC" defaultChecked onChange={this.handleDirectSwitchChange}/> :
                                <Switch checkedChildren="DEC" unCheckedChildren="ENC" onChange={this.handleDirectSwitchChange}/>}
                            <div className="tab-content">
                                {directTab}
                            </div>
                        </TabPane>
                        <TabPane tab="File Cryptography" key="2" style={tabPaneStyles}>
                            <span>Decryption: &nbsp;&nbsp;</span> { this.state.fileDecrypt ? 
                                <Switch checkedChildren="DEC" unCheckedChildren="ENC" defaultChecked onChange={this.handleFileSwitchChange}/> :
                                <Switch checkedChildren="DEC" unCheckedChildren="ENC" onChange={this.handleFileSwitchChange}/>}
                            <div className="tab-content">
                                {fileTab}
                            </div>
                        </TabPane>
                        <TabPane tab="Key Generation" key="3" style={tabPaneStyles}>
                            <div className="tab-content">
                                {keyGenerateTab}
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

class DESAlgorithm extends SymmetricAlgorithm {

    constructor(props) {
        super(props);   
    }

    componentDidMount() {
        this.setState({
            type: 'DES',
            ref: 'https://en.wikipedia.org/wiki/Data_Encryption_Standard'
        });
    }

    directCryptoTab() {
        if ( !this.state.directDecrypt )
            return (
                <DESDirectEncryptForm />
            );
        else
            return (
                <DESDirectDecryptForm />
            );
    }

    fileCryptoTab() {
        if ( !this.state.fileDecrypt ) {
            return (
                <DESFileEncryptForm />
            );
        }
        else {
            return (
                <DESFileDecryptForm />
            );
        }
    }
}

class AESAlgorithm extends SymmetricAlgorithm {
    constructor(props) {
        super(props);
        
    }

    componentDidMount() {
        this.setState({
            type: 'AES',
            ref: 'https://en.wikipedia.org/wiki/Advanced_Encryption_Standard'
        });
    }

    directCryptoTab() {
        if ( !this.state.directDecrypt )
            return (
                <AESDirectEncryptForm />
            );
        else
            return (
                <AESDirectDecryptForm />
            );
    }

    fileCryptoTab() {
        if ( !this.state.fileDecrypt ) {
            return (
                <AESFileEncryptForm />
            );
        }
        else {
            return (
                <AESFileDecryptForm />
            ); 
        }
    }
}

class RSAAlgorithm extends AssymmetricAlgorithm {
    constructor(props) {
        super(props);
        
    }

    componentDidMount() {
        this.setState({
            type: 'RSA',
            ref: 'https://en.wikipedia.org/wiki/Advanced_Encryption_Standard'
        });
    }

    directCryptoTab() {
        if ( !this.state.directDecrypt )
            return (
                <RSADirectEncryptForm />
            );
        else
            return (
                <RSADirectDecryptForm />
            );
    }

    fileCryptoTab() {
        if ( !this.state.fileDecrypt ) {
            return (
                <RSAFileEncryptForm />
            );
        }
        else {
            return (
                <RSAFileDecryptForm />
            ); 
        }
    }

    keyGenerateTab() {
        return (
            <RSAKeyGeneratorForm />
        );
    }
}

export { DESAlgorithm, AESAlgorithm, RSAAlgorithm };