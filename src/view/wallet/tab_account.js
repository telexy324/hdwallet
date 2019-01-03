import React, {Component} from 'react'
import {Form, Header, Loader, Button, Loading, Segment, Container} from 'semantic-ui-react'

let ethers = require('ethers')
let service = require('../../service/service')
let fileSaver = require('file-saver');
export default class TabAccount extends Component {

    state = {
        wallets: [],
        selectWallet: 0,
        provider: "http://127.0.0.1:8545",
        walletInfo: [],
        activeWallet: {},
        txto: "",
        txvalue: "",
        txPositive: false,
        loading: false,
        exportLoading: false,
        pwd: "",
    }

    constructor(props) {
        super(props)
        this.state.wallets = props.wallets
        this.state.selectWallet = props.wallets.length == 0 ? -1 : 0
    }

    updateActiveWallet() {
        if (this.state.wallets.length == 0) {
            return null
        }
        let activeWallet = this.getActiveWallet()
        this.setState({activeWallet})
        this.loadActiveWalletInfo(activeWallet)
        return activeWallet
    }

    getActiveWallet() {
        let wallet = this.state.wallets[this.state.selectWallet]
        console.log("wallet", wallet)
        return service.connectWallet(wallet, this.state.provider)
    }

    async loadActiveWalletInfo(wallet) {
        let address = await wallet.getAddress()
        let balance = await wallet.getBalance()
        let tx = await wallet.getTransactionCount()
        this.setState({
            walletInfo: [address, balance, tx]
        })
    }

    onSendClick = () => {
        let {txto, txvalue, activeWallet} = this.state
        console.log("balance", activeWallet)
        let address = service.checkAddress(txto)
        if (address == "") {
            alert("地址不正确")
            return
        }
        console.log(txvalue, isNaN(txvalue))
        if (isNaN(txvalue)) {
            alert("转账金额不合法")
            return
        }
        txvalue = ethers.utils.parseEther(txvalue);
        console.log("txvalue", txvalue)
        this.setState({loading: true})
        service.sendTransaction(activeWallet, txto, txvalue)
            .then(tx => {
                console.log(tx)
                alert("交易成功")
                this.updateActiveWallet()
                this.setState({loading: false, txto: "", txvalue: ""})
            })
            .catch(e => {
                this.setState({loading: false})
                console.log(e);
                alert(e);
            })
    }


    onExportClick = () => {
        let pwd = this.state.pwd;
        if (pwd.length < 6) {
            alert("密码长度不能小于6")
            return
        }
        this.setState({exportLoading: true})
        this.getActiveWallet().encrypt(pwd, false).then(json=> {
            let blob = new Blob([json], {type: "text/plain;charset=utf-8"})
            fileSaver.saveAs(blob, "keystore.json")
            this.setState({exportLoading: false})
        });
    }

    componentDidMount() {
        this.updateActiveWallet()
    }

    handleChange = (e, {name, value}) => {
        this.setState({[name]: value})
    }

    render() {
        let wallet = this.state.walletInfo
        if (wallet.length == 0) {
            return <Loader active inline/>
        }
        let balance = wallet[1]
        let balanceShow = ethers.utils.formatEther(balance) + "(" + balance.toString() + ")"
        return (
            <Container>
                <Segment stacked textAlign='left'>
                    <Header as='h1'>Account0</Header>
                    <Form.Input
                        style={{width: "100%"}}
                        action={{
                            color: 'teal',
                            labelPosition: 'left',
                            icon: 'address card',
                            content: '地址'
                        }}
                        actionPosition='left'
                        value={wallet[0]}
                    />
                    <br/>
                    <Form.Input
                        style={{width: "100%"}}
                        action={{
                            color: 'teal',
                            labelPosition: 'left',
                            icon: 'ethereum',
                            content: '余额'
                        }}
                        actionPosition='left'
                        value={balanceShow}
                    />
                    <br/>
                    <Form.Input
                        actionPosition='left'
                        action={{
                            color: 'teal',
                            labelPosition: 'left',
                            icon: 'numbered list',
                            content: '交易'
                        }}
                        style={{width: "100%"}}
                        value={wallet[2]}
                    />
                </Segment>
                <Segment stacked textAlign='left'>
                    <Header as='h1'>转账|提现</Header>
                    <Form.Input
                        style={{width: "100%"}}
                        action={{
                            color: 'teal',
                            labelPosition: 'left',
                            icon: 'address card',
                            content: '地址'
                        }}
                        actionPosition='left'
                        defaultValue='52.03'
                        type='text' name='txto' required value={this.state.txto}
                        placeholder='对方地址' onChange={this.handleChange}/>
                    <br/>
                    <Form.Input
                        style={{width: "100%"}}
                        action={{
                            color: 'teal',
                            labelPosition: 'left',
                            icon: 'ethereum',
                            content: '金额'
                        }}
                        actionPosition='left'
                        defaultValue='1.00'
                        type='text' name='txvalue' required value={this.state.txvalue}
                        placeholder='以太' onChange={this.handleChange}/>
                    <br/>
                    <Button
                        color='twitter'
                        style={{width: "100%"}}
                        size='large'
                        loading={this.state.loading}
                        onClick={this.onSendClick}>
                        确认
                    </Button>
                </Segment>
                <Segment stacked textAlign='left'>
                    <Header as='h1'>设置</Header>
                    <Form.Input
                        style={{width: "100%"}}
                        action={{
                            color: 'teal',
                            labelPosition: 'left',
                            icon: 'ethereum',
                            content: '密码'
                        }}
                        actionPosition='left'
                        defaultValue='1.00'
                        type='pwd' name='pwd' required value={this.state.pwd}
                        placeholder='密码' onChange={this.handleChange}/>
                    <br/>
                    <Button
                        color='twitter'
                        style={{width: "48%"}}>查看私钥</Button>
                    <Button
                        color='twitter'
                        style={{width: "48%"}}
                        onClick={this.onExportClick}
                        loading={this.state.exportLoading}>
                        导出keystore
                    </Button>
                </Segment>
            </Container>
        )
    }

}
