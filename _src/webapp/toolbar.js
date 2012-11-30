
/**
 * @file
 * @name Toolbar
 * @desc 工具栏组件
 * @import core/zepto.extend.js, core/zepto.ui.js, core/zepto.fix.js
 */
(function($) {
    /**
     * @name     $.ui.toolbar
     * @grammar  $(el).toolbar(options) ⇒ self
     * @grammar  $.ui.toolbar([el [,options]]) =>instance
     * @desc **el**
     * css选择器, 或者zepto对象
     * **Options**
     * - ''container'' {selector}: (可选，默认：body) 组件容器
     * - ''title'' {String}: (可选)标题文字
     * - ''backButtonText'' {String}:(可选)返回按钮文字
     * - ''backButtonHref'' {String}: (可选)返回按钮的链接
     * - ''btns'' {Array}: (可选)右侧要添加的按钮(Dom节点)
     * - ''btns'' {Array}: (可选)右侧要添加的按钮(Dom节点)
     * - ''useFix'' {Array}: (可选)是否使用固顶效果(toolbar 不在页面顶端)
     * - ''position'' {Object}: (可选)固顶的位置参数
     * **Demo**
     * <codepreview href="../gmu/_examples/webapp/toolbar/toolbar.html">
     * ../gmu/_examples/webapp/toolbar/toolbar.html
     * ../gmu/_examples/webapp/toolbar/toolbar_demo.css
     * </codepreview>
     */
    $.ui.define("toolbar", {
        _data: {
            title:              '',
            backButtonText:     '返回',
            backButtonHref:     '',
            btns:               '',
            useFix:             false,
            position:           { top: 0 },
            backButtonClick:    function() { history.back(1) },
            _isShow:            false
        },

        _create: function() {
            var me = this,
                o = me._data;
            (me.root() || me.root($('<div></div>'))).addClass('ui-toolbar').appendTo(me.data('container') || (me.root().parent().length ? '' : document.body))
                .html((function() {
                var html = '<div class="ui-toolbar-wrap"><div class="ui-toolbar-left">';
                if(o.backButtonHref) html += '<a class="ui-toolbar-backbtn" href="' + o.backButtonHref + '">' + o.backButtonText + '</a></div>';
                else html += '<span class="ui-toolbar-backbtn">' + o.backButtonText + '</span></div>';
                html += o.title ? '<h2 class="ui-toolbar-title">' + o.title + '</h2>' : '';
                html += '<div class="ui-toolbar-right"></div></div>';
                return html;
            }()));
            if(o.btns) {
                var right = me.root().find('.ui-toolbar-right');
               $(o.btns).each(function(i, item) { right.append(item) });
            }
            me.data('backButtonHref') || me.root().find('.ui-toolbar-backbtn').click(me.data('backButtonClick'));
        },

        _setup: function(mode) {
            var me = this,
                root = me.root().addClass('ui-toolbar');
            if(!mode) {
                var childern = root.children(),
                    title = root.find('h1,h2,h3,h4'),
                    index = title.index(),
                    left = $('<div class="ui-toolbar-left"></div>'),
                    right = $('<div class="ui-toolbar-right"></div>'),
                    wrap = $('<div class="ui-toolbar-wrap"></div>');
                root.empty().append(wrap.append(left).append(right));
                if(index == -1){
                    childern.each(function(i, item) { $(item).appendTo(i == 0 ? left : right) });
                } else {
                    childern.each(function(i, item) {
                        if(i < index) left.append(item);
                        else if(i == index) wrap.append($(item).addClass('ui-toolbar-title'));
                        else right.append(item);
                    });
                }
                var backBtn = left.children().first().addClass('ui-toolbar-backbtn');
                backBtn.is('a') || backBtn.tap(me.data('backButtonClick'));
                me.data('btns') && $(me.data('btns')).each(function(i, item) { right.append(item) });
                me.data('container') && root.appendTo(me.data('container'));
            }
        },

        _init: function() {
            var me = this,
                root = me.root(),
                o = me._data;
            if(o.useFix){
                var placeholder = $('<div class="ui-toolbar-placeholder"></div>').height(root.offset().height).
                    insertBefore(root).append(root).append(root.clone().css({'z-index': -1, position: 'absolute',top: 0})),
                    top = root.offset(true).top;
                $(window).on('touchstart touchmove touchend touchcancel scroll', function() {
                    document.body.scrollTop > top ? root.css({position:'fixed', top: 0}) : root.css('position', '');
                });
            }
            me.root().find('.ui-toolbar-backbtn').highlight('ui-state-hover');
            return me;
        },

        /**
         * @desc 添加工具按钮
         * @name addButton
         * @grammar addButton() => self
         * @param {Array}  [btn1, btn2...]  参数为数组, btn必须为组件实例,通过这种方式添加进来的按钮,会在toolbar销毁时一同销毁
         *  @example
         * //setup mode
         * $('#toolbar').toolbar('addButton', btns);
         *
         * //render mode
         * var demo = $.ui.toolbar();
         * demo.addButton(btns);
         */
        addButton: function(btns) {
            var me = this,
                right = me.root().find('.ui-toolbar-right');
            $.each(btns, function(i, btn) {
                right.append(btn.root());
                me.component(btn);
            });
            return me;
        },

        /**
         * @desc 打开工具栏面板
         * @name show
         * @grammar show() => self
         *  @example
         * //setup mode
         * $('#toolbar').toolbar('show');
         *
         * //render mode
         * var demo = $.ui.toolbar();
         * demo.show();
         */
        show: function() {
            this.data('_isShow', true);
            this.root().show();
            return this;
        },

        /**
         * @desc 隐藏工具栏面板
         * @name hide
         * @grammar hide() => self
         *  @example
         * //setup mode
         * $('#toolbar').toolbar('hide');
         *
         * //render mode
         * var demo = $.ui.toolbar();
         * demo.hide();
         */
        hide: function() {
            this.data('_isShow', false);
            this.root().hide();
            return this;
        },

        /**
         * @desc 切换工具栏面板的显隐
         * @name toggle
         * @grammar toggle() => self
         *  @example
         * //setup mode
         * $('#toolbar').toolbar('toggle');
         *
         * //render mode
         * var demo = $.ui.toolbar();
         * demo.toggle();
         */
        toggle: function() {
            this.data('_isShow') ? this.hide() : this.show();
            return this;
        }
        /**
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | show | event | 显示时触发的事件 |
         * | hide | event | 隐藏时触发的事件 |
         * | destory | event | 组件在销毁的时候触发 |
         */
    });
})(Zepto);
