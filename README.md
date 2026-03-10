# Capri Italian Recipes

A browser-based, interactive cooking guide for classic Italian dishes. Select a recipe and follow a step-by-step guide complete with ingredient highlighting and a built-in countdown timer for each cooking step.

## Recipes Included

- Spaghetti Carbonara
- Margherita Pizza
- Fettuccine Alfredo
- Lasagna

## Features

- **Step-by-step cooking guide** — Navigate through each recipe one step at a time using Previous Step and Next Step buttons.
- **Per-step ingredient highlighting** — The full ingredient list in the sidebar highlights the specific ingredients needed for the current step.
- **Countdown timers** — Steps that require timed cooking display a MM:SS countdown timer with Start, Pause, and Reset controls.
- **Completion banner** — A confirmation message appears when all steps are finished.

## Project Structure

```
capri-recipes/
├── index.html   # Page structure and layout
├── styles.css   # All styling and color palette
└── script.js    # Recipe data, step navigation logic, and timer logic
```

## How to Run

No build tools, servers, or dependencies are required. This is a plain HTML/CSS/JavaScript project.

1. Clone the repository:
   ```bash
   git clone https://github.com/jmgomez919/capri-recipes.git
   ```

2. Open the project folder:
   ```bash
   cd capri-recipes
   ```

3. Open `index.html` in any modern web browser:
   - **Windows:** Double-click `index.html`, or right-click → Open with → your browser
   - **Mac/Linux:** `open index.html` or `xdg-open index.html`

No internet connection is required after cloning.

## How It Works

### Step System
Each recipe contains an array of step objects in `script.js`. Every step holds:
- `instruction` — the text displayed on the step card
- `ingredients` — the subset of ingredients used in that step (drives sidebar highlighting and pill tags)
- `timer` — duration in seconds (`0` means no timer is shown for that step)

`renderStep()` is called each time the user navigates, redrawing the card, syncing the sidebar highlights, and resetting the timer.

### Countdown Timer
Steps with a `timer > 0` display a countdown in MM:SS format. The timer uses `setInterval` (1-second ticks) and supports Start, Pause, and Reset. When the count reaches zero, the interval clears automatically and the display shows `Done! ✓`. Changing steps always resets any active timer.

## Browser Compatibility

Works in all modern browsers (Chrome, Firefox, Safari, Edge). No polyfills needed.

---

*Created for DIG4503C — Jacob Gomez*
