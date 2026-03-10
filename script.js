/* ============================================================
   LA CUCINA ITALIANA — SCRIPT

   HOW THE STEP SYSTEM WORKS
   --------------------------
   Each recipe has an array of `steps`. Every step object holds:
     • instruction  — the text shown in the step card
     • ingredients  — an array of ingredient strings used IN that step
                      (used to highlight the sidebar and show pill tags)
     • timer        — duration in SECONDS (0 = no timer for this step)

   `currentStepIndex` tracks which step the user is on.
   Calling renderStep() redraws the card, highlights sidebar
   ingredients, and resets the timer.

   HOW THE COUNTDOWN TIMER WORKS
   --------------------------------
   Each step with timer > 0 shows a countdown display (MM:SS).
   `timerInterval` holds the setInterval reference so we can
   clear it when pausing, resetting, or changing steps.
   `timerRemaining` is decremented every second. When it hits 0
   the interval clears, the display shows "Done!" and a sound-
   free visual cue plays.
   ============================================================ */

// ============================================================
// RECIPE DATA
// ============================================================
const recipes = [
  {
    id: 'carbonara',
    title: 'Spaghetti Carbonara',
    emoji: '🍝',
    servings: '2 servings · 30 min',
    ingredients: [
      '200 g spaghetti',
      '100 g guanciale (or pancetta)',
      '2 large eggs + 1 yolk',
      '50 g Pecorino Romano, grated',
      '50 g Parmesan, grated',
      'Freshly ground black pepper',
      'Salt (for pasta water)',
    ],
    steps: [
      {
        instruction:
          'Bring a large pot of water to a rolling boil. Add a generous pinch of salt — the water should taste like the sea. Drop in the spaghetti and cook until al dente per package directions.',
        ingredients: ['200 g spaghetti', 'Salt (for pasta water)'],
        timer: 480, // 8 minutes
      },
      {
        instruction:
          'While the pasta cooks, slice the guanciale into small lardons. Place in a cold skillet, then turn heat to medium. Cook, stirring occasionally, until the fat renders and the edges turn golden and crispy.',
        ingredients: ['100 g guanciale (or pancetta)'],
        timer: 300, // 5 minutes
      },
      {
        instruction:
          'In a bowl, whisk together the eggs, extra yolk, Pecorino Romano, and Parmesan until you have a smooth, pale cream. Season generously with black pepper.',
        ingredients: [
          '2 large eggs + 1 yolk',
          '50 g Pecorino Romano, grated',
          '50 g Parmesan, grated',
          'Freshly ground black pepper',
        ],
        timer: 0, // no timer — just mixing
      },
      {
        instruction:
          'Remove the skillet from heat. Reserve 1 cup of pasta cooking water, then drain the spaghetti. Add the hot pasta to the skillet and toss to coat with the rendered fat.',
        ingredients: ['200 g spaghetti', '100 g guanciale (or pancetta)'],
        timer: 0,
      },
      {
        instruction:
          'Off the heat, pour the egg-cheese mixture over the pasta. Quickly toss and stir, adding pasta water a splash at a time until you have a glossy, creamy sauce that coats every strand. Serve immediately with extra Pecorino and pepper.',
        ingredients: [
          '2 large eggs + 1 yolk',
          '50 g Pecorino Romano, grated',
          '50 g Parmesan, grated',
          'Freshly ground black pepper',
        ],
        timer: 60, // 1 minute — quick tossing window
      },
    ],
  },

  {
    id: 'pizza',
    title: 'Margherita Pizza',
    emoji: '🍕',
    servings: '2 servings · 1 hr 30 min',
    ingredients: [
      '300 g 00 flour (or bread flour)',
      '1 tsp active dry yeast',
      '180 ml warm water',
      '1 tsp salt',
      '1 tsp olive oil',
      '150 ml San Marzano tomato sauce',
      '200 g fresh mozzarella, torn',
      'Fresh basil leaves',
      'Extra-virgin olive oil (for drizzle)',
    ],
    steps: [
      {
        instruction:
          'Dissolve the yeast in warm water (around 38 °C / 100 °F) and let it sit until foamy, about 5 minutes. Mix flour and salt in a large bowl, then pour in the yeast water and olive oil. Knead on a floured surface for 8–10 minutes until smooth and elastic.',
        ingredients: [
          '300 g 00 flour (or bread flour)',
          '1 tsp active dry yeast',
          '180 ml warm water',
          '1 tsp salt',
          '1 tsp olive oil',
        ],
        timer: 300, // 5-minute yeast proof
      },
      {
        instruction:
          'Shape the dough into a ball, place in a lightly oiled bowl, and cover with a damp cloth. Let rise in a warm place until doubled in size.',
        ingredients: ['1 tsp olive oil'],
        timer: 3600, // 60-minute rise
      },
      {
        instruction:
          'Preheat your oven to its maximum temperature (250–280 °C / 480–540 °F) with a pizza stone or heavy baking sheet inside. Punch down the risen dough. On a floured surface, stretch and shape it into a 30 cm round, keeping the edges slightly thicker.',
        ingredients: ['300 g 00 flour (or bread flour)'],
        timer: 1800, // 30-minute preheat
      },
      {
        instruction:
          'Spoon the tomato sauce over the base, spreading to within 1 cm of the edge. Scatter the torn mozzarella evenly. Slide onto the preheated stone.',
        ingredients: [
          '150 ml San Marzano tomato sauce',
          '200 g fresh mozzarella, torn',
        ],
        timer: 0,
      },
      {
        instruction:
          'Bake until the crust is charred at the edges and the cheese is bubbling and golden in spots. Remove from oven, immediately add fresh basil leaves, and finish with a drizzle of extra-virgin olive oil.',
        ingredients: [
          'Fresh basil leaves',
          'Extra-virgin olive oil (for drizzle)',
        ],
        timer: 600, // 10-minute bake
      },
    ],
  },

  {
    id: 'alfredo',
    title: 'Fettuccine Alfredo',
    emoji: '🍜',
    servings: '2 servings · 25 min',
    ingredients: [
      '200 g fettuccine',
      '115 g unsalted butter',
      '120 ml heavy cream',
      '100 g Parmesan, freshly grated',
      'Salt (for pasta water)',
      'Freshly ground black pepper',
      'Fresh parsley (optional garnish)',
    ],
    steps: [
      {
        instruction:
          'Bring a large pot of heavily salted water to a boil. Cook the fettuccine until al dente. Reserve 1 cup of pasta water before draining.',
        ingredients: ['200 g fettuccine', 'Salt (for pasta water)'],
        timer: 480, // 8 minutes
      },
      {
        instruction:
          'In a wide skillet over medium-low heat, melt the butter completely. Pour in the heavy cream and stir gently to combine. Let the mixture warm through and barely begin to simmer.',
        ingredients: ['115 g unsalted butter', '120 ml heavy cream'],
        timer: 180, // 3 minutes
      },
      {
        instruction:
          'Remove the pan from heat. Add the freshly grated Parmesan in two additions, stirring vigorously after each. The residual heat will melt the cheese into a silky sauce. Season with black pepper.',
        ingredients: [
          '100 g Parmesan, freshly grated',
          'Freshly ground black pepper',
        ],
        timer: 0,
      },
      {
        instruction:
          'Add the drained fettuccine to the sauce. Toss with tongs, adding splashes of reserved pasta water to loosen the sauce to a creamy, flowing consistency that clings to every noodle. Garnish with parsley and serve at once.',
        ingredients: [
          '200 g fettuccine',
          'Fresh parsley (optional garnish)',
        ],
        timer: 60, // 1 minute tossing
      },
    ],
  },

  {
    id: 'lasagna',
    title: 'Lasagna',
    emoji: '🫕',
    servings: '6 servings · 2 hr 30 min',
    ingredients: [
      '12 lasagna sheets (no-boil or pre-cooked)',
      '500 g ground beef',
      '500 g ground pork',
      '1 onion, finely diced',
      '2 garlic cloves, minced',
      '400 g crushed tomatoes',
      '2 tbsp tomato paste',
      '1 tsp dried oregano',
      '60 g unsalted butter',
      '60 g all-purpose flour',
      '700 ml whole milk',
      'Pinch of nutmeg',
      '250 g ricotta cheese',
      '200 g mozzarella, shredded',
      '60 g Parmesan, grated',
      'Salt & black pepper',
      '2 tbsp olive oil',
    ],
    steps: [
      {
        instruction:
          'Heat olive oil in a large pot over medium-high heat. Sauté the diced onion until translucent (3–4 min), then add the garlic and cook 1 minute more. Add the ground beef and pork, breaking up lumps, and cook until no longer pink.',
        ingredients: [
          '500 g ground beef',
          '500 g ground pork',
          '1 onion, finely diced',
          '2 garlic cloves, minced',
          '2 tbsp olive oil',
        ],
        timer: 420, // 7 minutes
      },
      {
        instruction:
          'Stir in the tomato paste and cook for 2 minutes. Add the crushed tomatoes, oregano, salt and pepper. Reduce heat to low and simmer, partially covered, stirring occasionally, until the sauce is rich and thickened.',
        ingredients: [
          '400 g crushed tomatoes',
          '2 tbsp tomato paste',
          '1 tsp dried oregano',
          'Salt & black pepper',
        ],
        timer: 1800, // 30-minute simmer
      },
      {
        instruction:
          'Make the béchamel: melt butter in a saucepan over medium heat. Whisk in flour and cook, stirring constantly, for 2 minutes to form a pale roux. Gradually pour in the warm milk, whisking constantly to prevent lumps. Simmer, stirring, until the sauce thickens. Season with salt, pepper, and a pinch of nutmeg.',
        ingredients: [
          '60 g unsalted butter',
          '60 g all-purpose flour',
          '700 ml whole milk',
          'Pinch of nutmeg',
          'Salt & black pepper',
        ],
        timer: 480, // 8 minutes
      },
      {
        instruction:
          'Preheat oven to 190 °C / 375 °F. In a 23×33 cm baking dish, spread a thin layer of meat sauce. Layer: lasagna sheets → meat sauce → dollops of ricotta → béchamel → shredded mozzarella. Repeat layers, finishing with béchamel, mozzarella, and a generous dusting of Parmesan.',
        ingredients: [
          '12 lasagna sheets (no-boil or pre-cooked)',
          '250 g ricotta cheese',
          '200 g mozzarella, shredded',
          '60 g Parmesan, grated',
        ],
        timer: 0,
      },
      {
        instruction:
          'Cover tightly with foil and bake. Then uncover and bake until the top is bubbling and deep golden brown. Remove from oven and let rest before slicing — this is the hardest but most important step!',
        ingredients: [],
        timer: 4500, // 75 minutes total bake
      },
    ],
  },
];

