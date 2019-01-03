import {Button, Loader,Form, Grid, Header, Image, Message, Segment} from 'semantic-ui-react'
import PubSub from 'pubsub-js'
import React, {Component} from 'react'

let service = require('../../service/service')
// disorder timber among submit tell early claw certain sadness embark neck salad

export default class MmicLogin extends Component {

    state = {
        privateKey: "",
        mmic: "",
        pwd: "",
        path: "m/44'/60'/0'/0/0",
    }
    // 处理输入文本绑定
    handleChange = (e, {name, value}) => {
        this.setState({[name]: value})
    }

    // 生成助记词
    handleGenMicc = () => {
        let mmic = service.genMmic()
        this.setState({mmic})
    }

    // 助记词导入
    onMMICClick = () => {
        let {mmic, path} = this.state
        let wallets = service.newWalletFromMmic(mmic, path)
        PubSub.publish("onLoginSucc", wallets)
    }

    render() {
        return (
            <Form size='large' onSubmit={this.onMMICClick}>
                <Segment stacked>
                    <Form.TextArea
                        placeholder='12 words'
                        name="mmic"
                        value={this.state.mmic}
                        onChange={this.handleChange}/>
                    <Form.Input
                        fluid
                        icon='user'
                        iconPosition='left'
                        type='path'
                        value={this.state.path}
                        onChange={this.handleChange}
                    />
                    <a onClick={this.handleGenMicc}>随机生成</a>
                    <br/>
                    <br/>
                    {/*<Form.Input*/}
                    {/*fluid*/}
                    {/*icon='lock'*/}
                    {/*iconPosition='left'*/}
                    {/*placeholder='Password'*/}
                    {/*type='password'*/}
                    {/*value={this.state.pwd}*/}
                    {/*onChange={this.handleChange}*/}
                    {/*/>*/}

                    <Form.Button color='teal' fluid size='large'>
                        助记词导入
                    </Form.Button>

                </Segment>
            </Form>
        )
    }
}
