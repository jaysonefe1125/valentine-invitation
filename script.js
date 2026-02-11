// No button rejection notes (displayed below GIF)
const rejectionNotes = [
    "Are you sure? 🥺",
    "What if I asked really nicely? 🙏",
    "Pretty please? 😢",
    "With a chocolate rice cake on top? 🍰",
    "What about a matcha frostie? 🍵",
    "PLEASE POOKIE! 💕",
    "But :'( 😢",
    "I am going to die... 💔",
    "Yep I'm dead 😵",
    "Ok you're talking to Jason's ghost now 👻",
    "Please Mahal? 🙇",
    "😭",
    "PRETTY PLEASE??? 🌟",
    "No... :( 💔"
];

// Different GIFs for each rejection
const gifs = [
    "https://media.giphy.com/media/nR4L10XlJcSeQ/giphy.gif",
    "https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif",
    "https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif",
    "https://media.giphy.com/media/kDIhIpwRRIi3K/giphy.gif",
    "https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif",
    "https://media.giphy.com/media/BEob5qwFkSJ7G/giphy.gif",
    "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif",
    "https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif",
    "https://media.giphy.com/media/wViS9n0RqN2/giphy.gif",
    "https://media.giphy.com/media/LpLd2NGvpaiys/giphy.gif",
    "https://media.giphy.com/media/ZBVhKIDgts1eHYdT7u/giphy.gif",
    "https://media.giphy.com/media/3oEjHWXddcCOGZNmFO/giphy.gif",
    "https://media.giphy.com/media/gfsQffBnuc6e096brx/giphy.gif",
    "https://media.giphy.com/media/JER2en0ZRiGUE/giphy.gif",
    "https://media.giphy.com/media/10tIjpzIu8fe0/giphy.gif"
];

// Snacks options
const snacks = [
    { emoji: "🍡", label: "Takoyaki" },
    { emoji: "🍜", label: "Ramen" },
    { emoji: "🍟", label: "Fries" },
    { emoji: "🥗", label: "Salad" },
    { emoji: "🥩", label: "Steak" },
    { emoji: "🍢", label: "Samgyup" },
    { emoji: "✨", label: "Other", isCustom: true }
];

// Special requests
const specialRequests = [
    { emoji: "🎬", label: "Movie Night" },
    { emoji: "🌳", label: "Park Walk" },
    { emoji: "👋", label: "Hand Holding" },
    { emoji: "🎮", label: "Arcade" },
    { emoji: "🎁", label: "Shopping" },
    { emoji: "💆", label: "Massage" },
    { emoji: "✨", label: "Other", isSpecial: true }
];

// Sex positions (from Men's Health article)
const positions = [
    "Missionary",
    "Doggy Style",
    "Cowgirl",
    "Reverse Cowgirl",
    "Spooning",
    "Standing",
    "69",
    "Lotus"
];

let noClickCount = 0;
let yesBtnScale = 1;
let secretOptionAdded = false;
let selectedPositions = [];
let positionSectionInitialized = false;
let otherPositionClicked = false;
let otherPositionLinkOpened = false;

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const gifImage = document.getElementById('gifImage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const buttonContainer = document.getElementById('buttonContainer');
const rejectionNote = document.getElementById('rejectionNote');

// Initialize date grid
function initializeDateGrid() {
    const dateGrid = document.getElementById('dateGrid');
    
    // Get current date
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth(); // 0-indexed (0 = January, 1 = February)
    const currentYear = today.getFullYear();
    
    // February 2026 starts on Sunday (day 0)
    // Add dates from Feb 1-28, 2026
    const firstDay = 0; // Sunday
    const daysInMonth = 28;
    const targetMonth = 1; // February (0-indexed)
    const targetYear = 2026;
    
    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        const emptyBtn = document.createElement('button');
        emptyBtn.className = 'date-btn empty';
        dateGrid.appendChild(emptyBtn);
    }
    
    // Add date buttons for Feb 1-28
    for (let i = 1; i <= daysInMonth; i++) {
        const dateBtn = document.createElement('button');
        dateBtn.className = 'date-btn';
        dateBtn.textContent = i;
        
        // Check if this date has passed
        const isPast = (currentYear === targetYear && currentMonth === targetMonth && i <= currentDay) ||
                       (currentYear === targetYear && currentMonth > targetMonth) ||
                       (currentYear > targetYear);
        
        if (isPast) {
            dateBtn.classList.add('disabled');
            dateBtn.disabled = true;
        } else {
            dateBtn.onclick = function() {
                document.querySelectorAll('.date-btn:not(.empty):not(.disabled)').forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
            };
        }
        
        dateGrid.appendChild(dateBtn);
    }
}