// ============================================================
// APPLICATION STATE
// ============================================================
let currentRecipe = null;   // The recipe object currently being viewed
let currentStepIndex = 0;   // Which step the user is on (0-based)

// Timer state
let timerInterval  = null;  // setInterval reference
let timerRemaining = 0;     // Seconds left on the current step's timer
let timerRunning   = false; // Whether the timer is actively counting down

// ============================================================
// PAGE NAVIGATION
// ============================================================

/** Show a named page and hide all others. */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

// ============================================================
// HOMEPAGE — Build recipe cards
// ============================================================

function buildHomepage() {
  const grid = document.getElementById('recipe-grid');
  grid.innerHTML = '';

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <div class="card-body">
        <div class="card-title">${recipe.title}</div>
        <div class="card-meta">${recipe.servings}</div>
        <button class="card-btn">Start Cooking &#8594;</button>
      </div>
    `;
    // Clicking anywhere on the card opens the recipe
    card.addEventListener('click', () => openRecipe(recipe));
    grid.appendChild(card);
  });
}

// ============================================================
// OPEN A RECIPE
// ============================================================

function openRecipe(recipe) {
  currentRecipe = recipe;
  currentStepIndex = 0;

  // Set header title
  document.getElementById('recipe-title').textContent = recipe.title;

  // Populate the full ingredients sidebar
  const list = document.getElementById('ingredients-list');
  list.innerHTML = '';
  recipe.ingredients.forEach(ing => {
    const li = document.createElement('li');
    li.textContent = ing;
    li.dataset.ingredient = ing; // used for highlighting
    list.appendChild(li);
  });

  clearTimer(); // always reset timer when opening a new recipe
  renderStep();
  showPage('page-recipe');
}

// ============================================================
// STEP RENDERING
// The heart of the step system. Called every time the user
// moves to a different step.
// ============================================================

function renderStep() {
  const step  = currentRecipe.steps[currentStepIndex];
  const total = currentRecipe.steps.length;

  // -- Step text --
  document.getElementById('step-title').textContent =
    `Step ${currentStepIndex + 1}`;
  document.getElementById('step-instruction').textContent = step.instruction;

  // -- Ingredients used in this step --
  const stepIngList = document.getElementById('step-ingredients');
  stepIngList.innerHTML = '';
  if (step.ingredients.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No specific ingredients for this step';
    li.style.background = 'transparent';
    li.style.color = '#666';
    li.style.fontSize = '0.85rem';
    stepIngList.appendChild(li);
  } else {
    step.ingredients.forEach(ing => {
      const li = document.createElement('li');
      li.textContent = ing;
      stepIngList.appendChild(li);
    });
  }

  // -- Highlight matching ingredients in the sidebar --
  // First clear all highlights, then add .highlight to matches.
  document.querySelectorAll('#ingredients-list li').forEach(li => {
    li.classList.remove('highlight');
    if (step.ingredients.includes(li.dataset.ingredient)) {
      li.classList.add('highlight');
    }
  });

  // -- Timer --
  // Reset any running timer before setting up the new step's timer.
  clearTimer();
  const timerSection = document.getElementById('timer-section');

  if (step.timer > 0) {
    timerSection.classList.remove('hidden');
    timerRemaining = step.timer;
    updateTimerDisplay(timerRemaining);
    document.getElementById('btn-timer-start').disabled = false;
    document.getElementById('btn-timer-pause').disabled = true;
  } else {
    // No timer needed for this step — hide the timer UI
    timerSection.classList.add('hidden');
  }

  // -- Navigation button states --
  document.getElementById('btn-prev').disabled = currentStepIndex === 0;
  document.getElementById('btn-next').disabled =
    currentStepIndex === total - 1;

  // -- Completion banner --
  // Only shown after the last step (handled in nextStep)
  document.getElementById('completion-banner').classList.add('hidden');
}

// ============================================================
// STEP NAVIGATION
// ============================================================

function nextStep() {
  if (currentStepIndex < currentRecipe.steps.length - 1) {
    currentStepIndex++;
    renderStep();
  } else {
    // User clicked "Next" on the final step → show completion banner
    document.getElementById('completion-banner').classList.remove('hidden');
    document.getElementById('btn-next').disabled = true;
  }
}

function prevStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    renderStep();
  }
}

// ============================================================
// COUNTDOWN TIMER
//
// Three public functions that the HTML buttons call directly:
//   startTimer()  — begins counting down from timerRemaining
//   pauseTimer()  — freezes timerRemaining, clears the interval
//   resetTimer()  — restores timerRemaining to the step's full duration
//
// The interval fires every 1000 ms. Each tick:
//   1. Decrements timerRemaining by 1
//   2. Updates the display
//   3. If timerRemaining hits 0, stops automatically
// ============================================================

function startTimer() {
  if (timerRunning) return; // guard against double-start
  timerRunning = true;

  document.getElementById('btn-timer-start').disabled = true;
  document.getElementById('btn-timer-pause').disabled = false;
  document.getElementById('timer-display').classList.add('running');

  timerInterval = setInterval(() => {
    timerRemaining--;
    updateTimerDisplay(timerRemaining);

    if (timerRemaining <= 0) {
      // Timer finished — stop the interval and show "Done!"
      clearInterval(timerInterval);
      timerInterval = null;
      timerRunning = false;
      document.getElementById('timer-display').textContent = 'Done! ✓';
      document.getElementById('timer-display').classList.remove('running');
      document.getElementById('btn-timer-pause').disabled = true;
    }
  }, 1000);
}

function pauseTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
  document.getElementById('btn-timer-start').disabled = false;
  document.getElementById('btn-timer-pause').disabled = true;
  document.getElementById('timer-display').classList.remove('running');
}

function resetTimer() {
  // Stop any running timer first
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;

  // Restore to the current step's full timer value
  const step = currentRecipe.steps[currentStepIndex];
  timerRemaining = step.timer;
  updateTimerDisplay(timerRemaining);

  document.getElementById('btn-timer-start').disabled = false;
  document.getElementById('btn-timer-pause').disabled = true;
  document.getElementById('timer-display').classList.remove('running');
}

/**
 * Completely stops and hides the timer.
 * Called when navigating between steps or opening a recipe.
 */
function clearTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
  timerRemaining = 0;
  document.getElementById('timer-display').textContent = '00:00';
  document.getElementById('timer-display').classList.remove('running');
}

/**
 * Formats a duration in seconds to MM:SS and writes it to the display.
 * e.g. 305 → "05:05"
 */
function updateTimerDisplay(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  document.getElementById('timer-display').textContent = `${m}:${s}`;
}

// ============================================================
// BACK BUTTON
// ============================================================

document.getElementById('btn-back').addEventListener('click', () => {
  clearTimer();
  showPage('page-home');
});

// ============================================================
// INITIALISE
// ============================================================
buildHomepage();
