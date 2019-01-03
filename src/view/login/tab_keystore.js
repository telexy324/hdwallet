import {Button, Form, Grid, Header, Image, Loader, Message, Segment} from 'semantic-ui-react'
import PubSub from 'pubsub-js'
import _ethets2 from "ethers"
import React, {Component} from 'react'

let service = require('../../service/service')

export default class KeyStoreLogin extends Component {

    state = {
        keyStore: "",
        pwd: '',
        loading:false
    }

    handleChange = (e, {name, value}) => {
        this.setState({[name]: value})
    }

    // 处理导入
    handleKeyImport = () => {
        let {keyStore, pwd} = this.state
        if (keyStore==""){
            return
        }
        console.log(service.checkJsonWallet(keyStore))
        this.setState({loading:true})
        service.newWalletFromJson(keyStore, pwd).then(wallets => {
            PubSub.publish("onLoginSucc", wallets)
            this.setState({loading:false})
        }).catch(e => {
            console.log(e)
            alert("导入出错" + e)
            this.setState({loading:false})
        })
    }

    onFileChooseClick = ()=>{
    }

    render() {
        return (
            <Form size='large'>
                <Loader active={this.state.loading} inline />
                <Segment>
                    <Form.TextArea
                        placeholder='keystore为json格式'
                        name="keyStore"
                        value={this.state.keyStore}
                        onChange={this.handleChange}/>

                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                        name = "pwd"
                        value={this.state.pwd}
                        onChange={this.handleChange}
                    />
                    <Button
                        color='teal' fluid size='large'
                            onClick={this.handleKeyImport}>
                        导入
                    </Button>
                </Segment>
            </Form>
        )
    }
}
