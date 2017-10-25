Vue.component('loading-modal', {
    template: '\
    <transition name="modal">\
        <div class="modal-mask">\
            <div class="modal-wrapper">\
                <div class="spinner">\
                    <div class="rect1"></div>\
                    <div class="rect2"></div>\
                    <div class="rect3"></div>\
                    <div class="rect4"></div>\
                    <div class="rect5"></div>\
                </div>\
            </div>\
        </div>\
    </transition>'
})

var loading = new Vue({
    el: '#loading',
    data: {
        show_loading: false
    }
})
