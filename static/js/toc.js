let isTocOpen = false;
let toc;

function TocElement(li, a, header) {
    this.li = li;
    this.a = a;
    this.headerOffsetTop = header.offset().top;
}

TocElement.prototype = {
    constructor: TocElement,
    updateHeaderOffsetTop: (obj) => {
        if (obj.a !== undefined)
            obj.headerOffsetTop = $(obj.a.attr('href')).offset().top;
    }
}

function tocInit() {
    toc = {
        'isAnchorClicked': false,
        'sideToc': $('#sidetoc'),
        'switchButton': $('#tocbtn'),
        'elements': [],
        'curAnchorIdx': 1,
        'lightAnchorTimer': undefined,
        'updateHeaderOffsetTopTimer': undefined,
        'isOpen': () => toc.sideToc.css('visibility') !== 'hidden',
        'open': () => {
            toc.switchButton.css('right', '100px');
            toc.sideToc.css({
                'visibility': 'visible',
                'opacity': 1,
                'maxHeight': '1000px',
            });
            setTimeout(() => toc.lightAnchor($(window).scrollTop()), 500);
        },
        'close': () => {
            toc.switchButton.css('right', '0px');
            toc.sideToc.css({
                'visibility': 'hidden',
                'opacity': 0,
                'maxHeight': '0px',
            });
        },
        'toggle': () => toc.isOpen() ? toc.close() : toc.open(),
        'lightAnchor': (scrollTop) => {
            let oldAnchorIdx = toc.curAnchorIdx;

            if (scrollTop >= toc.elements[toc.elements.length - 1].headerOffsetTop) {
                if (!toc.isAnchorClicked)
                    toc.curAnchorIdx = toc.elements.length - 1;
            } else if (scrollTop <= toc.elements[0].headerOffsetTop) {
                toc.curAnchorIdx = 1;
            } else {
                for (let i = 1; i < toc.elements.length; i++) {
                    if (scrollTop >= toc.elements[i - 1].headerOffsetTop &&
                        scrollTop < toc.elements[i].headerOffsetTop) {
                        if (!toc.isAnchorClicked)
                            toc.curAnchorIdx = i - 1 <= 0 ? 1 : i - 1;
                    }
                }
            }

            toc.elements[oldAnchorIdx].a.css('color', 'rgba(238, 238, 238, 0.664)');
            toc.elements[toc.curAnchorIdx].a.css('color', 'white');

            // plus 1 to prevent float number round down
            let liTop = toc.elements[toc.curAnchorIdx].li.offset().top + 1;
            let tocTop = toc.sideToc.offset().top;
            if (liTop <= tocTop || liTop >= tocTop + toc.sideToc.height()) {
                toc.sideToc.animate({
                    scrollTop: '+=' + (liTop - tocTop) + 'px',
                }, 400, 'linear');
            }
        },
        'setUpdateHeaderOffsetTopTimer': () => {
            toc.updateHeaderOffsetTopTimer = setTimeout(() => {
                toc.elements.forEach((e) => e.updateHeaderOffsetTop(e));
                toc.setUpdateHeaderOffsetTopTimer();
            }, 800);
        }
    }

    let ul = $('#TableOfContents > ul');
    let headers = $(':header')
    let curLevel = 2; // begin header level, h2

    // h1
    toc.elements.push(new TocElement(undefined, undefined, $(headers[0])));

    // exclude last one, which is toc's header
    for (let i = 1; i < headers.length - 1; i++) {
        let level = $(headers[i]).prop('tagName')[1];
        if (level > curLevel) {
            do {
                newUl = $('<ul></ul>');
                ul.children().last().append(newUl);
                ul = newUl;
                curLevel++;
            } while (level > curLevel);
        } else if (level < curLevel) {
            do {
                ul = ul.parent().parent();
                curLevel--;
            } while (curLevel > level);
        }

        let li = $('<li></li>');
        li.attr('id', 'toc-li');
        ul.append(li);

        let a = $('<a></a>');
        li.append(a);
        a.attr('href', '#' + $(headers[i]).attr('id'));
        a.text($(headers[i]).text());

        toc.elements.push(new TocElement(li, a, $(headers[i])));
    }

    let sideToc = toc.sideToc;
    let i = sideToc.find('header').innerHeight() +
        sideToc.find('nav').innerHeight();
    if (sideToc.innerHeight() > i)
        sideToc.css('height', i + 30 + 'px');

    // initialize events
    toc.switchButton.click(toc.toggle);
    toc.elements.forEach((e) => {
        if (e.a === undefined) return;
        e.a.hover(
            () => e.a.css('color', 'white'),
            () => {
                e.a.css('color', 'rgba(238, 238, 238, 0.664)');
                toc.elements[toc.curAnchorIdx].a.css('color', 'white');
            });
    });
    toc.elements.forEach((e) => {
        if (e.a === undefined) return;
        e.a.click(() => {
            toc.isAnchorClicked = true;
            $('html, body').animate(
                // plus 1 to prevent float number round down
                {
                    'scrollTop': $(e.a.attr('href')).offset().top + 1 + 'px',
                },
                400,
                'linear',
                () => toc.isAnchorClicked = false
            );
            return false;
        });
    });
    // reset header offset top
    toc.setUpdateHeaderOffsetTopTimer();
    // hide toc when body width too small
    if (document.body.clientWidth <= 1400) toc.close();

    $(window).on('scroll', () => {
        clearTimeout(toc.lightAnchorTimer);
        toc.lightAnchorTimer = setTimeout(
            () => toc.lightAnchor($(window).scrollTop()), 500
        );
    });
    $(window).on('resize', () => {
        clearTimeout(toc.updateHeaderOffsetTopTimer);
        toc.setUpdateHeaderOffsetTopTimer();
        if (document.body.clientWidth <= 1400 && toc.isOpen()) toc.close();
    })
}