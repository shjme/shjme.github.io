  // 粒子背景初始化
  function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 粒子数组
    const particles = [];
    const particleCount = 150;
    const colors = ['#6a11cb', '#2575fc', '#ff3e7f', '#2af598'];
    
    // 粒子类
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // 边界反弹
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
        }
    }
    
    // 创建粒子
    function createParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // 动画循环
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // 粒子连线
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = particles[i].color;
                    ctx.globalAlpha = 0.1 * (1 - distance/100);
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    // 窗口大小调整
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    createParticles();
    animateParticles();
}

// 3D盒子拖拽旋转
function initDraggableBox() {
    const box = document.querySelector('.floating-box');
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };
    let rotation = {
        x: 15, // 初始x轴旋转角度
        y: 25  // 初始y轴旋转角度
    };
    
    // 自动旋转动画
    let autoRotateInterval;
    
    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            rotation.y += 0.5;
            box.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
        }, 50);
    }
    
    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }
    
    // 初始启动自动旋转
    startAutoRotate();

    // 鼠标按下事件
    box.addEventListener('mousedown', function(e) {
        isDragging = true;
        stopAutoRotate();
        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
        box.style.cursor = 'grabbing';
    });

    // 鼠标移动事件
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        // 更新旋转角度
        rotation.y += deltaMove.x * 0.5;
        rotation.x -= deltaMove.y * 0.5;

        // 应用旋转
        box.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;

        // 更新鼠标位置
        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    });

    // 鼠标释放事件
    document.addEventListener('mouseup', function() {
        isDragging = false;
        box.style.cursor = 'grab';
        
        // 如果没有拖动，重新开始自动旋转
        if (!isDragging) {
            startAutoRotate();
        }
    });

    // 鼠标离开事件
    document.addEventListener('mouseleave', function() {
        isDragging = false;
        box.style.cursor = 'grab';
        
        // 如果没有拖动，重新开始自动旋转
        if (!isDragging) {
            startAutoRotate();
        }
    });

    // 初始化鼠标样式
    box.style.cursor = 'grab';
}

