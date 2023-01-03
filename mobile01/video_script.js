// 새로 생성한 요소를 변수에 할당합니다
var $video_container = $('.kkt-video-player');
var $video_controls = $('.kkt-video-controls');
var $kkt_play_btn = $('.kkt-video-play');
var $kkt_video_seek = $('.kkt-video-seek');
var $kkt_video_timer = $('.kkt-video-timer');
var $kkt_volume = $('.kkt-volume-slider');
var $kkt_volume_btn = $('.kkt-volume-button');
var seeksliding = true;
//$video_controls.hide(); // 컨트롤은 숨겨둡니다

var gPlay = function() {
    if($gVideo.attr('paused') == false) {
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
            stop:function(e,ui){
                seeksliding = false;
                $gVideo.attr('currentTime', ui.value);
            }
        });
        $video_controls.show();
    } else {
        setTimeout(createSeek, 150);
    }
};

createSeek();

var gTimeFormat = function(seconds){
    var m = Math.floor(seconds / 60) < 10 ? '0' + Math.floor(seconds / 60) : Math.floor(seconds / 60);
    var s = Math.floor(seconds - (m * 60)) < 10 ? '0' + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
    return m + ':' + s;
};

var seekUpdate = function() {
    var currenttime = $gVideo.attr('currentTime');
    if(!seeksliding) $kkt_video_seek.slider('value', currenttime);
    $kkt_video_timer.text(gTimeFormat(currenttime));
};

$gVideo.bind('timeupdate', seekUpdate);

$kkt_volume.slider({
    value: 1,
    orientation: 'vertical',
    range: 'min',
    max: 1,
    step: 0.05,
    animate: true,
    slide:function(e,ui){
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