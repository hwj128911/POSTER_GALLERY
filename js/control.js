/**
 * Created by hwj12 on 2017/1/28.
 * 控制模块
 */
define(['calculate', 'obtain'], function (calculate, obtain) {
    var ranges = calculate.range();
    var _photo = obtain.g('.photo');
    var navs = obtain.g('.i');
    var modes = {"hash": 0, "annular": 1};
    var current_mode = modes.hash;
    var current_center = 1;

    function Control() {
        this.opts = arguments[0] ? arguments : Control.DEFAULTS;
        current_mode = this.opts.mode;
        current_center = this.opts.center;
    }

    Control.prototype.changeCenter = function (n) {
        current_center = n;
    };

    Control.prototype.changeMode = function (m) {
        current_mode = m;
    };

    Control.prototype.rsort = function () {
        var photos = initPhoto();

        for (var i = 0; i < photos.length; i++) {
            if (current_mode == modes.hash) {
                _hashMode(photos[i]);
            } else if (current_mode == modes.annular) {
                _annularMode(photos[i]);
            }
        }

        setNavTurn();
    };

    Control.DEFAULTS = {
        mode: modes.hash,
        center: 1
    };

    function setNavTurn() {
        //设置导航栏的翻转
        for (var i = 0; i < navs.length; i++) {
            navs[i].className = navs[i].className.replace(
                / \s*i_current/, ''
            );
            navs[i].className = navs[i].className.replace(
                /\s*i_back/, ''
            )
        }
        var current_nav = obtain.g('#nav_' + current_center);
        current_nav.className += ' i_current';
    }

    function initPhoto() {
        var photos = [];
        for (var i = 0; i < _photo.length; i++) {
            _photo[i].className = _photo[i].className.replace(/\s*photo_center/, '');
            _photo[i].className = _photo[i].className.replace(/\s*photo_front/, '');
            _photo[i].className = _photo[i].className.replace(/\s*photo_back/, '');
            _photo[i].className += ' photo_front';
            _photo[i].style.left = '';
            _photo[i].style.top = '';
            _photo[i].style['transform'] = 'rotate(0deg)';
            photos.push(_photo[i]);
        }
        return setCenter(photos);
    }

    function setCenter(array) {
        var photo_center = obtain.g('#photo_' + current_center);
        // photo_center.style['transform'] = 'scale(1.1)';
        photo_center.className += ' photo_center';
        array.splice(current_center, 1);
        return array;
    }

    function _hashMode(obj) {
        var xDir = 1;
        var yDir = 0;
        var xOffset = calculate.random(ranges.x);
        var yOffset = calculate.random(ranges.y);
        console.log("xOffset:" + ranges.x[0] + " yOffset:" + ranges.x[1]);
        if (Math.random() < 0.5) {
            xDir = 1;
            // obj.style.left = calculate.random(ranges.left.x) + 'px';
            // obj.style.top = calculate.random(ranges.left.y) + 'px';
        } else {
            xDir = -1;
            // obj.style.left = calculate.random(ranges.right.x) + 'px';
            // obj.style.top = calculate.random(ranges.right.y) + 'px';
        }
        if (Math.random() < 0.5) {
            yDir = 1;
        } else {
            yDir = -1;
        }
        obj.style['transform'] = 'translate(' + xOffset * xDir + 'px,' + yOffset * yDir + 'px) rotate(' + calculate.random([-50, 50]) + 'deg)';
    }

    function _annularMode(obj) {
        var width = obj.offsetWidth;
        var height = obj.offsetHeight;

        var rangeAngle = calculate.random([0, 360]);
        var radius = width > height ? width + 50 : height + 50;
        var xOffset = Math.cos((90 - rangeAngle ) * (Math.PI / 180)) * radius;
        var yOffset = Math.sin((90 - rangeAngle) * (Math.PI / 180)) * radius;
        obj.style['transform'] = 'translate(' + xOffset + 'px,' + -yOffset + 'px) rotate(' + rangeAngle + 'deg)';
    }

    Control.prototype.turn = function (elem) {
        var cls = elem.className;
        console.log(elem.id);
        var n = elem.id.split('_')[1];
        var thisNav = obtain.g('#nav_' + n);

        if (!/photo_center/.test(cls)) {
            this.changeCenter(n);
            return this.rsort();
        }
        if (/photo_front/.test(cls)) {
            cls = cls.replace(/photo_front/, 'photo_back');
            thisNav.className += ' i_back';
        } else {
            cls = cls.replace(/photo_back/, 'photo_front');
            thisNav.className = thisNav.className.replace(/\s*i_back/, '');
        }
        return elem.className = cls;
    };

    return {
        Control: Control,
        modes: modes
    }
});
