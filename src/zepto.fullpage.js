(function ($, window, undefined) {
    if (typeof $ === 'undefined') {
        throw new Error('zepto.fullpage\'s script requires Zepto');
    }
    var fullpage = null;
    var d = {
        page: '.page',
        start: 0,
        duration: 500,
        drag: false,
        change: function () {},
        beforeChange: function () {},
        afterChange: function () {},
        orientationchange: function () {}
    };
    function fix(cur, pagesLength) {
        if (cur < 0) {
            return 0;
        }

        if (cur >= pagesLength) {
            return pagesLength - 1;
        }

        return cur;
    }
    function init (option) {
        var o = $.extend(true, {}, d, option);
        var that = this;
        that.curIndex = o.start;
        that.o = o;

        that.startY = 0;
        that.movingFlag = false;

        that.$this.addClass('fullPage-wp');
        that.$parent = that.$this.parent();
        that.$pages = that.$this.find(o.page).addClass('fullPage-page');
        that.pagesLength = that.$pages.length;
        that.update();        
        that.initEvent();
    }
    function Fullpage($this, option) {
        this.$this = $this;
        init.call(this, option);
    }

    $.extend(Fullpage.prototype, {
        update: function () {
            this.height = this.$parent.height();

            this.$pages.height(this.height);

            this.moveTo(this.curIndex, -1);
        },
        initEvent: function () {
            var that = this;
            var $this = that.$this;

            $this.on('touchstart', function(e){
                e.preventDefault();
                if (that.movingFlag) {return 0;}

                that.startY = e.targetTouches[0].pageY;
            });
            $this.on('touchend', function (e) {
                e.preventDefault();
                if (that.movingFlag) {return 0;}

                var sub = e.changedTouches[0].pageY - that.startY;
                var der = (sub > 30 || sub < -30) ? sub > 0 ? -1 : 1 : 0;

                that.moveTo(that.curIndex + der, that.curIndex, true);
            });
            if (that.o.drag) {
                $this.on('touchmove', function (e) {
                    e.preventDefault();
                    if (that.movingFlag) {return 0;}
                    
                    var top = e.changedTouches[0].pageY - that.startY;
                    $this.removeClass('anim').css('top', - that.curIndex * that.height + top + 'px');
                });
            }

            // 翻转屏幕提示
            // ==============================             
            window.addEventListener("orientationchange", function() {                
                if (window.orientation === 180 || window.orientation === 0) {  
                    that.o.orientationchange('portrait');
                }  
                if (window.orientation === 90 || window.orientation === -90 ){  
                    that.o.orientationchange('landscape');
                }
            }, false);

            window.addEventListener("resize", function() {
                that.update();
            }, false);
        },
        moveTo: function (cur, prev, anim) {
            var that = this;
            var $this = that.$this;

            cur = fix(cur, that.pagesLength);
            prev = prev === undefined ? that.curIndex : prev;

            if (anim) {
                $this.addClass('anim');
            } else {
                $this.removeClass('anim');
            }

            if (cur !== prev) {
                that.o.beforeChange({cur: cur, prev: prev});
            }

            that.movingFlag = true;            
            that.curIndex = cur;
            $this.css('top', - cur * that.height + 'px');

            if (cur !== prev) {
                that.o.change({cur: cur, prev: prev});
            }

            window.setTimeout(function () {
                that.movingFlag = false;               
                if (cur !== prev) {        
                    that.o.afterChange({cur: cur, prev: prev});     
                    that.$pages.removeClass('cur').eq(cur).addClass('cur');
                }
            }, that.o.duration);
        },
        movePrev: function () {
            this.moveTo(this.curIndex - 1, this.curIndex, true);
        },
        moveNext: function () {
            this.moveTo(this.curIndex + 1, this.curIndex, true);
        }
    });

    $.fn.fullpage = function (option) {
        if (!fullpage) {
            fullpage = new Fullpage($(this), option);
        }  
        return this;
    };
    //暴漏方法
    $.each(['update', 'moveTo', 'moveNext', 'movePrev'], function (key, val) {
        $.fn.fullpage[val] = function () {
            if (!fullpage) {return 0;}
            fullpage[val].apply(fullpage, [].slice.call(arguments, 0));
        };
    });
}(Zepto, window));