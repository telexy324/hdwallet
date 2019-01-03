import React, {Component} from 'react';
import PubSub from "pubsub-js";
import './App.css';
import LoginForm from './view/login/login'
import Wallet from './view/wallet/wallet'
import {Container} from "semantic-ui-react";

class App extends Component {
    state = {
        login: false,
        loading: false,
        loginEvent: '',
        wallets: []
    }

    componentWillMount() {
        let loginEvent = PubSub.subscribe("onLoginSucc", this.onLoginSucc)
        this.setState({loginEvent})
    }

    onLoginSucc = (msg, data) => {
        console.log("登陆成功")
        console.log(data)
        this.setState({
            login: true,
            wallets: data
        })
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.state.loginEvent)
    }

    render() {
        let {login} = this.state
        let content = login ? <Wallet wallets={this.state.wallets}/> : <LoginForm/>
        return (
            <Container>
                {content}
            </Container>
        );
    }
}

export default App;
