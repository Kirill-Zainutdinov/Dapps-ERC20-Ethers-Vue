import { createStore } from 'vuex'
const ethers = require("ethers")
const mainApi = "YOU MAIN API"
const goerliApi = "YOU GOERLI API"
const sepoliaApi = "YOU SEPOLIA API"
const mainProvider = new ethers.providers.JsonRpcProvider(goerliApi)
const goerliProvider = new ethers.providers.JsonRpcProvider(goerliApi)
const sepoliaProvider = new ethers.providers.JsonRpcProvider(goerliApi)
const ganacheProvider = new ethers.providers.JsonRpcProvider('HTTP://127.0.0.1:8545')
const iErc20 = new ethers.utils.Interface(erc20ABI)
let currentProvider

import {erc20ABI} from "@/contracts/ERC20.abi.js"
import {ec20BIN} from "@/contracts/ERC20.bin.js"

export default createStore({
    state: {
        provider : {},
        address: "",
        signer: "",
        chain: "",
        chainId: "",
        erc20: {},
        iErc20: {},
        erc20Address: ""
    },
    getters: {
    },
    mutations: {
        addBlock(state, newBlock){
            state.blocks.unshift(newBlock)
        }
    },
    actions: {
        async connectionWallet({state}){
            // проверяем, что есть метамаск и подключаем его
            if (typeof window.ethereum !== 'undefined') {
                console.log("Ethereum client installed!")
                if (ethereum.isMetaMask === true) {
                    console.log("Metamask installed!")
                    if (ethereum.isConnected() !== true) {
                        console.log("Metamask is not connected!")
                        await ethereum.enable()
                    }
                    console.log("Metamask connected!")
                }
                else{
                    alert("Metamask is not installed!")
                }
            }
            else{
                alert("Ethereum client is not installed!")
            }

            // создаём провайдера
            state.provider = new ethers.providers.Web3Provider(ethereum)
            // получаем параметры сети 
            state.chainId = await window.ethereum.request({ method: 'eth_chainId' });
            console.log("chainId: ", state.chainId )
            if (state.chainId == "0x1"){
                state.chain = "main"
                currentProvider = mainProvider
            }
            else if (state.chainId == "0x5"){
                state.chain = "goerli"
                currentProvider = goerliProvider
            }
            else if (state.chainId == "0xaa36a7"){
                state.chain = "sepolia"
                currentProvider = sepoliaProvider
            }
            else if (state.chainId == "0x539"){
                state.chain = "ganache"
                currentProvider = ganacheProvider
            }
            // создание интерфейса
            state.iErc20 = new ethers.utils.Interface(erc20ABI)
            // подключаем аккаунт
            await ethereum.request({method: "eth_requestAccounts"})
            .then(accounts => {
                state.address = ethers.utils.getAddress(accounts[0])
                state.signer = state.provider.getSigner()
                console.log(`Account ${state.address} connected`)
            })

            ethereum.on('accountsChanged', (accounts) => {
                state.address = ethers.utils.getAddress(accounts[0])
                state.signer = state.provider.getSigner()
                console.log(`accounts changed to ${state.address }`)
            })

            ethereum.on('chainChanged', async (chainId) => {
                // создаём провайдера
                state.provider = new ethers.providers.Web3Provider(ethereum)
                // получаем параметры сети 
                state.chainId = await window.ethereum.request({ method: 'eth_chainId' })
                if (state.chainId == "0x1"){
                    state.chain = "main"
                    currentProvider = mainProvider
                }
                else if (state.chainId == "0x5"){
                    state.chain = "goerli"
                    currentProvider = goerliProvider
                }
                else if (state.chainId == "0xaa36a7"){
                    state.chain = "sepolia"
                    currentProvider = sepoliaProvider
                }
                else if (state.chainId == "0x539"){
                    state.chain = "ganache"
                    currentProvider = ganacheProvider
                }
                console.log(`chainId changed to ${state.chainId}`)
            })
        },
        // функция деплоя нового контракта
        async deployErc20({state}, args){
            const [name, symbol, decimals] = args

            let ERC20 = new ethers.ContractFactory(erc20ABI, ec20BIN)
            const data = ERC20.getDeployTransaction(name, symbol, decimals).data

            await ethereum.request({
                method: "eth_sendTransaction",
                params:[{
                    from: state.address,
                    data: data
                }]
            })
            .then(async (hash) => {
                const tx = await ganacheProvider.getTransaction(hash)
                const receipt = await tx.wait()
                state.erc20Address = receipt.contractAddress
                state.erc20 = new ethers.Contract(state.erc20Address, erc20ABI, currentProvider)
            })
        },
        // функция для конекта к уже задеплоиному контракту
        async connectErc20({state}, erc20Address){
            state.erc20Address = erc20Address
            state.erc20 = new ethers.Contract(state.erc20Address, erc20ABI, currentProvider)
        },
        // далее идут функции для работы с контрактом
        async mint({state}, args){
            const [to, value] = args

            const data = iErc20.encodeFunctionData("mint", [to, value])

            return await ethereum.request({
                method: "eth_sendTransaction",
                params:[{
                    from: state.address,
                    to: state.erc20Address,
                    data: data
                }]
            })
        },
        async approve({state}, args){
            const [spender, value] = args

            const data = iErc20.encodeFunctionData("approve", [spender, value])

            return await ethereum.request({
                method: "eth_sendTransaction",
                params:[{
                    from: state.address,
                    to: state.erc20Address,
                    data: data
                }]
            })
        },
        async transfer({state}, args){
            const [to, value] = args

            const data = iErc20.encodeFunctionData("transfer",[to, value])

            return await ethereum.request({
                method: "eth_sendTransaction",
                params:[{
                    from: state.address,
                    to: state.erc20Address,
                    data: data
                }]
            })
        },
        async transferFrom({state}, args){
            const [from, to, value] = args

            const data = iErc20.encodeFunctionData("transferFrom", [from, to, value])

            return await ethereum.request({
                method: "eth_sendTransaction",
                params:[{
                    from: state.address,
                    to: state.erc20Address,
                    data: data
                }]
            })
        },
        async getName({state}){
            return await state.erc20.name()
        },
        async symbol({state}){
            return await state.erc20.symbol()
        },
        async decimals({state}){
            return await state.erc20.decimals()
        },
        async totalSupply({state}){
            return await state.erc20.totalSupply()
        },
        async balanceOf({state}, arg){
            const account = arg[0]
            return await state.erc20.balanceOf(account)
        },
        async allowance({state}, arg){
            const [owner, spender] = arg
            return await state.erc20.allowance(owner, spender)
        },
    },
    modules: {
    }
})

