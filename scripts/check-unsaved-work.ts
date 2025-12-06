/**
 * Script to check for unsaved carousel work in localStorage
 * Run with: npx tsx scripts/check-unsaved-work.ts
 */

const AUTOSAVE_KEY = "carousel-generator-autosave"
const STORAGE_KEY = "carousel-generator-saves"

function checkUnsavedWork() {
  if (typeof window === "undefined") {
    console.log("This script should be run in a browser console.")
    console.log("Open your browser's developer console and run:")
    console.log(`
      const autoSaved = localStorage.getItem("carousel-generator-autosave");
      if (autoSaved) {
        const parsed = JSON.parse(autoSaved);
        console.log("Found auto-saved work:", parsed);
        console.log("Saved at:", new Date(parsed.savedAt).toLocaleString());
        console.log("Hours since save:", (Date.now() - parsed.savedAt) / (1000 * 60 * 60));
      } else {
        console.log("No auto-saved work found.");
      }
    `)
    return
  }

  const autoSaved = window.localStorage.getItem(AUTOSAVE_KEY)
  if (autoSaved) {
    try {
      const parsed = JSON.parse(autoSaved)
      const savedAt = parsed?.savedAt || 0
      const hoursSinceSave = (Date.now() - savedAt) / (1000 * 60 * 60)
      
      console.log("✅ Found auto-saved work!")
      console.log("Saved at:", new Date(savedAt).toLocaleString())
      console.log("Hours since save:", hoursSinceSave.toFixed(2))
      console.log("Topic:", parsed.data?.topic || "Unknown")
      console.log("Slides count:", parsed.data?.slides?.length || 0)
      
      if (hoursSinceSave > 24) {
        console.warn("⚠️ Auto-save is older than 24 hours and will be cleared on next load.")
      }
    } catch (error) {
      console.error("Error parsing auto-saved data:", error)
    }
  } else {
    console.log("❌ No auto-saved work found.")
  }

  // Also check saved carousels
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      console.log(`\n📦 Found ${parsed.length} saved carousel(s)`)
    } catch (error) {
      console.error("Error parsing saved carousels:", error)
    }
  }
}

checkUnsavedWork()








