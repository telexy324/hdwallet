import React, {Component} from 'react'
import {Grid, Form, Header, Loader, Button, Loading, Segment, Image} from 'semantic-ui-react'

let ethers = require('ethers')
let service = require('../../service/service')
let fileSaver = require('file-saver');

export default class Wallet extends Component {

    state = {
        wallets: [],// 支持多账户，默认第0个
        selectWallet: 0,
        provider: "http://127.0.0.1:8545", //环境
        walletInfo: [], // 钱包信息，获取为异步，单独存储下
        activeWallet: {}, // 当前活跃钱包
        txto: "", // 交易接收地址
        txvalue: "", // 转账交易金额
        pwd: "", // 导出keystore需要密码

        // UI状态表示
        txPositive: false, //
        loading: false,
        exportLoading: false,

    }

    constructor(props) {
        super(props)
        this.state.wallets = props.wallets
        this.state.selectWallet = props.wallets.length == 0 ? -1 : 0
    }

    // 更新钱包信息
    updateActiveWallet() {
        if (this.state.wallets.length == 0) {
            return null
        }
        let activeWallet = this.getActiveWallet()
        this.setState({activeWallet})
        this.loadActiveWalletInfo(activeWallet)
        return activeWallet
    }

    // 获取当前的钱包
    getActiveWallet() {
        let wallet = this.state.wallets[this.state.selectWallet]
        console.log("wallet", wallet)
        // 激活钱包需要连接provider
        return service.connectWallet(wallet, this.state.provider)
    }

    // 加载钱包信息
    async loadActiveWalletInfo(wallet) {
        let address = await wallet.getAddress()
        let balance = await wallet.getBalance()
        // 获取交易次数
        let tx = await wallet.getTransactionCount()
        this.setState({
            walletInfo: [address, balance, tx]
        })
    }

    // 发送交易
    onSendClick = () => {
        let {txto, txvalue, activeWallet} = this.state
        // balance 为Object类型

        console.log("balance", activeWallet)
        // 地址校验
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
        // 以太币转换，发送wei单位
        txvalue = ethers.utils.parseEther(txvalue);
        console.log("txvalue", txvalue)

        // 设置加载loading，成功或者识别后取消loading
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

    // 查看私钥
    onExportPrivate = () => {
        alert(this.getActiveWallet().privateKey)
    }
    // 导出keystore
    onExportClick = () => {
        let pwd = this.state.pwd;
        if (pwd.length < 6) {
            alert("密码长度不能小于6")
            return
        }
        this.setState({exportLoading: true})
        // 通过密码加密
        this.getActiveWallet().encrypt(pwd, false).then(json => {
            let blob = new Blob([json], {type: "text/plain;charset=utf-8"})
            fileSaver.saveAs(blob, "keystore.json")
            this.setState({exportLoading: false})
        });
    }

    // 页面加载完毕，更新钱包信息
    componentDidMount() {
        this.updateActiveWallet()
    }

    handleChange = (e, {name, value}) => {
        this.setState({[name]: value})
    }

    render() {
        // 金额显示需要手工转换
        let wallet = this.state.walletInfo
        if (wallet.length == 0) {
            return <Loader active inline/>
        }
        let balance = wallet[1]
        let balanceShow = ethers.utils.formatEther(balance) + "(" + balance.toString() + ")"
        return (
            <Grid textAlign='center' verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 650, marginTop: 10}}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src='images/logo.png'/> EHT钱包
                    </Header>
                    <Segment stacked textAlign='left'>
                        <Header as='h1'>Account</Header>
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
                                icon: 'lock',
                                content: '密码'
                            }}
                            actionPosition='left'
                            defaultValue='1.00'
                            type='pwd' name='pwd' required value={this.state.pwd}
                            placeholder='密码'
                            onChange={this.handleChange}/>
                        <br/>
                        <Button
                            color='twitter'
                            style={{width: "48%"}}
                            onClick={this.onExportPrivate}>
                            查看私钥
                        </Button>
                        <Button
                            color='twitter'
                            style={{width: "48%"}}
                            onClick={this.onExportClick}
                            loading={this.state.exportLoading}>
                            导出keystore
                        </Button>
                    </Segment>
                </Grid.Column>
            </Grid>
        )
    }
}