// Initialize snacks grid
function initializeSnacksGrid() {
    const snacksGrid = document.getElementById('snacksGrid');
    const snacksSection = document.querySelector('.snacks-section');
    
    snacks.forEach(snack => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.innerHTML = `
            <div class="emoji">${snack.emoji}</div>
            <div class="label">${snack.label}</div>
        `;
        card.onclick = function() {
            document.querySelectorAll('#snacksGrid .option-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            // Show/hide custom input for "Other" option
            if (snack.isCustom) {
                document.getElementById('customSnackInput').classList.add('show');
                document.getElementById('customSnackField').focus();
            } else {
                document.getElementById('customSnackInput').classList.remove('show');
            }
        };
        snacksGrid.appendChild(card);
    });
    
    // Add custom input field after grid
    const customInputContainer = document.createElement('div');
    customInputContainer.className = 'custom-input-container';
    customInputContainer.id = 'customSnackInput';
    customInputContainer.innerHTML = `
        <input type="text" 
               class="custom-input" 
               id="customSnackField" 
               placeholder="Type your custom snack here... 🍴"
               maxlength="50">
    `;
    snacksSection.appendChild(customInputContainer);
}

// Initialize position selection section
function initializePositionSelection() {
    if (positionSectionInitialized) return;
    
    const specialRequestSection = document.querySelector('.special-request-section');
    
    // Create position selection container
    const positionSelection = document.createElement('div');
    positionSelection.className = 'position-selection';
    positionSelection.id = 'positionSelection';
    
    // Create header
    const header = document.createElement('h3');
    header.textContent = '🔥 Select Position/s (can select multiple)';
    positionSelection.appendChild(header);
    
    // Create position grid
    const positionGrid = document.createElement('div');
    positionGrid.className = 'position-grid';
    positionGrid.id = 'positionGrid';
    
    // Add position buttons
    positions.forEach(position => {
        const btn = document.createElement('button');
        btn.className = 'position-btn';
        btn.textContent = position;
        btn.onclick = function() {
            // Toggle selection
            this.classList.toggle('selected');
            
            // Update selectedPositions array
            if (this.classList.contains('selected')) {
                if (!selectedPositions.includes(position)) {
                    selectedPositions.push(position);
                }
            } else {
                const index = selectedPositions.indexOf(position);
                if (index > -1) {
                    selectedPositions.splice(index, 1);
                }
            }
        };
        positionGrid.appendChild(btn);
    });
    
    // Add "Other" button
    const otherBtn = document.createElement('button');
    otherBtn.className = 'position-btn other-btn';
    otherBtn.textContent = 'Other';
    otherBtn.onclick = function() {
        otherPositionClicked = true;
        // Only open link once
        if (!otherPositionLinkOpened) {
            window.open('https://www.menshealth.com/sex-women/a19547362/45-sex-positions-guys-should-know/', '_blank');
            otherPositionLinkOpened = true;
            // Show the note
            const note = document.getElementById('otherPositionNote');
            if (note) {
                note.style.display = 'block';
            }
        }
        // Show custom position input
        const customPosInput = document.getElementById('customPositionInput');
        if (customPosInput) {
            customPosInput.classList.add('show');
            document.getElementById('customPositionField').focus();
        }
    };
    positionGrid.appendChild(otherBtn);
    
    positionSelection.appendChild(positionGrid);
    
    // Add note for other tab
    const otherNote = document.createElement('div');
    otherNote.className = 'other-position-note';
    otherNote.id = 'otherPositionNote';
    otherNote.textContent = '💡 Check out positions on the other tab';
    otherNote.style.display = 'none';
    positionSelection.appendChild(otherNote);
    
    // Add custom position input field
    const customInputContainer = document.createElement('div');
    customInputContainer.className = 'custom-input-container';
    customInputContainer.id = 'customPositionInput';
    customInputContainer.innerHTML = `
        <input type="text"
               class="custom-input"
               id="customPositionField"
               placeholder="Type your preferred position here... 🔥"
               maxlength="50">
    `;
    positionSelection.appendChild(customInputContainer);
    
    // Insert after special request section
    specialRequestSection.parentNode.insertBefore(positionSelection, specialRequestSection.nextSibling);
    
    positionSectionInitialized = true;
}

