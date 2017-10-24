Vue.component('table-header', {
    template: '\
        <tr>\
            <td v-for="(header, index) of headers" :key="index" class="text-center">{{header}}</td>\
        </tr>',
    props: ['headers']
})

Vue.component('table-body', {
    template: '\
        <tr>\
            <td v-for="(value, index) of items" :key="index" class="text-center">{{value}}</td>\
        </tr>',
    props: ['items']
})

Vue.component('table-component', {
    template: '\
    <table class="table table-hover table-striped">\
        <thead>\
            <tr is="table-header" :headers="tableHeader"></tr>\
        </thead>\
        <tbody>\
            <tr is="table-body" v-for="(result, index) in results" :key="index" :items="result"></tr>\
        </tbody>\
    </table>',
    props: ['tableHeader', 'resultSet'],
    data: function() {
        return {
            results: this.resultSet
        }
    },
    watch: {
        resultSet(val) {
            this.results = val
        }
    }
})

var result_view = new Vue({
    el: '#result-view',
    data: {
        table_header: ['编号', '端口号'],
        openPortResultSet: [
            [1, 80],
            [2, 22]
        ],
        closePortResultSet: [
            [1, 90]
        ]
    }
})
