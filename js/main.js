/**
 * Created by hwj12 on 2017/1/28.
 */
requirejs(['obtain', 'control', 'calculate', 'data'], function (obtain, control, calculate, d) {
    var data = d.model();
    var c = new control.Control();
    /**
     * 添加照片
     */
    (function () {
        var htmlBody = obtain.g('#wrap');
        var template = htmlBody.innerHTML;
        var html = [];
        var nav = [];

        for (var i = 0; i < data.length; i++) {
            var _html = template.replace('{{index}}', i + '')
                .replace('{{img}}', data[i].img)
                .replace('{{caption}}', data[i].caption)
                .replace('{{desc}}', data[i].desc);
            html.push(_html);
            nav.push('<span id="nav_' + i + '" class="i"></span>')
        }
        html.push('<div class="nav">' + nav.join('') + '</div>');
        htmlBody.innerHTML = html.join('');
        window.setTimeout(function () {
            c.changeCenter(calculate.random([0, data.length - 1]));
            c.rsort();
        }, 50);
    })();

    /**
     * 事件绑定
     */
    (function () {
        var photo = obtain.g('.photo');
        var item = obtain.g('.i');
        //noinspection JSDuplicatedDeclaration
        for (var i = 0; i < photo.length; i++) {
            photo[i].onclick = function () {
                if(isRunning){
                    clearInterval(timer);
                    startPolling();
                }
                return c.turn(this);
            }
        }

        //noinspection JSDuplicatedDeclaration
        for (var i = 0; i < item.length; i++) {
            var selectPhoto = obtain.g('#photo_' + i);
            (function (obj, photo) {
                obj.onclick = function () {
                    if(isRunning){
                        clearInterval(timer);
                        startPolling();
                    }
                    return c.turn(photo);
                }
            })(item[i], selectPhoto);
        }
        var hash = obtain.g('#hash');
        var annular = obtain.g('#annular');
        var start = obtain.g('#start');
        var stop = obtain.g('#end');

        hash.onclick = function () {
            if(isRunning){
                clearInterval(timer);
                startPolling();
            }

            if(/selected/.test(hash.className)){
                return false;
            }else{
                c.changeMode(control.modes.hash);
                c.rsort();
                annular.className = annular.className.replace(/\s*selected/,'');
                hash.className += ' selected';
            }
        };
        annular.onclick = function () {
            if(isRunning){
                clearInterval(timer);
                startPolling();
            }

            if(/selected/.test(annular.className)){
                return false;
            }else{
                c.changeMode(control.modes.annular);
                c.rsort();
                hash.className = hash.className.replace(/\s*selected/,'');
                annular.className += ' selected';
            }
        };

        start.onclick = function () {
            if(isRunning){
                return false;
            }else{
                startPolling();
                start.className += ' selected';
                stop.className = stop.className.replace(/\s*selected/,'');
            }
        };
        stop.onclick = function () {
            if(isRunning){
                clearInterval(timer);
                isRunning = false;
                stop.className += ' selected';
                start.className = start.className.replace(/\s*selected/,'');
            }else{
                return false;
            }
        };
    })();


    /**
     * 启动轮询事件
     */
    var timer = null;
    var isRunning = false;
    function startPolling() {
        timer = window.setInterval(function () {
            var number = calculate.random([0, data.length - 1]);
            c.changeCenter(number);
            c.rsort();
            window.setTimeout(function () {
                c.turn(obtain.g('#photo_' + number));
            },1000);
        }, 3000);
        isRunning = true;
    }
    startPolling();

});
