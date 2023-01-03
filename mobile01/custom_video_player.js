$.fn.gVideo = function(options) {
    // 요소 순회를 하기 전에 메인 옵션 빌드
    var defaults = {
        theme: 'simpledark',
        childtheme: '',
        target:''
    };
    var options = $.extend(defaults, options);
    var vdo = document.getElementById(options.target); 
    var $gVideo = $(this);
    // 매칭되는 요소를 찾아서 포맷 재설정
    return this.each(function() {
        $gVideo = $(this);
        // HTML 구조 생성
        // 메인 래퍼
        var $video_wrap = $('<div></div>').addClass('kkt-video-player').addClass(options.theme).addClass(options.childtheme);
        // 컨트롤 래퍼
        var $video_controls = $('<div class="kkt-video-controls"><a class="kkt-video-play" title="Play/Pause"></a><div class="kkt-video-seek"></div><div id="kkt-video-timer" class="kkt-video-timer">00:00</div><div class="kkt-volume-box"><div class="kkt-volume-slider"></div><a class="kkt-volume-button" title="Mute/Unmute"></a></div></div>');
        $gVideo.wrap($video_wrap);
        $gVideo.after($video_controls);

        var $video_container = $('.kkt-video-player');
        var $video_controls = $('.kkt-video-controls', $video_container);
        var $kkt_play_btn = $('.kkt-video-play', $video_container);
        var $kkt_video_seek = $('.kkt-video-seek', $video_container);
        var $kkt_video_timer = $('#kkt-video-timer');
        var $kkt_volume = $('.kkt-volume-slider', $video_container);
        var $kkt_volume_btn = $('.kkt-volume-button', $video_container);
        var seeksliding = false;
        //$video_controls.hide(); // 컨트롤은 숨겨둡니다
        var gPlay = function() {
            if(vdo.paused == false) {
                $gVideo[0].pause();
            } else {
                $gVideo[0].play();
            }
        };

        $kkt_play_btn.click(gPlay);
        $gVideo.click(gPlay);

        $gVideo.bind('play', function() {
            $kkt_play_btn.addClass('kkt-paused-button');
        });

        $gVideo.bind('pause', function() {
            $kkt_play_btn.removeClass('kkt-paused-button');
        });

        $gVideo.bind('ended', function() {
            $kkt_play_btn.removeClass('kkt-paused-button');
        });

        var createSeek = function() {
            if($gVideo.attr('readyState')) {
                var video_duration = $gVideo.attr('duration');
                $kkt_video_seek.slider({
                    value: 0,
                    step: 0.01,
                    orientation: 'horizontal',
                    range: 'min',
                    max: video_duration,
                    animate: true,
                    slide: function(){
                        seeksliding = true;
                    },
                    stop:function(e, ui){
                        seeksliding = false;
                        console.log(ui.value);
                        vdo.currentTime = ui.value;
                    }
                });
                $video_controls.show();
            } else {
                setTimeout(createSeek, 150);
            }
        };

        createSeek();

        var gTimeFormat = function(sec){
            var seconds = parseInt(sec);
            var m = Math.floor(seconds / 60) < 10 ? '0' + Math.floor(seconds / 60) : Math.floor(seconds / 60);
            var s = Math.floor(seconds - (m * 60)) < 10 ? '0' + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
            return m + ':' + s;
        };

        var seekUpdate = function() {
            var current = Math.floor(vdo.currentTime);
            if(!seeksliding) $kkt_video_seek.slider('value', current);
            $kkt_video_timer.text(gTimeFormat(current));
        };

        $gVideo.bind('timeupdate', seekUpdate);

        $kkt_volume.slider({
            value: 1,
            orientation: 'vertical',
            range: 'min',
            min: 0,
            max: 1,
            step: 0.05,
            animate: true,
            change:function(e, ui){
                video_volume = ui.value;
                $gVideo.attr('volume', ui.value);
            },
            slide:function(e, ui){
                $gVideo.attr('muted', false);
                video_volume = ui.value;
                $gVideo.attr('volume', ui.value);
            }
        });

        var muteVolume = function() {
            if($gVideo.attr('muted')==true) {
                $gVideo.attr('muted', false);
                $kkt_volume.slider('value', video_volume);

                $kkt_volume_btn.removeClass('kkt-volume-mute');
            } else {
                $gVideo.attr('muted', true);
                $kkt_volume.slider('value', '0');

                $kkt_volume_btn.addClass('kkt-volume-mute');
            };
        };

        $kkt_volume_btn.click(muteVolume);
    });
};