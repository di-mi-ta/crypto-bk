import React, { Component } from 'react';
import Contact from './ContactComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import MainForm from './MainForm';
import Home from './HomeComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {loginUser, logoutUser, uploadFile} from '../redux/ActionCreators';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapStateToProps = state => {
    return {
      auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => ({
  loginUser: (creds) => dispatch(loginUser(creds)),
  logoutUser: () => dispatch(logoutUser()),
  uploadFile: (file, user) => dispatch(uploadFile(file, user))
});

class Main extends Component {
  render() {
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={(props) => (
        this.props.auth.isAuthenticated
          ? <Component {...props} />
          : <Redirect to={{
              pathname: '/home',
              state: { from: props.location }
            }} />
      )} />
    );

    return (
      <div>
        <Header auth={this.props.auth} 
          loginUser={this.props.loginUser} 
          logoutUser={this.props.logoutUser} 
          />   
        <MainForm auth={this.props.auth} 
                  uploadFile={this.props.uploadFile}  />
        <TransitionGroup>
          <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
            <Switch>
              <Route exact path="/home" component={() => <Home />} />
              {/* <Route path="/algorithms" component={AlgorithmPage} />
              <Route path="/keymgn" component={KeyManagement} />
              <Route path="/mydrive" component={() => <MyDrive />} />
              <Route path="/aboutus" component={() => <AboutUs />} />
              <Route path="/help" component={Help} /> */}
              {/* <Route exact path='/' component={() => <About leaders={this.props.leaders} />} />} /> */}
              <Route exact path="/" component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback} />} />
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