// 图片轮播
function initGalleryPreview() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    // 每5秒切换一次图片
    setInterval(nextSlide, 5000);
    
    // 添加详细信息按钮点击事件
    const detailButtons = document.querySelectorAll('.view-detail');
    detailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const detailType = this.getAttribute('data-detail');
            openDetailModal(detailType);
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // 激活当前区域的动画
    function activateSection() {
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY > (sectionTop - window.innerHeight + 200)) {
                section.classList.add('active');
            }
        });
        
        // 显示/隐藏返回顶部按钮
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // 返回顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 导航联动
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            // 添加当前活动状态
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // 平滑滚动到目标区域
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // 监听滚动事件
    window.addEventListener('scroll', activateSection);
    
    // 初始化标题动画
    const titleParts = document.querySelectorAll('.title-part');
    titleParts.forEach((part, index) => {
        setTimeout(() => {
            part.style.opacity = 1;
            part.style.transform = 'translateY(0)';
        }, 300 * index);
    });

    // 添加英雄区按钮事件
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            if (buttonText.includes('Explore Performances')) {
                // 滚动到Performances部分
                const videosSection = document.getElementById('videos');
                window.scrollTo({
                    top: videosSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 更新导航激活状态
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#videos') {
                        link.classList.add('active');
                    }
                });
            } else if (buttonText.includes('Learn More')) {
                // 滚动到Biography部分
                const aboutSection = document.getElementById('about');
                window.scrollTo({
                    top: aboutSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 更新导航激活状态
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#about') {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// 弹窗功能
function initModals() {
    // 详细信息数据
    const detailData = {
        journey: {
            title: "Artistic Journey",
            content: `
                <div class="work-details">
                    <div class="work-image">
                        <img src="img/slide_1.jpg" alt="Artistic Journey">
                    </div>
                    <div class="work-description">
                        <h3>From Inner Mongolia to International Stages</h3>
                        <p>Huijie Sun's artistic journey represents a fascinating blend of Eastern and Western musical traditions. Her upbringing in Inner Mongolia provided her with a unique cultural perspective that informs her interpretations of classical Western repertoire.</p>
                        
                        <p>Her vocal technique combines the precision and clarity valued in Western operatic tradition with the emotional expressivity characteristic of her cultural heritage. This fusion creates performances that are technically impressive while maintaining an authentic emotional core.</p>
                        
                        <p>Sun's approach to character development draws on her multicultural background, allowing her to bring nuanced interpretations to roles from diverse historical and cultural contexts. Her performances are noted for their psychological depth and emotional honesty.</p>
                    </div>
                </div>
            `
        },
        roles: {
            title: "Role Performances",
            content: `
                <div class="work-details">
                    <div class="work-image">
                        <img src="img/Lady Murasaki-1.jpg" alt="As Lady Murasaki">
                    </div>
                    <div class="work-description">
                        <h3>Lady Murasaki in <em>Murasaki's Moon</em></h3>
                        <p>Composed by Michi Wiancko with libretto by Deborah Brevoort, this contemporary opera explores the life of Lady Murasaki Shikibu, the 11th-century Japanese novelist who wrote "The Tale of Genji."</p>
                        
                        <p>Sun's interpretation of Lady Murasaki highlighted the character's intellectual brilliance and emotional complexity. The role demands both vocal agility and dramatic depth, as it portrays a woman navigating the constraints of her time while creating one of the world's first novels.</p>
                        
                        <p>The production at Hub City Opera and Dance received critical acclaim, with Sun's performance noted for its "elegant phrasing and emotional authenticity" that brought this historical figure to vivid life.</p>
                    </div>
                </div>
                
                <div class="work-details">
                    <div class="work-image">
                        <img src="img/as Prince-1.jpg" alt="As Prince Orlovsky">
                    </div>
                    <div class="work-description">
                        <h3>Prince Orlovsky in <em>Die Fledermaus</em></h3>
                        <p>Johann Strauss II's beloved operetta features Prince Orlovsky, a wealthy Russian aristocrat suffering from ennui who hosts an elaborate ball where much of the opera's action takes place.</p>
                        
                        <p>This trouser role showcases Sun's versatility as both a vocalist and actress. The character's famous aria "Chacun à son goût" requires technical precision while conveying the prince's world-weary yet playful personality.</p>
                        
                        <p>In her 2024 performance at Peabody Opera, Sun brought a charismatic presence to the role, balancing aristocratic bearing with comedic timing, and executing the challenging vocal passages with apparent ease.</p>
                    </div>
                </div>
            `
        },
        education: {
            title: "Educational Background",
            content: `
                <div class="work-details">
                    <div class="work-image">
                        <img src="img/opera.jpg" alt="Performance at Peabody">
                    </div>
                    <div class="work-description">
                        <h3>Peabody Institute of Johns Hopkins University</h3>
                        <p>Sun's training at the prestigious Peabody Institute represents a significant chapter in her artistic development. Studying under acclaimed mezzo-sopranos Denyce Graves and Margaret Baroody, she refined her vocal technique and expanded her repertoire.</p>
                        
                        <p>The Graduate Performance Diploma program at Peabody provided intensive training in vocal technique, language proficiency, acting, and movement—all essential components for an operatic career. This comprehensive approach to performer training has equipped Sun with the versatility required of contemporary opera singers.</p>
                        
                        <p>During her time at Peabody, Sun participated in numerous masterclasses with industry professionals, gaining valuable insights into both the artistic and professional aspects of an operatic career. These experiences helped shape her approach to role preparation and performance practice.</p>
                    </div>
                </div>
            `
        }
    };
    
    // 图库数据
    const galleryData = {
        portraits: {
            title: "Portrait Collection",
            images: [
                {
                    src: 'img/floralpro-1.JPG',
                    thumb: 'img/floralpro-1.JPG',
                    caption: 'Floral portrait session showcasing Huijie\'s artistic presence and elegant expression.'
                },
                {
                    src: 'img/1_main.jpg',
                    thumb: 'img/1_main.jpg',
                    caption: 'Studio portrait highlighting Huijie\'s expressive performance quality.'
                },
                {
                    src: 'img/1_withred_2.jpg',
                    thumb: 'img/1_withred_2.jpg',
                    caption: 'Dramatic portrait with red accent, capturing the emotional depth essential to operatic performance.'
                },
                {
                    src: 'img/1_withred_3.jpg',
                    thumb: 'img/1_withred_3.jpg',
                    caption: 'Artistic portrait emphasizing the connection between visual and musical expression.'
                }
            ]
        },
        opera: {
            title: "Opera Performances",
            images: [
                {
                    src: 'img/Lady Murasaki-1.jpg',
                    thumb: 'img/Lady Murasaki-1.jpg',
                    caption: 'As Lady Murasaki in "Murasaki\'s Moon" at Hub City Opera and Dance.'
                },
                {
                    src: 'img/Huije Sun as Lady Murasaki.jpg',
                    thumb: 'img/Huije Sun as Lady Murasaki.jpg',
                    caption: 'Performance scene from "Murasaki\'s Moon", showcasing period costume and dramatic presence.'
                },
                {
                    src: 'img/opera.jpg',
                    thumb: 'img/opera.jpg',
                    caption: 'Opera performance highlighting Huijie\'s stage presence and dramatic abilities.'
                }
            ]
        },
        concerts: {
            title: "Concert Highlights",
            images: [
                {
                    src: 'img/as Prince-1.jpg',
                    thumb: 'img/as Prince-1.jpg',
                    caption: 'As Prince Orlovsky in "Die Fledermaus" at Peabody Opera in Baltimore.'
                },
                {
                    src: 'img/Huijie Sun as Prince.jpg',
                    thumb: 'img/Huijie Sun as Prince.jpg',
                    caption: 'Full costume performance as Prince Orlovsky, demonstrating character embodiment.'
                },
                {
                    src: 'img/conecrt hall.jpg',
                    thumb: 'img/conecrt hall.jpg',
                    caption: 'Recital performance at Peabody Institute concert hall.'
                }
            ]
        }
    };
    
    // 视频数据 - YouTube嵌入链接
    const videoData = {
        1: 'https://www.youtube.com/embed/M3NS_LamEDs',
        2: 'https://www.youtube.com/embed/CMEX-Zk7eTM',
        3: 'https://www.youtube.com/embed/bu1mLrZL-dQ'
    };
    
    // 图库弹窗元素
    const imageModalOverlay = document.getElementById('image-modal-overlay');
    const modalImage = document.getElementById('modal-image');
    const galleryThumbnails = document.getElementById('gallery-thumbnails');
    const modalClose = document.querySelectorAll('.modal-close, .video-close');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // 详细信息弹窗元素
    const detailModalOverlay = document.getElementById('detail-modal-overlay');
    const detailTitle = document.getElementById('detail-title');
    const detailContent = document.getElementById('detail-content');
    
    // 当前图库和图片索引
    let currentGallery = '';
    let currentImageIndex = 0;
    
    // 打开图库弹窗
    const viewGalleryButtons = document.querySelectorAll('.view-gallery');
    viewGalleryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const galleryType = this.getAttribute('data-gallery');
            openGallery(galleryType);
        });
    });
    
    // 打开图库函数
    function openGallery(galleryType) {
        currentGallery = galleryType;
        currentImageIndex = 0;
        
        const gallery = galleryData[galleryType];
        
        // 设置主图（添加渐显动画）
        modalImage.src = gallery.images[0].src;
        modalImage.classList.remove('fade-in');
        
        // 使用setTimeout确保过渡效果正常工作
        setTimeout(() => {
            modalImage.classList.add('fade-in');
        }, 50);
        
        // 生成缩略图
        galleryThumbnails.innerHTML = '';
        gallery.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `gallery-thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${image.thumb}" alt="Thumbnail ${index + 1}">`;
            
            thumbnail.addEventListener('click', () => {
                currentImageIndex = index;
                updateGalleryImage();
            });
            
            galleryThumbnails.appendChild(thumbnail);
        });
        
        // 添加关闭按钮
        if (!document.querySelector('.gallery-close')) {
            const closeBtn = document.createElement('div');
            closeBtn.className = 'gallery-close';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.addEventListener('click', () => {
                imageModalOverlay.classList.remove('active');
            });
            document.querySelector('.gallery-modal').appendChild(closeBtn);
        }
        
        // 显示弹窗
        imageModalOverlay.classList.add('active');
    }
    
    // 更新图库图片
    function updateGalleryImage() {
        const gallery = galleryData[currentGallery];
        const image = gallery.images[currentImageIndex];
        
        // 更新主图（添加渐显动画）
        modalImage.classList.remove('fade-in');
        
        setTimeout(() => {
            modalImage.src = image.src;
            modalImage.classList.add('fade-in');
            
            // 更新缩略图激活状态
            const thumbnails = galleryThumbnails.querySelectorAll('.gallery-thumbnail');
            thumbnails.forEach((thumb, index) => {
                if (index === currentImageIndex) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });
        }, 300);
    }
    
    // 打开详细信息弹窗
    function openDetailModal(detailType) {
        const detail = detailData[detailType];
        
        if (!detail) return;
        
        // 设置标题和内容
        detailTitle.textContent = detail.title;
        detailContent.innerHTML = detail.content;
        
        // 显示弹窗
        detailModalOverlay.classList.add('active');
    }
    
    // 将openDetailModal函数设为全局可访问，以便gallery-preview中的按钮可以调用
    window.openDetailModal = openDetailModal;
    
    // 图片切换
    prevBtn.addEventListener('click', function() {
        const gallery = galleryData[currentGallery];
        currentImageIndex = (currentImageIndex - 1 + gallery.images.length) % gallery.images.length;
        updateGalleryImage();
    });
    
    nextBtn.addEventListener('click', function() {
        const gallery = galleryData[currentGallery];
        currentImageIndex = (currentImageIndex + 1) % gallery.images.length;
        updateGalleryImage();
    });
    
    // 视频弹窗
    const videoCards = document.querySelectorAll('.video-card');
    const videoModalOverlay = document.getElementById('video-modal-overlay');
    
    // 打开视频弹窗
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video');
            // 创建iframe
            const iframe = document.createElement('iframe');
            iframe.id = 'modal-video';
            iframe.width = '100%';
            iframe.height = '500';
            iframe.src = videoData[videoId];
            iframe.frameBorder = '0';
            iframe.allowFullscreen = true;
            
            // 替换旧的iframe
            const videoContainer = document.querySelector('.video-modal');
            const oldVideo = document.getElementById('modal-video');
            videoContainer.replaceChild(iframe, oldVideo);
            
            // 显示弹窗
            videoModalOverlay.classList.add('active');
        });
    });
    
    // 关闭弹窗
    modalClose.forEach(btn => {
        btn.addEventListener('click', function() {
            // 关闭所有弹窗
            imageModalOverlay.classList.remove('active');
            videoModalOverlay.classList.remove('active');
            detailModalOverlay.classList.remove('active');
            
            // 重置视频
            const iframe = document.getElementById('modal-video');
            if (iframe) {
                iframe.src = iframe.src;
            }
        });
    });
    
    // 点击遮罩层关闭弹窗
    [imageModalOverlay, videoModalOverlay, detailModalOverlay].forEach(overlay => {
        overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
                
                // 如果是视频弹窗，重置视频
                if (this === videoModalOverlay) {
                    const iframe = document.getElementById('modal-video');
                    if (iframe) {
                        iframe.src = iframe.src;
                    }
                }
            }
        });
    });
    
    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (imageModalOverlay.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            } else if (e.key === 'Escape') {
                imageModalOverlay.classList.remove('active');
            }
        }
        
        if (videoModalOverlay.classList.contains('active') && e.key === 'Escape') {
            videoModalOverlay.classList.remove('active');
            // 重置视频
            const iframe = document.getElementById('modal-video');
            if (iframe) {
                iframe.src = iframe.src;
            }
        }
        
        if (detailModalOverlay.classList.contains('active') && e.key === 'Escape') {
            detailModalOverlay.classList.remove('active');
        }
    });
}

