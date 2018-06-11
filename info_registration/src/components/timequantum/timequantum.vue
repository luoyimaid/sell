<template>
    <select  :value="value">
        <option>09:00 - 10:00</option>
        <option>10:00 - 11:00</option>
        <option>11:00 - 12:00</option>
        <option>14:00 - 15:00</option>
        <option>15:00 - 16:00</option>
        <option>16:00 - 17:00</option>
        <option>17:00 - 18:00</option>
    </select>
</template>

<script>
    export default {
        props: {
            value: {
                // type: ShellString,
                default: '09:00 - 10:00'
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