// Initialize special requests grid
function initializeSpecialRequestGrid() {
    const specialRequestGrid = document.getElementById('specialRequestGrid');
    const specialRequestSection = document.querySelector('.special-request-section');
    
    specialRequests.forEach(request => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.innerHTML = `
            <div class="emoji">${request.emoji}</div>
            <div class="label">${request.label}</div>
        `;
        card.onclick = function() {
            // Special handling for "Other" option
            if (request.isSpecial && !secretOptionAdded) {
                // Show message
                alert('Alam ko na gusto mo, click "OK" to see another option for special request 😏');
                
                // Add the secret option
                const secretCard = document.createElement('div');
                secretCard.className = 'option-card secret-option';
                secretCard.innerHTML = `
                    <div class="emoji">🔥</div>
                    <div class="label">SEX</div>
                `;
                secretCard.onclick = function() {
                    document.querySelectorAll('#specialRequestGrid .option-card').forEach(c => c.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    // Hide the note when SEX is selected
                    const note = document.getElementById('specialRequestNote');
                    if (note) {
                        note.classList.remove('show');
                    }
                    
                    // Initialize and show position selection
                    if (!positionSectionInitialized) {
                        initializePositionSelection();
                    }
                    const positionSelection = document.getElementById('positionSelection');
                    if (positionSelection) {
                        positionSelection.classList.add('show');
                    }
                };
                
                // Insert at the top (first position) of all special requests
                specialRequestGrid.insertBefore(secretCard, specialRequestGrid.firstChild);
                secretOptionAdded = true;
                
                // Add a subtle animation
                secretCard.style.animation = 'bounce 0.5s ease';
                
                // Remove the "Other" option
                this.remove();
                
                // Add note below Special Request section
                const note = document.createElement('div');
                note.className = 'special-request-note show';
                note.id = 'specialRequestNote';
                note.textContent = '💡 Please select your favorite 🔥 to see options available';
                specialRequestSection.appendChild(note);
                
                return;
            }
            
            document.querySelectorAll('#specialRequestGrid .option-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            // Show the note again if a non-SEX option is selected
            const note = document.getElementById('specialRequestNote');
            if (note && this.querySelector('.label').textContent !== 'SEX') {
                note.classList.add('show');
            }
            
            // Hide position selection if another option is selected (not SEX)
            const positionSelection = document.getElementById('positionSelection');
            if (positionSelection) {
                positionSelection.classList.remove('show');
                // Clear selections
                selectedPositions = [];
                otherPositionClicked = false;
                document.querySelectorAll('.position-btn.selected').forEach(btn => btn.classList.remove('selected'));
            }
        };
        specialRequestGrid.appendChild(card);
    });
}

// No button click handler
noBtn.addEventListener('click', function() {
    noClickCount++;

    // Make button absolutely positioned after first click
    if (noClickCount === 1) {
        noBtn.classList.add('moving');
    }

    // Change GIF
    if (noClickCount < gifs.length) {
        gifImage.src = gifs[noClickCount];
    }

    // Show rejection note below GIF (keep button text as "No")
    if (noClickCount <= rejectionNotes.length) {
        // Show rejection note below GIF - stays visible
        rejectionNote.textContent = rejectionNotes[noClickCount - 1];
        rejectionNote.classList.add('show');
    }

    // Increase Yes button size
    yesBtnScale += 0.15;
    yesBtn.style.transform = `scale(${yesBtnScale})`;
    yesBtn.style.fontSize = `${1.2 * yesBtnScale}em`;

    // Move No button to random position with smart alignment prevention
    if (noClickCount < rejectionNotes.length) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        const yesRect = yesBtn.getBoundingClientRect();
        const containerRect = buttonContainer.getBoundingClientRect();
        const gifContainer = document.querySelector('.gif-container');
        const gifRect = gifContainer.getBoundingClientRect();

        let randomX, randomY;
        let attempts = 0;
        const maxAttempts = 100;
        const alignmentThreshold = 50; // Pixels to avoid alignment zone

        do {
            // Random position within the viewport
            randomX = Math.random() * (screenWidth - btnWidth - 40) + 20;
            randomY = Math.random() * (screenHeight - btnHeight - 40) + 20;
            
            // Calculate absolute position for comparison
            const absoluteX = randomX + containerRect.left;
            const absoluteY = randomY + containerRect.top;
            
            // Check various alignment conditions to avoid
            const wouldBeAbove = absoluteY < yesRect.top;
            
            // Check horizontal alignment (same X range)
            const horizontalOverlap =
                (absoluteX < yesRect.right + alignmentThreshold && absoluteX + btnWidth > yesRect.left - alignmentThreshold);
            
            // Check vertical alignment (same Y range)
            const verticalOverlap =
                (absoluteY < yesRect.bottom + alignmentThreshold && absoluteY + btnHeight > yesRect.top - alignmentThreshold);
            
            // Check if directly below (vertical column alignment)
            const directlyBelow =
                horizontalOverlap && absoluteY > yesRect.bottom && absoluteY < yesRect.bottom + alignmentThreshold * 2;
            
            // Check if on same horizontal line
            const sameHorizontalLine =
                verticalOverlap && (absoluteX > yesRect.right || absoluteX + btnWidth < yesRect.left);
            
            // Check if overlapping with GIF area
            const overlapsGif = !(
                absoluteX + btnWidth < gifRect.left - alignmentThreshold ||
                absoluteX > gifRect.right + alignmentThreshold ||
                absoluteY + btnHeight < gifRect.top - alignmentThreshold ||
                absoluteY > gifRect.bottom + alignmentThreshold
            );
            
            // Position is valid if it's not above, not directly aligned, and has some separation
            const isValidPosition =
                !wouldBeAbove &&
                !directlyBelow &&
                !overlapsGif &&
                !(horizontalOverlap && verticalOverlap); // Not overlapping in both dimensions
            
            if (isValidPosition) break;
            
            attempts++;
        } while (attempts < maxAttempts);

        // Convert to position relative to container
        const relativeX = randomX - containerRect.left;
        const relativeY = randomY - containerRect.top;

        noBtn.style.left = `${relativeX}px`;
        noBtn.style.top = `${relativeY}px`;
    } else {
        // Remove No button after last note
        noBtn.classList.add('hidden');
    }
});

