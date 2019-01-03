import {Button, Form, Segment} from 'semantic-ui-react'
import React, {Component} from 'react'
import PubSub from 'pubsub-js'

let service = require('../../service/service')

export default class PrivateLogin extends Component {

    state = {
        privateKey: "",
    }

    handleCreateClick = () => {
        let privateKey = service.newRandomKey()
        this.setState({privateKey})
    }

    handleChange = (e, {name, value}) => {
        this.setState({[name]: value})
    }

    onPrivateLoginClick = () => {
        let key = this.state.privateKey
        let err = service.checkPrivate(key)
        if (err !== "") {
            alert(err)
            return;
        }
        if (key.substring(0, 2).toLowerCase() !== '0x') {
            key = '0x' + key;
        }
        console.log("开始创建钱包", key)
        let wallets = service.newWalletFromPrivateKey(key)
        if (wallets) {
            PubSub.publish("onLoginSucc", wallets)
        } else {
            alert("导入出错")
        }
    }

    render() {
        return (
            <Form size='large'>
                <Segment>
                    <Form.Input
                        fluid icon='lock' iconPosition='left'
                        placeholder='private key'
                        name="privateKey"
                        value={this.state.privateKey}
                        onChange={this.handleChange}/>

                    <a href='#' onClick={this.handleCreateClick}>随机生成</a>
                    <br/>
                    <br/>
                    <Button
                        color='teal' fluid size='large'
                        onClick={this.onPrivateLoginClick}>
                        私钥导入
                    </Button>
                </Segment>
            </Form>
        )
    }
}
