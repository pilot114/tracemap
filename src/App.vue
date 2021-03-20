<template>
    <div id="app">
        <el-container>
            <el-aside width="200px">
                <el-row>
                    <el-image :src="require(`@/assets/img/logo.svg`)" alt="Tracemap logo"></el-image>
                    <el-input placeholder="Ex. google.com ou 8.8.8.8" v-model="search"></el-input>
                </el-row>
                <el-row>
                    <el-menu
                            active-text-color="#00bc64"
                    >
                        <el-menu-item
                                v-for="(hop, i) in hops"
                                :index="hop.index" :key="hop.index"
                                @click="selectedHop = hops[i]"
                        >
                            <span>#{{ hop.index }} {{ hop.ip }}</span>
                            <span>{{ hop.org }}</span>
                        </el-menu-item>
                    </el-menu>
                </el-row>
            </el-aside>
            <el-main>
                map
            </el-main>
        </el-container>
    </div>
</template>

<script>

    export default {
        name: 'App',
        components: {},
        data() {
            return {
                mode: 'map', // map / graph
                visible: false,
                search: '',
                hops: [
                    {index: '1', ip: '123.123.123.121', org: 'Test1'},
                    {index: '2', ip: '123.123.123.122', org: 'Test2'},
                    {index: '3', ip: '123.123.123.123', org: 'Test3'},
                ],
                selectedHop: null
            }
        }
    }
</script>

<style>
    *::-webkit-scrollbar {
        width: 3px;
        background-color: #333;
    }
    *::-webkit-scrollbar-track {background-color: #333;}
    *::-webkit-scrollbar-thumb {background-color: #00bc64;}

    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: white;
    }
    .el-row {
        margin-bottom: 10px;
    }
</style>
