<template>
    <div>
        <input
            class="input"
            :placeholder="'Введите аргумент ' + inputText"
            v-model="arg"
            @input="$emit('input', {argId, arg})"
        >
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default{
    name: "my-input",
    data(){
        return{
            arg: ""
        }
    },
    props:{
        inputText:{
            type: String,
            required: true
        },
        argId:{
            type: Number,
            required: true
        },
        clear:{
            type: Boolean,
            required: true
        }
    },
    watch:{
        clear(){
            if(this.clear === true){
                this.arg = ""
                this.$emit('clear')
            }
        }
    }
}
</script>


<style>

</style>