// Yes button click handler
yesBtn.addEventListener('click', function() {
    // Trigger confetti celebration! 🎉
    if (typeof confetti !== 'undefined') {
        // Main confetti burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1', '#e91e63']
        });
        
        // Additional bursts from sides for extra celebration
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1', '#e91e63']
            });
        }, 200);
        
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1', '#e91e63']
            });
        }, 400);
    }
    
    questionPage.style.display = 'none';
    resultPage.style.display = 'block';
});

// Submit button handler
document.getElementById('submitBtn').addEventListener('click', function() {
    const selectedDate = document.querySelector('.date-btn.selected:not(.disabled)');
    const selectedTime = document.getElementById('timeInput').value;
    const selectedSnack = document.querySelector('#snacksGrid .option-card.selected');
    const selectedRequest = document.querySelector('#specialRequestGrid .option-card.selected');

    if (!selectedDate || !selectedTime || !selectedSnack || !selectedRequest) {
        alert('Please select all options! 💕');
        return;
    }
    
    // Check if SEX option is visible but not selected
    const sexOption = document.querySelector('#specialRequestGrid .option-card.secret-option');
    const isSexSelected = selectedRequest.querySelector('.label').textContent === 'SEX';
    
    if (sexOption && !isSexSelected) {
        // Show confirmation modal
        showConfirmationModal();
        return;
    }

    // Continue with submission
    processSubmission();
});

