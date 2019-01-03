import React,{Component} from 'react'

import {Grid,Header, Image, Tab} from 'semantic-ui-react'
import PrivateLogin from "./tab_private"
import MmicLogin from "./tab_mnemonic"
import KeyStoreLogin from "./tab_keystore"

const panes = [
    {menuItem: '私钥', render: () => <Tab.Pane attached={false}><PrivateLogin/></Tab.Pane>},
    {menuItem: '助记词', render: () => <Tab.Pane attached={false}><MmicLogin/></Tab.Pane>},
    {menuItem: 'KeyStore', render: () => <Tab.Pane attached={false}><KeyStoreLogin/></Tab.Pane>},
]

export default class Login extends Component {
    render() {
        return (
            <Grid textAlign='center'  verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450, marginTop: 100}}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src='images/logo.png'/> EHT钱包
                    </Header>
                    <Tab menu={{text: true}} panes={panes} style={{maxWidth: 450}}/>
                </Grid.Column>
            </Grid>
        )
    }
}
