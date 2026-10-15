const bgmPlayer = document.getElementById('bgm-player');
        const soundBtn = document.getElementById('sound-toggle-btn');
        const soundIcon = document.getElementById('sound-icon');
        const soundText = document.getElementById('sound-text');
        
        const iconOff = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
        const iconOn = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
        
        let isPlaying = false, fadeInterval;

        function toggleSound(play) {
            clearInterval(fadeInterval);
            if (play) {
                bgmPlayer.volume = 0; 
                bgmPlayer.play();
                fadeInterval = setInterval(() => { bgmPlayer.volume < 0.95 ? bgmPlayer.volume += 0.05 : (bgmPlayer.volume = 1, clearInterval(fadeInterval)); }, 50);
                soundIcon.innerHTML = iconOn; soundText.innerHTML = '音声：オン (Sound: ON)';
            } else {
                fadeInterval = setInterval(() => { bgmPlayer.volume > 0.05 ? bgmPlayer.volume -= 0.05 : (bgmPlayer.volume = 0, bgmPlayer.pause(), clearInterval(fadeInterval)); }, 50);
                soundIcon.innerHTML = iconOff; soundText.innerHTML = '音声：オフ (Sound: OFF)';
            }
        }

        soundBtn.addEventListener('click', (e) => {
            e.preventDefault(); isPlaying = !isPlaying; toggleSound(isPlaying);
        });

        function typeText(id, text, speed) {
            const el = document.getElementById(id);
            el.innerText = ''; el.style.opacity = '1'; 
            let i = 0;
            let timer = setInterval(() => {
                if (i < text.length) { el.innerText += text.charAt(i); i++; } 
                else { clearInterval(timer); }
            }, speed); 
        }

        document.getElementById('enter-btn').addEventListener('click', () => {
            window.scrollTo(0, 0);

            isPlaying = true;
            toggleSound(true);

            document.getElementById('enter-btn').style.display = 'none';
            document.getElementById('loading-ui').style.display = 'flex';

            const d = new Date();
            const timeStr = `${d.toLocaleTimeString('en-GB',{hour12:false})} ${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
            
            let currentProgress = 0, steps = 0;
            let counter = setInterval(() => {
                steps++; let baseProgress = Math.floor((steps / 100) * 100);
                if(Math.random() >= 0.2) currentProgress = Math.max(currentProgress, baseProgress + Math.floor(Math.random() * 6));
                currentProgress = Math.min(currentProgress, 100);
                
                document.getElementById('progress-bar').style.width = currentProgress + '%';
                document.getElementById('loading-text').innerText = currentProgress + '%';
                
                if(steps >= 100 || currentProgress >= 100) {
                    document.getElementById('progress-bar').style.width = '100%'; document.getElementById('loading-text').innerText = '100%';
                    clearInterval(counter);
                }
            }, 25); 

            setTimeout(() => { typeText('line1', timeStr, 15); }, 200);
            setTimeout(() => { typeText('line2', "ACPI :PCI Root Bridge Initialized (state 0000 0f000f045610)", 10); }, 800);
            setTimeout(() => { typeText('line3', "Subject :MTE-209 SEC3 A602", 15); }, 1500);
            setTimeout(() => { typeText('line4', "Starting 1 thread(S)", 20); }, 2000);

            setTimeout(() => {
                document.getElementById('loading-ui').classList.add('ui-flash');
                setTimeout(() => {
                    document.getElementById('transition-screen').style.left = '0';
                    setTimeout(() => {
                        document.getElementById('boot-screen').style.display = 'none';
                        document.getElementById('transition-screen').style.left = '100%';
                        
                        document.getElementById('bg-video').play();

                        setTimeout(() => { document.getElementById('transition-screen').style.display = 'none'; }, 1250);
                    }, 1250); 
                }, 150); 
            }, 2500); 
        });

        // --- ระบบ Scroll Spy ---
        const sections = document.querySelectorAll('.content-section');
        const menuLinks = document.querySelectorAll('.menu-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= (sectionTop - 300)) { current = section.getAttribute('id'); }
            });

            menuLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) { link.classList.add('active'); }
            });
        });