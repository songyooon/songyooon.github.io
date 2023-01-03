const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress_filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player_slider');

// video 클릭 이벤트 구현
video.addEventListener('click', togglePlay); 

//비디오 재생 및 일시 정지 기능 구현
function togglePlay() {
    // 비디오 재생 상태에 따른 메소드 호출
    const method = video.paused ? 'play' : 'pause';  
    video[method]();
}

//재생 및 일시정지 기능에 따른 아이콘 표시 토글
function updateButton() {
    const icon = this.paused ? '►' : '❚❚';
    toggle.textContent = icon;
}
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

//프로그레스바 이벤트 등록
function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}
video.addEventListener('timeupdate', handleProgress);

// 토글버튼 기능 이벤트 핸들러
toggle.addEventListener('click', togglePlay);  

//앞으로 가기 버튼 기능 구현
function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}
skipButtons.forEach((button) => button.addEventListener('click', skip));

//음량 조절 기능 구현
function handleRangeUpdate() {
    video[this.name] = this.value;
}
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

//프로그레스바 기능 구현
function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);