// Function to show confirmation modal
function showConfirmationModal() {
    const modal = document.getElementById('confirmModal');
    const yesBtn = document.getElementById('modalYesBtn');
    const noBtn = document.getElementById('modalNoBtn');
    const modalContent = document.querySelector('.modal-content');
    const h2Element = modalContent.querySelector('h2');
    const pElement = modalContent.querySelector('p');
    
    modal.classList.add('show');
    
    // Reset button styling
    yesBtn.classList.remove('moving');
    yesBtn.style.left = '';
    yesBtn.style.top = '';
    yesBtn.style.display = '';
    
    // Track how many times Yes is clicked
    let yesClickCount = 0;
    
    // Messages for each click
    const messages = [
        { title: "Are you really sure you don't wanna try 🔥?", subtitle: "It could be fun... 😏" },
        { title: "Are you really really sure?", subtitle: "Last chance to reconsider... 🤔" },
        { title: "Mag sisisi ka?", subtitle: "This is your final warning! 😱" }
    ];
    
    // Reset to initial state
    h2Element.textContent = "Are you sure? 🤔";
    pElement.textContent = "You haven't selected the 🔥 option...";
    
    // Yes button click handler
    const handleYesClick = function() {
        if (yesClickCount < messages.length) {
            const message = messages[yesClickCount];
            h2Element.textContent = message.title;
            pElement.textContent = message.subtitle;
            yesClickCount++;
            
            // On third click, hide the Yes button
            if (yesClickCount === 3) {
                setTimeout(() => {
                    yesBtn.style.display = 'none';
                }, 500);
            }
        }
    };
    
    yesBtn.onclick = handleYesClick;
    
    // No button closes modal and resets everything
    noBtn.onclick = function() {
        modal.classList.remove('show');
        yesBtn.onclick = null;
        yesBtn.style.display = '';
        yesClickCount = 0;
        
        // Scroll to SEX option
        const sexOption = document.querySelector('#specialRequestGrid .option-card.secret-option');
        if (sexOption) {
            sexOption.scrollIntoView({ behavior: 'smooth', block: 'center' });
            sexOption.style.animation = 'pulse 1s ease-in-out 3';
        }
    };
}

