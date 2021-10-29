let toc;
let tocFlag = true;

function tocInit() {
    let ul = $('#TableOfContents > ul');
    let headers = $(':header');
    let tocLiMap = new Map();
    let curLevel = 2;
    for (let i = 1; i < headers.length - 1; i++) {
        let level = $(headers[i]).prop('tagName')[1];
        if (level > curLevel) {
            do {
                ul = ul.children().last();
                ul.append('<ul></ul>');
                ul = ul.children().last();
                curLevel++;
            } while (level > curLevel);
        } else if (level < curLevel) {
            do {
                ul = ul.parent().parent();
                curLevel--;
            } while (curLevel > level);
        }
        let li = $('<li id="toc-li"><a href="#' + $(headers[i]).attr('id') + '">' + $(headers[i]).text() + '</a></li>');
        // ul.append('<li id="toc-li"><a href="#' + $(headers[i]).attr('id') + '">' + $(headers[i]).text() + '</a></li>');
        ul.append(li)
        tocLiMap.set($(headers[i]).text(), li)
    }

    toc = {
        'clickFlag': false,
        'aArr': $('#sidetoc a'),
        'offsetHs': undefined,
        'sideToc': $('#sidetoc'),
        'tocLiMap': tocLiMap,
        'tocBtn': $('#tocbtn'),
        'cur': 0,
        'scrollTimer': undefined,
        'setScrollTimer': function () {
            return setTimeout(() => {
                toc.lightAnchor($(window).scrollTop());
            }, 500);
        },
        'lightAnchor': function (scrollTop) {
            if (scrollTop >= toc.offsetHs[toc.offsetHs.length - 1]) {
                if (!toc.clickFlag)
                    toc.cur = toc.aArr.length - 1;
            } else if (scrollTop <= 0) {
                toc.cur = 0;
            } else {
                for (let i = 1; i < toc.offsetHs.length; i++) {
                    if (scrollTop >= toc.offsetHs[i - 1] && scrollTop < toc.offsetHs[i]) {
                        if (!toc.clickFlag) toc.cur = i - 2 <= 0 ? 0 : i - 2;
                        break;
                    }
                }
            }
            $(toc.aArr).css('color', 'rgba(238, 238, 238, 0.664)');
            $(toc.aArr[toc.cur]).css('color', 'white');
            let top = toc.tocLiMap.get(toc.aArr[toc.cur].text).position().top;
            if (top > toc.sideToc.height() || top < 0) {
                toc.sideToc.animate({
                    scrollTop: "+=" + top + "px"
                }, 400, "linear");
            }
        },
        'tocToggle': function () {
            toc.isTocOpen() ? toc.tocClose() : toc.tocOpen();
        },
        'isTocOpen': function () {
            return toc.sideToc.css('visibility') !== "hidden";
        },
        'tocOpen': function () {
            toc.tocBtn.css('right', '100px');
            toc.sideToc.css({
                'visibility': 'visible',
                'opacity': '1',
                'maxHeight': '1000px'
            });
        },
        'tocClose': function () {
            toc.tocBtn.css('right', '0px');
            toc.sideToc.css({
                'visibility': 'hidden',
                'opacity': '0',
                'maxHeight': '0px'
            });
        },
        'getHeaderHeights': function(offsetHs, aArr) {
            for (let i = 0; i < aArr.length; i++)
                offsetHs[i+1] = $($(aArr[i]).attr('href')).offset().top - 10
        },
        'setHeaderHeightsTimer': function() {
            return setTimeout(() => {
                toc.getHeaderHeights(toc.offsetHs, toc.aArr);
            }, 500);
        }
    };

    let sideToc = toc.sideToc;
    let aArr = toc.aArr;
    toc.offsetHs = new Array(aArr.length + 1)
    // 调整导航栏高度
    if (sideToc.length > 0) {
        let i = sideToc.find("header").innerHeight() + sideToc.find("nav").innerHeight();
        if (sideToc.innerHeight() > i) {
            sideToc.css('height', i + 30 + 'px');
        }
    }
    // 记录标题高度
    toc.getHeaderHeights(toc.offsetHs, toc.aArr)
    toc.setHeaderHeightsTimer()
    // 设置定时器
    toc.scrollTimer = toc.setScrollTimer();
    // 小窗口隐藏
    if (window.innerWidth <= 1200) toc.tocClose();
    // 初始化事件
    $('#tocbtn').click(toc.tocToggle);
    toc.aArr.hover(aArrHoverIn, aArrHoverOut);
    toc.aArr.click(aArrClick);
    $(window).on('scroll', () => {
        clearTimeout(toc.scrollTimer);
        toc.scrollTimer = toc.setScrollTimer();
    });
    $(window).on('resize', () => {
        for (let i = 0; i < aArr.length; i++)
            toc.offsetHs[i + 1] = $($(aArr[i]).attr('href')).offset().top - 10;
        if (window.innerWidth <= 1200) toc.tocClose();
    });
};

function aArrHoverIn() {
    $(this).css('color', 'white');
}

function aArrHoverOut() {
    $(this).css('color', 'rgba(238, 238, 238, 0.664)');
    $(toc.aArr[toc.cur]).css('color', 'white');
}

function aArrClick() {
    toc.clickFlag = true;
    $('html, body').animate({
            'scrollTop': $($(this).attr('href')).offset().top + 'px'
        }, 400,
        "linear",
        () => toc.clickFlag = false
    );
    return false;
}