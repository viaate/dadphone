document.addEventListener('DOMContentLoaded', () => {
    const messageDisplay = document.querySelector('.message-display');
    const phoneImage = document.querySelector('.phone-image');
    
    // Create stars
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);

    // Generate stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', Math.random() * 3 + 2 + 's');
        starsContainer.appendChild(star);
    }
    
    // Array of messages to display while audio is playing
    const messages = [
        "Hey Dad!",
        "Just calling to say hi!",
        "Hope you're having a great day!",
        "Miss you!",
        "Love you!",
        "Can't wait to see you!",
        "Thanks for being the best dad!",
        "You're awesome!",
        "Talk to you soon!"
    ];

    // Keep track of which messages have been played
    let playedMessages = new Set();
    const totalMessages = 9;
    let isRinging = false;
    let ringTimeout;

    // Function to get next message number
    const getNextMessageNumber = () => {
        // Create array of available message numbers
        const availableMessages = Array.from({length: totalMessages}, (_, i) => i + 1)
            .filter(num => !playedMessages.has(num));
        
        // If all messages have been played, reset
        if (availableMessages.length === 0) {
            playedMessages.clear();
            return Math.floor(Math.random() * totalMessages) + 1;
        }
        
        // Get random message from available ones
        const randomIndex = Math.floor(Math.random() * availableMessages.length);
        const messageNumber = availableMessages[randomIndex];
        playedMessages.add(messageNumber);
        return messageNumber;
    };

    // Function to play audio
    const playAudio = (audioFile) => {
        return new Promise((resolve, reject) => {
            const audio = new Audio(`assets/${audioFile}`);
            
            audio.oncanplaythrough = () => {
                audio.play()
                    .then(() => resolve(audio))
                    .catch(error => {
                        console.error('Error playing audio:', error);
                        reject(error);
                    });
            };
            
            audio.onerror = (error) => {
                console.error('Error loading audio:', error);
                reject(error);
            };
        });
    };

    // Function to start ringing
    const startRinging = () => {
        if (!isRinging) {
            isRinging = true;
            messageDisplay.textContent = "Incoming call from Olivia...";
            phoneImage.classList.add('ringing');
            
            // Stop ringing after 30 seconds if not answered
            ringTimeout = setTimeout(() => {
                if (isRinging) {
                    stopRinging();
                    messageDisplay.textContent = "Missed call from Olivia";
                }
            }, 30000);
        }
    };

    // Function to stop ringing
    const stopRinging = () => {
        if (isRinging) {
            isRinging = false;
            clearTimeout(ringTimeout);
            phoneImage.classList.remove('ringing');
        }
    };

    // Function to handle phone click
    const handlePhoneClick = async () => {
        // Add click animation
        phoneImage.classList.add('clicked');
        setTimeout(() => {
            phoneImage.classList.remove('clicked');
        }, 500);

        if (isRinging) {
            stopRinging();
            const messageNumber = getNextMessageNumber();
            const audioFile = `message${messageNumber}.mp3`;
            const audio = await playAudio(audioFile);
            
            // Add playing states
            phoneImage.classList.add('playing');
            messageDisplay.classList.add('playing');
            
            audio.onended = () => {
                // Remove playing states
                phoneImage.classList.remove('playing');
                messageDisplay.classList.remove('playing');
                messageDisplay.textContent = messages[messageNumber - 1];
                startRinging();
            };
        }
    };

    // Add click event listener to phone image
    phoneImage.addEventListener('click', handlePhoneClick);

    // Start ringing when page loads
    startRinging();
}); 