// Function to process submission
function processSubmission() {
    const selectedDate = document.querySelector('.date-btn.selected:not(.disabled)');
    const selectedTime = document.getElementById('timeInput').value;
    const selectedSnack = document.querySelector('#snacksGrid .option-card.selected');
    const selectedRequest = document.querySelector('#specialRequestGrid .option-card.selected');
    
    // Get selected values
    const date = selectedDate.textContent;
    const time = selectedTime;
    let snack = selectedSnack.querySelector('.label').textContent;
    
    // Check if "Other" is selected and get custom input
    if (snack === "Other") {
        const customSnack = document.getElementById('customSnackField').value.trim();
        if (!customSnack) {
            alert('Please specify your custom snack! 🍴');
            document.getElementById('customSnackField').focus();
            return;
        }
        snack = customSnack;
    }
    
    const request = selectedRequest.querySelector('.label').textContent;
    
    // If SEX is selected, check if at least one position is selected or "Other" is clicked
    if (request === "SEX" && selectedPositions.length === 0 && !otherPositionClicked) {
        alert('Please select at least one position! 🔥');
        return;
    }
    
    // If "Other" position is clicked, check for custom position input
    if (request === "SEX" && otherPositionClicked) {
        const customPosition = document.getElementById('customPositionField').value.trim();
        if (!customPosition) {
            alert('Please specify your preferred position! 🔥');
            document.getElementById('customPositionField').focus();
            return;
        }
    }

    // Format the time
    const timeObj = new Date('2000-01-01 ' + time);
    const formattedTime = timeObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    // Get day of week
    const dateObj = new Date(2026, 1, parseInt(date)); // February 2026
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    // Build extras section with positions if SEX is selected
    let extrasHtml = '';
    let positionsDisplay = ''; // Declare outside for scope access
    
    if (request === "SEX" && (selectedPositions.length > 0 || otherPositionClicked)) {
        positionsDisplay = selectedPositions.join(', ');
        if (otherPositionClicked) {
            const customPosField = document.getElementById('customPositionField');
            const customPosition = customPosField ? customPosField.value.trim() : '';
            if (customPosition) {
                if (positionsDisplay) {
                    positionsDisplay = positionsDisplay + ', ' + customPosition;
                } else {
                    positionsDisplay = customPosition;
                }
            }
        }
        extrasHtml = `
            <div class="detail-row"><strong>Extras:</strong> <span>${request}</span></div>
            <div class="detail-row"><strong>Positions:</strong> <span>${positionsDisplay}</span></div>
        `;
    } else {
        extrasHtml = `<div class="detail-row"><strong>Extras:</strong> <span>${request}</span></div>`;
    }

    // Update final message with selected details
    document.getElementById('finalMessage').innerHTML = `
        <div class="final-gif">
            <img src="https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif" alt="Kawaii couple cats">
        </div>
        <h2>It's a Date, Mahal!</h2>
        
        <!-- Countdown Timer -->
        <div class="countdown-container">
            <div class="countdown-title">Time Until Our Date 💕</div>
            <div class="countdown-display">
                <div class="countdown-item">
                    <span class="countdown-value" id="days">00</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value" id="hours">00</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value" id="minutes">00</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value" id="seconds">00</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            </div>
        </div>
        
        <div class="date-details">
            <div class="detail-row"><strong>When:</strong> <span>${dayOfWeek}, February ${date} at ${formattedTime}</span></div>
            <div class="detail-row"><strong>Food:</strong> <span>${snack}</span></div>
            ${extrasHtml}
        </div>
        <div class="final-text">Wabyuuu! See you then! 😊</div>
        <div class="avatar-container">
            <img class="avatar" src="4c63b74a-3e4f-4b1e-b7b6-765952b23d44.jfif" alt="Avatar 1">
            <img class="avatar" src="5e7bd6f9-82c9-497a-99a1-465bdd39d929.jfif" alt="Heart">
            <img class="avatar" src="a3c9cad1-9be1-4224-8f21-b90c2c109f6e.jfif" alt="Avatar 2">
        </div>
        <div class="screenshot-reminder">📸 Take a screenshot as a remembrance! 💕</div>
        <button class="send-response-btn" id="sendResponseBtn">📧 Send Response to Jason</button>
        <button class="edit-btn" id="editBtn">✏️ Edit Details</button>
    `;

    resultPage.style.display = 'none';
    document.getElementById('finalMessage').style.display = 'block';
    
    // Start countdown timer
    startCountdown(dateObj, time);
    
    // Setup image loading for final page
    setupImageLoading();
    
    // Attach send response handler
    setTimeout(() => {
        document.getElementById('sendResponseBtn').addEventListener('click', function() {
            sendEmailWithCalendar(dayOfWeek, date, formattedTime, snack, request, positionsDisplay);
        });
        
        // Attach edit button handler
        document.getElementById('editBtn').addEventListener('click', goBackToEdit);
    }, 100);
}

