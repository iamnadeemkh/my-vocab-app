// 🛑 PASTE YOUR URLs AND KEYS HERE 🛑
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzV41GghO9dimtiPkUEp6ZLM8dkmaQRKwRzCK5-5ZAS-Cjh2nynB_otguR2ElbX1y-Q/exec";

async function saveWord() {
  const word = document.getElementById('wordInput').value.trim();
  const statusDiv = document.getElementById('status');
  const saveBtn = document.getElementById('saveBtn');

  if (!word) {
    statusDiv.innerHTML = "❌ Please enter a word first.";
    return;
  }

  saveBtn.disabled = true;
  saveBtn.innerText = "🧠 Securely asking AI...";
  statusDiv.innerHTML = "";

  try {
    const payload = { word: word };

    // We only send the word to your Apps Script. 
    // The Apps Script handles the AI secretly!
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === "success") {
      saveBtn.innerText = "✅ Saved Successfully!";
      const ai = result.data; // The new data from Apps Script!
      
      // Build a beautiful result card to show the user
      statusDiv.innerHTML = `
        <div style="text-align: left; padding: 15px; border-radius: 8px; margin-top: 15px; border: 1px solid #ddd;">
          <h3 style="margin-top:0; color: #28a745;">${word} <span style="font-size: 14px; color: #666;">(${ai.translation})</span></h3>
          <p><b>Meaning:</b> ${ai.meaning}</p>
          <p><b>Synonyms:</b> ${ai.synonyms}</p>
          <p><b>Antonyms:</b> ${ai.antonyms}</p>
        </div>
      `;
      document.getElementById('wordInput').value = ''; 
      loadDashboard();
    } else {
      throw new Error(result.message);
    }

    // Give them 30 seconds to read it before clearing the screen
    setTimeout(() => {
      saveBtn.innerText = "Auto-Fill & Save";
      saveBtn.disabled = false;
      statusDiv.innerHTML = "";
    }, 30000);

  } catch (error) {
    saveBtn.innerText = "Auto-Fill & Save";
    saveBtn.disabled = false;
    statusDiv.innerHTML = "❌ Error saving. Check console.";
    console.error(error);
  }
}

// --- FETCH DASHBOARD DATA (PHASE 3) ---
async function loadDashboard() {
  const recentDiv = document.getElementById('recentWords');
  const countText = document.getElementById('totalCount');
  
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    const result = await response.json();
    
    if (result.status === "success") {
      countText.innerText = `Total Words Mastered: ${result.totalWords}`;
      recentDiv.innerHTML = `<h4 style="text-align: left; margin-bottom: 10px;">Recent Words:</h4>`;
      
      // Loop through the data and build a mini-card for each word
      result.recent.forEach(item => {
        recentDiv.innerHTML += `
          <div class="recent-card">
            <strong>${item.word}</strong> <span style="font-size: 12px; color: #888;">(${item.translation})</span>
            <div style="font-size: 13px; margin-top: 4px;">${item.meaning}</div>
          </div>
        `;
      });
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
    countText.innerText = "Could not load stats.";
  }
}

// --- DARK MODE LOGIC ---
function toggleTheme() {
  // Toggle the dark-mode class on the body
  document.body.classList.toggle('dark-mode');
  
  // Check if it's currently dark mode
  const isDark = document.body.classList.contains('dark-mode');
  
  // Change the icon
  document.getElementById('themeToggle').innerText = isDark ? '☀️' : '🌙';
  
  // Save preference to local storage
  localStorage.setItem('vocabAppTheme', isDark ? 'dark' : 'light');
}

// Check memory when the app first loads
window.onload = () => {
  if (localStorage.getItem('vocabAppTheme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('themeToggle').innerText = '☀️';
  }
  loadDashboard();
};