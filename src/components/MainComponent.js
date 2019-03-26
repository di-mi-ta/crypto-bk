import React, { Component } from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
// import MainForm from './MainFormComponent';
import Home from './HomeComponent';
import About from './AboutUsComponent';
import { RabbitAlgorithm, AESAlgorithm, RSAAlgorithm } from './AlgorithmComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { postFeedback, loginUser, logoutUser} from '../redux/ActionCreators';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapStateToProps = state => {
    return {
      auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => ({
  resetFeedbackForm: () => { dispatch(actions.reset('feedback'))},
  postFeedback: (feedback) => dispatch(postFeedback(feedback)),
  loginUser: (creds) => dispatch(loginUser(creds)),
  logoutUser: () => dispatch(logoutUser()),
});

class Main extends Component {
  render() {
    return (
      <div>
        <Header auth={this.props.auth} 
          loginUser={this.props.loginUser} 
          logoutUser={this.props.logoutUser} 
          />   
        <TransitionGroup>
          <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
            <Switch>
              <Route exact path="/home" component={() => <Home />} />
              <Route exact path="/algorithm/rabbit" component={RabbitAlgorithm} />
              <Route exact path="/algorithm/aes" component={AESAlgorithm} />
              <Route exact path="/algorithm/rsa" component={RSAAlgorithm} />
              <Route exact path="/aboutus" component={() => <About />} />
              <Redirect to="/home" />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
