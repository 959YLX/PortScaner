const TITLE_HEIGHT = 60
const ACTION_BAR_MARGIN = 15
const REMAIN_HEIGHT = 30
const TOTAL_MARGIN = 30
const LABLE_HEIGHT = 42

let resizeHeight = function() {
    $('.table-style').height(($('body').height() - (TITLE_HEIGHT + (ACTION_BAR_MARGIN * 2) + $('#action-bar').height()) - REMAIN_HEIGHT - LABLE_HEIGHT - TOTAL_MARGIN))
}

$(window).resize(resizeHeight)
$(document).ready(resizeHeight)
