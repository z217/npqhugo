let toc;
let tocFlag = true;

function tocInit() {
    let ul = $('#TableOfContents > ul');
    let headers = $(':header');
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
        ul.append('<li><a href="#' + $(headers[i]).attr('id') + '">' + $(headers[i]).text() + '</a></li>');
    }

    toc = {
        'clickFlag': false,
        'offsetHs': [0],
        'aArr': $('#sidetoc a'),
        'sideToc': $('#sidetoc'),
        'tocBtn': $('#tocbtn'),
        'cur': 0,
        'scrollTimer': undefined,
        'setScrollTimer': function () {
            setTimeout(() => {
                toc.lightAnchor($(window).scrollTop());
            }, 300);
        },
        'lightAnchor': function (scrollTop) {
            if (scrollTop >= toc.offsetHs[toc.offsetHs.length - 1]) {
                if (!toc.clickFlag)
                    toc.cur = toc.aArr.length - 1;
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
            let top = $(toc.aArr[toc.cur]).position().top;
            if (top > toc.sideToc.height() || top < 0) {
                toc.sideToc.animate({
                        scrollTop: top + "px"
                    }, 400,
                    "linear");
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
        }
    };

    let sideToc = toc.sideToc;
    let aArr = toc.aArr;
    // 调整导航栏高度
    if (sideToc.length > 0) {
        let i = sideToc.find("header").innerHeight() + sideToc.find("nav").innerHeight();
        if (sideToc.innerHeight() > i) {
            sideToc.css('height', i + 30 + 'px');
        }
    }
    // 记录标题高度
    for (let i = 0; i < aArr.length; i++)
        toc.offsetHs.push($($(aArr[i]).attr('href')).offset().top - 10);
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
        toc.setScrollTimer();
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