// 音乐播放器功能
function initMusicPlayer() {
    // 创建音乐播放器元素
    const musicPlayerContainer = document.createElement('div');
    musicPlayerContainer.className = 'music-player';
    musicPlayerContainer.innerHTML = `
        <div class="music-toggle">
            <i class="fas fa-music"></i>
        </div>
        <div class="music-controls">
            <div class="music-info">
                <div class="music-title">Parto, parto - Mozart</div>
                <div class="music-artist">Huijie Sun, mezzo-soprano</div>
            </div>
            <div class="music-progress">
                <div class="progress-bar">
                    <div class="progress-current"></div>
                </div>
                <div class="time-info">
                    <span class="current-time">0:00</span>
                    <span class="total-time">3:45</span>
                </div>
            </div>
            <div class="music-buttons">
                <button class="music-btn prev-track"><i class="fas fa-step-backward"></i></button>
                <button class="music-btn play-pause"><i class="fas fa-play"></i></button>
                <button class="music-btn next-track"><i class="fas fa-step-forward"></i></button>
                <div class="volume-container">
                    <button class="music-btn volume"><i class="fas fa-volume-up"></i></button>
                    <div class="volume-slider">
                        <div class="volume-bar">
                            <div class="volume-current"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 将音乐播放器添加到页面
    document.body.appendChild(musicPlayerContainer);
    
    // 音乐播放器状态
    let isPlaying = false;
    let isExpanded = false;
    
    // 创建音频元素
    const audioElement = new Audio();
    
    // 播放列表
    const playlist = [
        {
            title: "Parto, parto - Mozart",
            artist: "Huijie Sun, mezzo-soprano",
            duration: "3:45",
            audio: "music/cj.mp3"
        },
        {
            title: "Che farò senza Euridice - Gluck",
            artist: "Huijie Sun, mezzo-soprano",
            duration: "4:32",
            audio: "music/cj.mp3"
        },
        {
            title: "Habanera - Bizet",
            artist: "Huijie Sun, mezzo-soprano",
            duration: "6:15",
            audio: "music/cj.mp3"
        }
    ];
    
    let currentTrackIndex = 0;
    
    // 切换音乐播放器显示
    const musicToggle = musicPlayerContainer.querySelector('.music-toggle');
    const musicControls = musicPlayerContainer.querySelector('.music-controls');
    
    musicToggle.addEventListener('click', function() {
        isExpanded = !isExpanded;
        if (isExpanded) {
            musicPlayerContainer.classList.add('expanded');
        } else {
            musicPlayerContainer.classList.remove('expanded');
        }
    });
    
    // 加载当前曲目
    function loadCurrentTrack() {
        const track = playlist[currentTrackIndex];
        audioElement.src = track.audio;
        audioElement.load();
    }
    
    // 初始加载第一首曲目
    loadCurrentTrack();
    
    // 播放/暂停按钮
    const playPauseBtn = musicPlayerContainer.querySelector('.play-pause');
    
    playPauseBtn.addEventListener('click', function() {
        if (isPlaying) {
            audioElement.pause();
            this.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
        } else {
            audioElement.play();
            this.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }
    });
    
    // 上一曲/下一曲按钮
    const prevBtn = musicPlayerContainer.querySelector('.prev-track');
    const nextBtn = musicPlayerContainer.querySelector('.next-track');
    
    prevBtn.addEventListener('click', function() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadCurrentTrack();
        updateTrackInfo();
        if (isPlaying) {
            audioElement.play();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadCurrentTrack();
        updateTrackInfo();
        if (isPlaying) {
            audioElement.play();
        }
    });
    
    // 更新曲目信息
    function updateTrackInfo() {
        const track = playlist[currentTrackIndex];
        musicPlayerContainer.querySelector('.music-title').textContent = track.title;
        musicPlayerContainer.querySelector('.music-artist').textContent = track.artist;
        musicPlayerContainer.querySelector('.total-time').textContent = track.duration;
        
        // 重置进度条
        musicPlayerContainer.querySelector('.progress-current').style.width = '0%';
        musicPlayerContainer.querySelector('.current-time').textContent = '0:00';
    }
    
    // 音量控制
    const volumeBtn = musicPlayerContainer.querySelector('.volume');
    const volumeSlider = musicPlayerContainer.querySelector('.volume-slider');
    const volumeBar = musicPlayerContainer.querySelector('.volume-bar');
    const volumeCurrent = musicPlayerContainer.querySelector('.volume-current');
    
    volumeBtn.addEventListener('click', function() {
        volumeSlider.classList.toggle('active');
    });
    
    // 设置初始音量
    audioElement.volume = 0.5;
    
    // 音量调节
    volumeBar.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const height = rect.height;
        const clickPosition = rect.bottom - e.clientY;
        const volume = clickPosition / height;
        
        // 设置音量（0-1之间）
        audioElement.volume = Math.max(0, Math.min(1, volume));
        
        // 更新音量条显示
        volumeCurrent.style.height = (audioElement.volume * 100) + '%';
        
        // 更新音量图标
        updateVolumeIcon();
    });
    
    // 更新音量图标
    function updateVolumeIcon() {
        if (audioElement.volume === 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (audioElement.volume < 0.5) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }
    
    // 静音/取消静音
    let lastVolume = 0.5;
    volumeBtn.addEventListener('dblclick', function() {
        if (audioElement.volume > 0) {
            lastVolume = audioElement.volume;
            audioElement.volume = 0;
            volumeCurrent.style.height = '0%';
        } else {
            audioElement.volume = lastVolume;
            volumeCurrent.style.height = (lastVolume * 100) + '%';
        }
        updateVolumeIcon();
    });
    
    // 进度条更新
    const progressBar = musicPlayerContainer.querySelector('.progress-bar');
    const progressCurrent = musicPlayerContainer.querySelector('.progress-current');
    const currentTimeEl = musicPlayerContainer.querySelector('.current-time');
    
    // 音频时间更新事件
    audioElement.addEventListener('timeupdate', function() {
        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration || 1;
        const progressPercent = (currentTime / duration) * 100;
        
        progressCurrent.style.width = progressPercent + '%';
        
        // 更新当前时间显示
        currentTimeEl.textContent = formatTime(currentTime);
    });
    
    // 点击进度条跳转
    progressBar.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const width = rect.width;
        const clickX = e.clientX - rect.left;
        const duration = audioElement.duration;
        
        audioElement.currentTime = (clickX / width) * duration;
    });
    
    // 音频结束时自动播放下一曲
    audioElement.addEventListener('ended', function() {
        nextBtn.click();
    });
    
    // 格式化时间显示
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    // 初始化音乐播放器
    updateTrackInfo();
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    initParticleBackground();
    initDraggableBox();
    initGalleryPreview();
    initScrollAnimations();
    initModals();
    initMusicPlayer();
});