import React, { Component } from 'react';
import '../css/algo/algo.css';
import { Tabs, Tab } from 'material-ui/Tabs';
import Toggle from 'material-ui/Toggle';
import SwipeableViews from 'react-swipeable-views';

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    slide: {
        padding: 10,
    },
    inkbar: {
        backgroundColor: '#ADFF2F'
    },
    itemsContainer: {
        //backgroundColor: '#4682B4'
    },
    toggle: {
        marginLeft: 10,
        marginTop: 25,
    }
};

class SuperNodeAlgorithm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slideIndex: 0,
            enc: {
                fileUp: false,
                keyFile: false
            },
            dec: {
                fileUp: false,
                keyFile: false
            }
        };
    }

    handleChange = (value) => {
        this.setState({
            slideIndex: value,
        });
    }
    
    render() {
        return (
            <div></div>
        );
    }
    
    handleEncFileToggle = (event, value) => {
        if (value) {
            this.setState({
                enc: { ...this.state.enc, fileUp: true}
            });
        }
        else {
            this.setState({
                enc: { ...this.state.enc, fileUp: false}
            });
        }
    }
}

class DESAlgorithm extends SuperNodeAlgorithm {
    render() {
        return (
            <div className="container algo-container">
                <div className="col-12">
                    <Tabs onChange={this.handleChange} value={this.state.slideIndex} inkBarStyle={styles.inkbar} 
                        tabItemContainerStyle={styles.itemsContainer}>
                        <Tab label="Encryption" value={0} />
                        <Tab label="Decryption" value={1} />
                    </Tabs>
                    <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}>
                        <div style={styles.slide}>
                            <Toggle label="File Encryption" labelPosition="right" style={styles.toggle} className="my-toggle" 
                                onToggle={this.handleEncFileToggle} thumbStyle={{backgroundColor: '#B0C4DE'}} thumbSwitchedStyle={{backgroundColor: '#000080'}}
                                trackStyle={{backgroundColor: '#ADD8E6'}} trackSwitchedStyle={{backgroundColor: '#4682B4'}}/>
                            <div className="enc-process">
                                { this.state.enc.fileUp ? <div>C++</div> : <div>Java</div> }
                            </div>
                        </div>
                        <div style={styles.slide}>
                            <Toggle label="File Decryption" labelPosition="right" style={styles.toggle} className="my-toggle" 
                                onToggle={this.handleEncFileToggle} thumbStyle={{backgroundColor: '#B0C4DE'}} thumbSwitchedStyle={{backgroundColor: '#000080'}}
                                trackStyle={{backgroundColor: '#ADD8E6'}} trackSwitchedStyle={{backgroundColor: '#4682B4'}}/>
                        </div>
                    </SwipeableViews>
                </div>
            </div>
        );
    }
}

class AESAlgorithm extends SuperNodeAlgorithm {

    render() {
        return (
            <div className="container algo-container">
                <div className="col-12">
                    <Tabs onChange={this.handleChange} value={this.state.slideIndex} inkBarStyle={styles.inkbar} 
                        tabItemContainerStyle={styles.itemsContainer}>
                        <Tab label="Encryption" value={0} />
                        <Tab label="Descryption" value={1} />
                    </Tabs>
                    <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}>
                        <div style={styles.slide}>
                            slide n°2
                        </div>
                        <div style={styles.slide}>
                            slide n°3
                        </div>
                    </SwipeableViews>
                </div>
            </div>
        );
    }
}

class RSAAlgorithm extends SuperNodeAlgorithm {

    render() {
        return (
            <div className="container algo-container">
                <div className="col-12">
                    <Tabs onChange={this.handleChange} value={this.state.slideIndex} inkBarStyle={styles.inkbar} 
                        tabItemContainerStyle={styles.itemsContainer}>
                        <Tab label="Key Generation" value={0} />
                        <Tab label="Encryption" value={1} />
                        <Tab label="Descryption" value={2} />
                    </Tabs>
                    <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}>
                        <div>
                            
                        </div>
                        <div style={styles.slide}>
                            slide n°2
                        </div>
                        <div style={styles.slide}>
                            slide n°3
                        </div>
                    </SwipeableViews>
                </div>
            </div>
        );
    }
}

export { DESAlgorithm, AESAlgorithm, RSAAlgorithm };
// export AESAlgorithm;
// export RSAAlgorithm;