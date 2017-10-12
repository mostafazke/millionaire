(function ($) {
    let $this = $(this),
        ino = 0,
        score = 0,
        isM = false,
        audioElem = document.getElementById('sound'),
        asks = [],
        monyArr = ['0', '100', '200', '300', '500', '1,000', '2,000', '4,000', '8,000', '16,000', '32,000', '64,000', '125,000', '250,000', '500,000', '1,000,000'],
        monyNamArr = [
            'Zero',
            'One Hundred',
            'Tow Hundred',
            'Three Hundred',
            'Five Hundred',
            'One Thousand',
            'Tow Thousand',
            'Four Thousand',
            'Eight Thousand',
            'Sixteen Thousand',
            'Thirty Tow Thousand',
            'Sixty Four Thousand',
            'One Hundred and Twenty Five Thousand',
            'Tow Hundred and  Fifty Thousand',
            'Five Hundred Thousand',
            'One Milion'
        ],
        i,
        j;

    function isSupported(audio) {
        let extension = '';
        if (audio.canPlayType("audio/mp3") == "probably" || audio.canPlayType("audio/mp3") == "maybe") {
            extension = '.mp3';
        } else if (audio.canPlayType("audio/ogg") == "probably" || audio.canPlayType("audio/ogg") == "maybe") {
            extension = '.ogg';
        } else if (audio.canPlayType("audio/wav") == "probably" || audio.canPlayType("audio/wav") == "maybe") {
            extension = '.wav';
        }
        return extension;
    }

    function startSound(src, loop) {
        let audioType = isSupported(audioElem);
        audioElem.setAttribute('src', 'sound/' + src + audioType);
        audioElem.oncanplay = function () {
            audioElem.loop = loop;
            audioElem.play();
        };
    }

    function getQuest() {
        let choose = asks[ino].content;
        choose.sort(function (a, b) {
            return 0.5 - Math.random();
        });
    }

    function fetchQuest() {
        getQuest();
        $('.money').text('$' + monyArr[ino]);
        let time = 30;
        $('h2').html(asks[ino].question);
        $('.answer').each(function (i) {
            $this = $(this);
            $this.parent().addClass('hover').removeClass('correct false disable suggest unsuggest unsuggest-1 unsuggest-2');
            $('.option').removeClass('disable');
            $this.html(asks[ino].content[i]);
        });
        if (ino < 5) {
            startSound('level_1', true);
        } else if (ino >= 5 && ino < 10) {
            startSound('level_2', true);
        } else if (ino >= 10 && ino < 15) {
            startSound('level_3', true);
        }
        if (ino < 5) {
            $('.time').text(time);
        }
        let timing = setInterval(function () {
            if (ino <= 4) {
                if (time !== 0) {
                    time--;
                    $('.time').text(time);
                } else {
                    startSound('wrong_answer_end_time', false);
                    clearInterval(timing);
                    if (ino < 5) {
                        ino = 0;
                    } else if (ino > 5 && ino < 10) {
                        ino = 5;
                    } else if (ino > 10 && ino < 15) {
                        ino = 10;
                    }
                    endGame();
                }
            } else {
                clearInterval(timing);
                $('.time').text('');
            }
        }, 1000);
        $('.option, .answer, .exit').on('click', function () {
            clearInterval(timing);
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode === 65 || e.keyCode === 66 || e.keyCode === 67 || e.keyCode === 68 || e.keyCode === 79) {

                clearInterval(timing);

            }
        });
    }

    function money() {
        $('.startup .logo').append('<input type="text" class="name" placeholder="enter your signature" /><buttun class="getName">Enter</buttun></form>');

        function downCanva(link, canvaId, fileName) {
            link.href = document.getElementById(canvaId).toDataURL();
            link.download = fileName;
        }
        $('.getName').on('click', function () {
            let namVal = $('.name').val();
            if (namVal) {
                var arr = namVal.split(' ');
                for (i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
                }

                namVal = arr.join(' ');
                $('.startup .logo').empty();
                $('.startup .logo').append('<canvas id="canvas"></canvas><a href="#" id="download">Download</a>');
                (function draw() {
                    let canvas = document.getElementById('canvas'),
                        ctx = canvas.getContext('2d'),
                        date = new Date().toDateString();
                    canvas.height = 250;
                    canvas.width = 500;
                    ctx.mozImageSmoothingEnabled = false;
                    ctx.webkitImageSmoothingEnabled = false;
                    ctx.msImageSmoothingEnabled = false;
                    ctx.imageSmoothingEnabled = false;
                    let img = new Image();
                    img.onload = function () {
                        ctx.drawImage(img, 0, 0, 500, 250);
                        ctx.font = "32px angelina";
                        ctx.fillStyle = "#05398f";
                        ctx.fillText(namVal, 105, 105);
                        ctx.font = "32px angelina";
                        ctx.fillStyle = "#05398f";
                        ctx.fillText(monyNamArr[ino], 75, 135);
                        ctx.font = "22px angelina";
                        ctx.fillStyle = "#05398f";
                        ctx.fillText(date, 290, 60);
                        ctx.font = "22px angelina";
                        ctx.fillStyle = "#05398f";
                        ctx.fillText(monyArr[ino], 405, 105);
                    };
                    img.src = 'img/check-template.png';
                    $('#download').on('click', function () {
                        downCanva(this, 'canvas', '' + namVal + '.png');
                    });
                })();
                startSound('end_long', true);
                $('.startup').removeClass('end');
            }
        });
    }

    function fiftyFifty($this) {
        if (!$this.hasClass('checked')) {
            if (!$this.siblings().hasClass('clicked')) {
                let one,
                    tow;
                startSound('joker_1', false);
                $this.addClass('checked clicked');
                setTimeout(function () {
                    startSound('50_50_joker', false);
                    switch ($("<div>").html(asks[ino].correct).text()) {
                        case $('.answer:eq(0)').text():
                            one = [1, 2, 3][Math.floor(Math.random() * 3)];
                            tow = [1, 2, 3][Math.floor(Math.random() * 3)];
                            while (one === tow) {
                                tow = [1, 2, 3][Math.floor(Math.random() * 3)];
                            }
                            $('.answer:eq(' + one + '), .answer:eq(' + tow + ')').text('').parent().addClass('disable').removeClass('hover');
                            break;
                        case $('.answer:eq(1)').text():
                            one = [0, 2, 3][Math.floor(Math.random() * 3)];
                            tow = [0, 2, 3][Math.floor(Math.random() * 3)];
                            while (one === tow) {
                                tow = [0, 2, 3][Math.floor(Math.random() * 3)];
                            }
                            $('.answer:eq(' + one + '), .answer:eq(' + tow + ')').text('').parent().addClass('disable').removeClass('hover');
                            break;
                        case $('.answer:eq(2)').text():
                            one = [0, 1, 3][Math.floor(Math.random() * 3)];
                            tow = [0, 1, 3][Math.floor(Math.random() * 3)];
                            while (one === tow) {
                                tow = [0, 1, 3][Math.floor(Math.random() * 3)];
                            }
                            $('.answer:eq(' + one + '), .answer:eq(' + tow + ')').text('').parent().addClass('disable').removeClass('hover');
                            break;
                        case $('.answer:eq(3)').text():
                            one = [0, 1, 2][Math.floor(Math.random() * 3)];
                            tow = [0, 1, 2][Math.floor(Math.random() * 3)];
                            while (one === tow) {
                                tow = [0, 1, 2][Math.floor(Math.random() * 3)];
                            }
                            $('.answer:eq(' + one + '), .answer:eq(' + tow + ')').text('').parent().addClass('disable').removeClass('hover');
                            break;
                    }
                    $this.removeClass('clicked');
                }, 2000);
            }
        }
    }

    function call($this) {
        if (!$this.hasClass('checked')) {
            if (!$this.siblings().hasClass('clicked')) {
                startSound('joker_2', false);
                $this.addClass('checked clicked');
                setTimeout(function () {
                    startSound('telephone_joker_call', false);
                    setTimeout(function () {
                        startSound('telephone_joker_start', false);
                        setTimeout(function () {
                            startSound('telephone_joker_loop', true);
                            setTimeout(function () {
                                startSound('telephone_joker_end', false);
                                $('.answer:contains("' + $("<div>").html(asks[ino].correct).text() + '")').parent().addClass('suggest');
                                $this.removeClass('clicked');
                            }, 5000);

                        }, 800);
                    }, 4000);

                }, 1000);
            }
        }
    }

    function audience($this) {
        if (!$this.hasClass('checked')) {
            if (!$this.siblings().hasClass('clicked')) {
                startSound('joker_3', false);
                $this.addClass('checked clicked');
                setTimeout(function () {
                    startSound('audience_joker_start', false);
                    setTimeout(function () {
                        startSound('audience_joker_loop', true);
                        setTimeout(function () {
                            startSound('audience_joker_end', false);
                            $('.answer:contains("' + $("<div>").html(asks[ino].correct).text() + '")').parent().addClass('suggest').siblings().not('span, .hr-container, .clear').addClass('unsuggest');
                            $('.unsuggest').first().addClass('unsuggest-1').removeClass('unsuggest');
                            $('.unsuggest').last().addClass('unsuggest-2').removeClass('unsuggest');
                            $(".answer:empty").parent().removeClass('unsuggest unsuggest-1 unsuggest-2');
                            $this.removeClass('clicked');
                        }, 5000);
                    }, 1000);
                }, 1000);
            }
        }
    }

    function startGame() {
        ino = 0;
        startSound('start_game', false);
        $('.info-section').hide();
        $('.startup').removeClass('show end').addClass('hide');
        $('.game').removeClass('hide').addClass('show');
        $('.option').removeClass('checked');
        $('.startup .logo').empty();
        asks = [];
        for (i = 0; i < 3; i++) {
            questions[i].sort(function (a, b) {
                return 0.5 - Math.random();
            });
            for (j = 0; j < 5; j++) {
                asks.push(questions[i][j]);
            }
        }
        fetchQuest();
    }

    function endGame() {
        if (ino === 0) {
            startSound('end_no_mony', false);
        } else {
            startSound('end', false);
        }
        $('.info-section').hide();
        $('.startup').removeClass('hide').addClass('show end');
        $('.game').removeClass('show').addClass('hide');
        money();
        $('.name').focus();
    }

    function transition() {
        $('h2').text('');
        $('.time').text('');
        $('.answer').each(function (i) {
            $this = $(this);
            $this.parent().addClass('hover').removeClass('correct false suggest unsuggest unsuggest-1 unsuggest-2');
            $this.text('');
        });
    }

    function correctAnswer($this) {
        if (ino < asks.length - 1) {
            setTimeout(function () {
                if (ino < 4) {
                    startSound('correct_answer_lvl_1', false);
                } else if (ino >= 4 && ino < 9) {
                    startSound('correct_answer_lvl_2', false);
                } else if (ino >= 9 && ino < 14) {
                    startSound('correct_answer_lvl_3', false);
                } else if (ino === 14) {
                    startSound('correct_answer_lvl_3_last_question', false);
                }
                $this.parent().removeClass('wait').addClass('correct');
            }, 100);
            if (ino < 4) {
                setTimeout(function () {
                    ino++;
                    fetchQuest();
                }, 2000);
            } else if (ino >= 4 && ino < 9) {
                setTimeout(function () {
                    startSound('transition_after_level_2', false);
                    transition();
                }, 4000);
                setTimeout(function () {
                    ino++;
                    fetchQuest();
                }, 8000);
            } else if (ino >= 9 && ino < 15) {
                setTimeout(function () {
                    startSound('transition_after_level_3', false);
                    transition();
                }, 5000);
                setTimeout(function () {
                    ino++;
                    fetchQuest();
                }, 9000);
            } else if (ino === 15) {
                setTimeout(function () {
                    ino++;
                    fetchQuest();
                }, 3000);
            }
        } else {
            setTimeout(function () {
                startSound('correct_answer_win', false);
                $this.parent().removeClass('wait').addClass('correct');
            }, 100);
            setTimeout(function () {
                ino++;
                endGame();
            }, 15000);
        }
    }

    function wrongAnswer($this) {
        setTimeout(function () {
            startSound('wrong_answer', false);
            $this.parent().removeClass('wait').addClass('false');
        }, 100);
        setTimeout(function () {
            $this.parent().removeClass('false');
            $('.answer:contains(' + $("<div>").html(asks[ino].correct).text() + ')').parent().removeClass('wait').addClass('correct');
        }, 1000);
        setTimeout(function () {
            if (ino < 5) {
                ino = 0;
            } else if (ino > 5 && ino < 10) {
                ino = 5;
            } else if (ino > 10 && ino < 15) {
                ino = 10;
            }
            endGame();
        }, 3000);
    }

    function checkAnswer($this) {
        startSound('logged_in_start', false);
        $this.parent().removeClass('hover suggest unsuggest').addClass('wait');
        $('.answer').parent().addClass('disable');
        $('.option').addClass('disable');
        setTimeout(function () {
            if ($this.text() === $("<div>").html(asks[ino].correct).text()) {
                correctAnswer($this);
            } else {
                wrongAnswer($this);
            }
        }, 2000);
    }

    function gameInfo() {
        $('.startup .logo').empty();
        $('.startup').addClass('enter-info');
        $('.buttuns').hide();
        $('.info-section').show();
        startSound('rules', true);
        $('.money-list').addClass('fadit');
        let i = 15,
            opt = 0;
        let clring = setInterval(function () {
            if (i !== 0) {
                i--;
                $('.money-list li:eq("' + i + '")').css('background', '#49a942').siblings().css('background', 'transparent');
            } else {
                clearInterval(clring);
                $('.info-section .chek').addClass('fadit');
                $('.money-list').removeClass('fadit');
                $('.money-list li').css('background', 'transparent');
                let chik = setInterval(function () {
                    $('.info-section .chek').removeClass('fadit');
                    $('.info-section .options').addClass('fadit');
                }, 2500);
                setTimeout(function () {

                    let opting = setInterval(function () {
                        clearInterval(chik);
                        if (opt !== 3) {
                            $('.info-section .options .option:eq("' + opt + '")').css('transform', 'scale(1.5)').siblings().css('transform', 'scale(1)');
                            opt++;
                        } else {
                            clearInterval(opting);
                            $('.info-section .options .option').css('transform', 'scale(1)')
                            $('.info-section .options').removeClass('fadit');
                            startSound('intro', true);
                            $('.startup').removeClass('enter-info');
                            $('.buttuns').show();
                        }
                    }, 1000);
                }, 2500);
            }
        }, 500);
    }

    $(document).ready(function () {
        startSound('intro', true);
        $('.start').on('click', function () {
            startGame();
        });
        $('.info').on('click', function () {
            gameInfo();
        });
        $('.game .exit').on('click', function () {
            startSound('end_player_leave', false);
            endGame();
        });
        $('.answer').on('click', function () {
            let elm = $('.answer').parent();
            let $this = $(this);
            if (!$this.parent().hasClass('disable')) {
                if (!elm.hasClass('wait') && !elm.hasClass('correct') && !elm.hasClass('false')) {
                    checkAnswer($this);
                }
            }
        });
        $('.fifty').on('click', function () {
            let $this = $(this);
            if (!$this.hasClass('disable')) {
                fiftyFifty($this);
            }
        });
        $('.call').on('click', function () {
            let $this = $(this);
            if (!$this.hasClass('disable')) {
                call($this);
            }
        });
        $('.aud').on('click', function () {
            let $this = $(this);
            if (!$this.hasClass('disable')) {
                audience($this);
            }
        });
        $(document).on('keyup', function (e) {
            if ($('.startup').hasClass('show') && !$('.startup').hasClass('end') && !$('.startup').hasClass('enter-info')) {
                if (e.keyCode === 73) {
                    $('.info').click();
                }
            }
            if ($('.startup').hasClass('show') && !$('.startup').hasClass('end') && !$('.startup').hasClass('enter-info')) {
                if (e.keyCode === 13) {
                    $('.start').click();
                }
            }
            if ($('.startup').hasClass('show') && $('.startup').hasClass('end')) {
                if (e.keyCode === 13) {
                    $('.getName').click();
                }
            }
            if ($('.game').hasClass('show')) {
                let elm = $('.answer').parent();
                let $this = $(this);
                if (!$this.parent().hasClass('disable')) {
                    if (!elm.hasClass('wait') && !elm.hasClass('correct') && !elm.hasClass('false')) {
                        if (e.keyCode === 65) {
                            $('.answer:eq(0)').click();
                        } else if (e.keyCode === 66) {
                            $('.answer:eq(1)').click();
                        } else if (e.keyCode === 67) {
                            $('.answer:eq(2)').click();
                        } else if (e.keyCode === 68) {
                            $('.answer:eq(3)').click();
                        } else if (e.keyCode === 77) {
                            isM = true;
                        } else if (e.keyCode === 79) {
                            if (isM) {
                                $this = $('.answer:contains(' + $("<div>").html(asks[ino].correct).text() + ')');
                                correctAnswer($this);
                                isM = false;
                            }
                        }
                    }
                }
            }
        });
    });
}(jQuery));