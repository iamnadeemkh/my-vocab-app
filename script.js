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
      statusDiv.innerHTML = `<b>${word}</b> added to your sheet!`;
      document.getElementById('wordInput').value = ''; 
    } else {
      throw new Error(result.message);
    }

    setTimeout(() => {
      saveBtn.innerText = "Auto-Fill & Save";
      saveBtn.disabled = false;
      statusDiv.innerHTML = "";
    }, 3000);

  } catch (error) {
    saveBtn.innerText = "Auto-Fill & Save";
    saveBtn.disabled = false;
    statusDiv.innerHTML = "❌ Error saving. Check console.";
    console.error(error);
  }
}