// Function to send email with calendar invite
function sendEmailWithCalendar(dayOfWeek, date, time, snack, request, positions) {
    // Multiple guests
    const guests = ['jaysonefe@gmail.com', 'yuniccamarie@gmail.com'];
    
    // Parse the time for Google Calendar
    const timeParts = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeParts) return;
    
    let hours = parseInt(timeParts[1]);
    const minutes = timeParts[2];
    const ampm = timeParts[3].toUpperCase();
    
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    // Create date objects
    const startDate = new Date(2026, 1, parseInt(date), hours, parseInt(minutes));
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours later
    
    // Format dates for Google Calendar (YYYYMMDDTHHMMSS)
    const formatGoogleDate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${year}${month}${day}T${hour}${min}00`;
    };
    
    // Build event description
    let description = `🎉 SHE SAID YES! 💕\n\n`;
    description += `🥰 Our Valentine's Date Details:\n\n`;
    description += `🍽️ Food: ${snack}\n`;
    description += `✨ Activity: ${request}\n`;
    
    if (positions) {
        description += `🔥 Positions: ${positions}\n`;
    }
    
    description += `\n💕 Can't wait to see you, Mahal!\n`;
    description += `Love, Your Valentine 💖`;
    
    // Create Google Calendar event URL with multiple guests
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent("Valentine's Date with Jason 💕")}` +
        `&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}` +
        `&details=${encodeURIComponent(description)}` +
        `&location=${encodeURIComponent('TBD')}` +
        `&add=${encodeURIComponent(guests.join(','))}`;
    
    // Open Google Calendar in new tab
    window.open(calendarUrl, '_blank');
}


// Countdown Timer Function
let countdownInterval;

function startCountdown(dateObj, time) {
    // Clear any existing interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Parse the selected time
    const [hours, minutes] = time.split(':');
    
    // Create target date with the selected date and time
    const targetDate = new Date(dateObj);
    targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Update countdown every second
    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        // If the countdown is over
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            
            // Change countdown title to show it's time
            const countdownTitle = document.querySelector('.countdown-title');
            if (countdownTitle) {
                countdownTitle.textContent = "It's Date Time! 🎉💕";
                countdownTitle.style.animation = 'pulse 1s ease-in-out infinite';
            }
            return;
        }
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update the countdown display
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }, 1000);
}

// ============================================
// IMAGE LOADING WITH FADE-IN
// ============================================
function setupImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
}

// ============================================
// FLOATING HEART PARTICLES
// ============================================
function createFloatingHearts() {
    const heartsContainer = document.body;
    const heartSymbols = ['💕', '💖', '💗', '💝', '💓', '💞'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
        heart.style.animationDuration = (Math.random() * 5 + 10) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation completes
        setTimeout(() => {
            heart.remove();
        }, 17000);
    }, 3000);
}

// ============================================
// LOCAL STORAGE FOR SAVING SELECTIONS
// ============================================
function saveToLocalStorage() {
    const selectedDate = document.querySelector('.date-btn.selected:not(.disabled)');
    const selectedTime = document.getElementById('timeInput').value;
    const selectedSnack = document.querySelector('#snacksGrid .option-card.selected');
    const selectedRequest = document.querySelector('#specialRequestGrid .option-card.selected');
    
    const data = {
        date: selectedDate ? selectedDate.textContent : null,
        time: selectedTime || null,
        snack: selectedSnack ? selectedSnack.querySelector('.label').textContent : null,
        request: selectedRequest ? selectedRequest.querySelector('.label').textContent : null,
        positions: selectedPositions,
        customSnack: document.getElementById('customSnackField')?.value || null,
        customPosition: document.getElementById('customPositionField')?.value || null,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('valentineInvitation', JSON.stringify(data));
}

function restoreFromLocalStorage() {
    const saved = localStorage.getItem('valentineInvitation');
    if (!saved) return;
    
    try {
        const data = JSON.parse(saved);
        
        // Restore date selection
        if (data.date) {
            const dateBtns = document.querySelectorAll('.date-btn');
            dateBtns.forEach(btn => {
                if (btn.textContent === data.date && !btn.classList.contains('disabled')) {
                    btn.classList.add('selected');
                }
            });
        }
        
        // Restore time
        if (data.time) {
            const timeInput = document.getElementById('timeInput');
            if (timeInput) timeInput.value = data.time;
        }
        
        // Restore snack
        if (data.snack) {
            const snackCards = document.querySelectorAll('#snacksGrid .option-card');
            snackCards.forEach(card => {
                if (card.querySelector('.label').textContent === data.snack) {
                    card.classList.add('selected');
                    if (data.snack === 'Other' && data.customSnack) {
                        document.getElementById('customSnackInput')?.classList.add('show');
                        const customField = document.getElementById('customSnackField');
                        if (customField) customField.value = data.customSnack;
                    }
                }
            });
        }
        
        // Restore request
        if (data.request) {
            const requestCards = document.querySelectorAll('#specialRequestGrid .option-card');
            requestCards.forEach(card => {
                if (card.querySelector('.label').textContent === data.request) {
                    card.classList.add('selected');
                }
            });
        }
        
        // Restore positions if SEX was selected
        if (data.positions && data.positions.length > 0) {
            selectedPositions = data.positions;
        }
        
    } catch (e) {
        console.error('Error restoring from localStorage:', e);
    }
}

// Add event listeners to save selections
function setupAutoSave() {
    // Save on any selection change
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('date-btn') ||
            e.target.classList.contains('option-card') ||
            e.target.closest('.option-card')) {
            setTimeout(saveToLocalStorage, 100);
        }
    });
    
    // Save on time input change
    const timeInput = document.getElementById('timeInput');
    if (timeInput) {
        timeInput.addEventListener('change', saveToLocalStorage);
    }
}

// ============================================
// BACK/EDIT BUTTON FUNCTIONALITY
// ============================================
function setupBackButton() {
    // This will be called after the final message is displayed
    // The button will be added dynamically in the processSubmission function
}

function goBackToEdit() {
    const finalMessage = document.getElementById('finalMessage');
    const resultPage = document.getElementById('resultPage');
    
    finalMessage.style.display = 'none';
    resultPage.style.display = 'block';
    
    // Clear countdown interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// ACCESSIBILITY IMPROVEMENTS
// ============================================
function setupAccessibility() {
    // Add ARIA labels to buttons
    const yesBtn = document.querySelector('.yes-btn');
    const noBtn = document.querySelector('.no-btn');
    if (yesBtn) {
        yesBtn.setAttribute('aria-label', 'Accept the Valentine invitation');
        yesBtn.setAttribute('role', 'button');
    }
    if (noBtn) {
        noBtn.setAttribute('aria-label', 'Decline the Valentine invitation');
        noBtn.setAttribute('role', 'button');
    }
    
    // Add ARIA labels to date buttons
    const dateBtns = document.querySelectorAll('.date-btn');
    dateBtns.forEach(btn => {
        if (!btn.classList.contains('empty') && !btn.classList.contains('disabled')) {
            btn.setAttribute('aria-label', `Select February ${btn.textContent}`);
            btn.setAttribute('role', 'button');
            btn.setAttribute('tabindex', '0');
        }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const focused = document.activeElement;
            if (focused.classList.contains('date-btn') ||
                focused.classList.contains('option-card') ||
                focused.classList.contains('position-btn')) {
                e.preventDefault();
                focused.click();
            }
        }
    });
    
    // Add alt text to images
    const gifImg = document.querySelector('.gif-container img');
    if (gifImg && !gifImg.alt) {
        gifImg.setAttribute('alt', 'Romantic animated GIF');
    }
}

// ============================================
// INITIALIZE ALL ENHANCEMENTS
// ============================================
// Initialize all grids on page load
initializeDateGrid();
initializeSnacksGrid();
initializeSpecialRequestGrid();

// Initialize enhancements
setupImageLoading();
createFloatingHearts();
setupAccessibility();
setupAutoSave();

// Restore saved data if available
window.addEventListener('load', () => {
    restoreFromLocalStorage();
    setupImageLoading();
});
