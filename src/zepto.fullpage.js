(function ($) {
    if (typeof $ === 'undefined') {
        throw new Error('zepto.fullpage.js\'s script requires Zepto');
    }

    $.fn.fullpage = function (o) {
        var d = {
            page: '.page',
            start: 0,
            duration: 500,
            drag: false,
            onchange: function () {}
        };

        $.extend(true, d, o);

        var $this = $(this).addClass('fullPage-wp');
        var $parent = $this.parent();
        var $pages = $this.find(d.page).addClass('fullPage-page');
        var pagesLength = $pages.length;

        var height = $parent.height();
        var curIndex = d.start;
        var startY = 0;
        var movingFlag = false;
        function initEvent() {
            $this.on('touchstart', function(e){
                if (movingFlag) {return 0;}
                e.preventDefault();
                startY = e.targetTouches[0].pageY;
            });
            $this.on('touchend', function (e) {
                if (movingFlag) {return 0;}
                e.preventDefault();
                var sub = e.changedTouches[0].pageY - startY;
                var der = (sub > 30 || sub < -30) ? sub > 0 ? -1 : 1 : 0;
                var preIndex = curIndex;
                curIndex = fix(curIndex + der);

                moveTo(curIndex, preIndex, true);
            });
            if (d.drag) {
                $this.on('touchmove', function (e) {
                    if (movingFlag) {return 0;}
                    e.preventDefault();
                    var top = e.changedTouches[0].pageY - startY;
                    $this.removeClass('anim').css('top', -curIndex * height + top + 'px');
                });
            }
        }
        function fix(cur) {
            if (cur < 0) {
                return 0;
            }

            if (cur >= pagesLength) {
                return pagesLength - 1;
            }

            return cur;
        }
        function moveTo(cur, pre, anim) {
            if (anim) {
                $this.addClass('anim');
                movingFlag = true;
            } else {
                $this.removeClass('anim');
            }
            $this.css('top', -cur * height + 'px');
            window.setTimeout(function () {
                movingFlag = false;
                if (cur !== pre) {
                    d.onchange({cur: cur});
                    $pages.removeClass('cur').eq(cur).addClass('cur');
                }
            }, d.duration);
        }
        function init() {
            height = $parent.height();

            $pages.height(height);

            moveTo(curIndex, -1, false);
            initEvent();
        }
        
        init();
    };
}(Zepto));