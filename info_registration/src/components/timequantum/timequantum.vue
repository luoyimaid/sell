<template>
    <select  :value="value">
        <option>10:30 - 12:00</option>
        <option>14:00 - 15:30</option>
        <option>15:30 - 17:00</option>
    </select>
</template>

<script>
    export default {
        props: {
            value: {
                // type: ShellString,
                default: '10:30 - 12:00'
            }
        },
        data() {
            return {

            }
        },
        mounted () {

        }
    }
</script>

<style lang="scss" scoped>
    input,
    button,
    select,
    textarea{
        outline:none;
    }
    select {
        width: 200px;
        height: 25px;
        background-color:#fff;
        border-color:#dddddd;
    }
</style>
