<template>
    <div class="main">
        <h3>Информация о приложении</h3>
        <div class="main">
            <p>Данное приложение создано для удобной работы с токенами ERC20</p>
            <p>1. Подключите Metamask</p>
            <p>2. Задеплойте новый токен или подключитесь к уже задеплоиному
                (например <a href="https://goerli.etherscan.io/address/0x493664E58Ced86c607af18DB4E4495aA5167E3BD#code">0x493664E58Ced86c607af18DB4E4495aA5167E3BD</a>)
            </p>
            <p>3. Работайте с функциями через удобный интерфейс</p>
        </div>
    </div>

    <div class="main">
        <h3>Подключение Metamask</h3>
        <div class="main">
            <button class="btn" @click="connectionWallet">Подключить Metamask</button>
            <div class="output">Адрес аккаунта: {{ $store.state.address }}</div>
            <div class="output">ID цепи: {{ $store.state.chainId }}</div>
            <div class="output">Имя цепи: {{ $store.state.chain }}</div>
        </div>
    </div>

    <div class="main">
        <h3>Подключится к существующему контракту токена ERC20</h3>
        <div>
            <div>
                <input class="input" v-model="erc20Address" placeholder="Введите адрес контракта токена ERC20"/>
            </div>
            <button class="btn" @click="connect">Подключится к контракту</button>
        </div>
    </div>

    <div class="main">
        <h3>Задеплоить новый контракт токена ERC20</h3>
        <call-function
            buttonText="constructor(address to, uint256 value)"
            :buttonHandler="deployErc20"
            :inputText="['name', 'symbol', 'decimals']"
            :readOnly="false"
        >
        </call-function>
    </div>

    <div class="main">
        <h3>Текущий контракт:</h3>
        <div class="elem">
            <div class="output">Адрес контракта: {{ $store.state.erc20Address }}</div>
            <div class="output">ID цепочки: {{ $store.state.chainId }}</div>
        </div>
    </div>

    <div class="main">
        <h3>Платные функции</h3>

        <call-function
            buttonText="mint(address to, uint256 value)"
            :buttonHandler="mint"
            :inputText="['to', 'value']"
            :readOnly="false"
        >
        </call-function>

        <call-function
            buttonText="approve(address spender, uint256 value)"
            :buttonHandler="approve"
            :inputText="['spender', 'value']"
            :readOnly="false"
        >
        </call-function>

        <call-function
            buttonText="transfer(address to, uint256 value)"
            :buttonHandler="transfer"
            :inputText="['to', 'value']"
            :readOnly="false"
        >
        </call-function>

        <call-function
            buttonText="transferFrom(address from, address to, uint256 value)"
            :buttonHandler="transferFrom"
            :inputText="['from', 'to', 'value']"
            :readOnly="false"
        >
        </call-function>
    </div>

    <div class="main">
        <h3>Бесплатные функции</h3>

        <call-function
            buttonText="name()"
            :buttonHandler="getName"
        >
        </call-function>

        <call-function
            buttonText="symbol"
            :buttonHandler="symbol"
        >
        </call-function>

        <call-function
            buttonText="decimals()"
            :buttonHandler="decimals"
        >
        </call-function>

        <call-function
            buttonText="totalSupply()"
            :buttonHandler="totalSupply"
        >
        </call-function>

        <call-function
            buttonText="balanceOf(address account)"
            :buttonHandler="balanceOf"
            :inputText="['account']"
        >
        </call-function>

        <call-function
            buttonText="allowance(address owner, address spender)"
            :buttonHandler="allowance"
            :inputText="['owner', 'spender']"
        >
        </call-function>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default{
    data(){
        return{
            erc20Address:"",
        }
    },
    methods:{
        ...mapActions({
            connectionWallet: 'connectionWallet',
            deployErc20: 'deployErc20',
            connectErc20: 'connectErc20',
            mint: 'mint',
            approve: 'approve',
            transfer: 'transfer',
            transferFrom: 'transferFrom',
            getName: 'getName',
            symbol: 'symbol',
            decimals: 'decimals',
            totalSupply: 'totalSupply',
            balanceOf: 'balanceOf',
            allowance: 'allowance',
        }),
        async connect(){
            await this.connectErc20(this.erc20Address)
        }
    }
}
</script>


<style>
h3{
    text-align: center;
    margin: 5px 0px 10px
}
.main{
    padding: 15px;
    border: 1px solid grey;
    margin-bottom: 30px;
}
.elem{
    padding: 15px;
    border: 1px solid lightgrey;
    margin-bottom: 30px;
}
.btn{
    padding: 10px 15px;
    background: lightblue;
    color: black;
    border: 2px solid black;
}
.btn:hover{
    background: lightsteelblue;
}
.btn:active{
    color: white;
}
.input{
    width: 350px;
    margin-bottom: 5px;
    padding: 10px 15px
}
.output{
    padding: 10px 15px;
    background: none;
    color: black;
    border: 2px solid darkgreen;
    margin-top: 5px;

}
</style>
