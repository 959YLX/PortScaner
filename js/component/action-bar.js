const METHODS = ['TCP-Connect', 'TCP-SYN', 'ICMP-Echo']
const MIN_PORT = 0
const MAX_PORT = 65535

Vue.component('my-option', {
    template: '\
    <option value="value">{{method}}</option>',
    props: ['method', 'value']
})

var action_bar = new Vue({
    el: '#action-bar',
    data: {
        ip: '',
        start: '',
        end: '',
        methods: METHODS
    }
})
