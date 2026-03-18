// 🛑 PASTE YOUR URLs AND KEYS HERE 🛑
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzV41GghO9dimtiPkUEp6ZLM8dkmaQRKwRzCK5-5ZAS-Cjh2nynB_otguR2ElbX1y-Q/exec";
const GEMINI_API_KEY = "AIzaSyAHu-qe5Iupdpfwrud-IMIcyIGZzNO8Apo";


async function saveWord() {
    const word = document.getElementById('wordInput').value.trim();
    const statusDiv = document.getElementById('status');
    const saveBtn = document.getElementById('saveBtn');
  
    if (!word) {
      statusDiv.innerHTML = "❌ Please enter a word first.";
      return;
    }
  
    saveBtn.disabled = true;
    saveBtn.innerText = "🧠 AI is thinking...";
    statusDiv.innerHTML = "";
  
    try {
      let meaning = "Meaning not found.";
      let example = "No example found.";
      
      try {
        const promptText = `Define the word '${word}'. Return ONLY a JSON object with two keys: 'meaning' (a simple definition) and 'example' (an everyday example sentence).`;
        
        console.log(`Sending word to AI: ${word}...`); 
  
        // 👇 THIS IS THE LINE WE FIXED (Changed 1.5 to 2.5) 👇
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        });
  
        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          console.log("Full AI Data Object:", geminiData); 
  
          const aiText = geminiData.candidates[0].content.parts[0].text;
          console.log("Raw AI Text Response:", aiText); 
          
          const parsedAI = JSON.parse(aiText);
          meaning = parsedAI.meaning;
          example = parsedAI.example;
        } else {
           console.error("Gemini API Error:", await geminiResponse.text());
        }
      } catch (e) {
        console.error("Error parsing AI response:", e);
      }
  
      saveBtn.innerText = "💾 Saving to Database...";
      
      const payload = {
        word: word,
        meaning: meaning,
        example: example
      };
  
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
  
      saveBtn.innerText = "✅ Saved Successfully!";
      statusDiv.innerHTML = `<b>${word}</b> added to your sheet!`;
      document.getElementById('wordInput').value = ''; 
      
      setTimeout(() => {
        saveBtn.innerText = "Auto-Fill & Save";
        saveBtn.disabled = false;
        statusDiv.innerHTML = "";
      }, 3000);
  
    } catch (error) {
      saveBtn.innerText = "Auto-Fill & Save";
      saveBtn.disabled = false;
      statusDiv.innerHTML = "❌ Error saving to sheet. Check internet connection.";
      console.error(error);
    }
  }