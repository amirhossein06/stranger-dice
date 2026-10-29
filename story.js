/* story.js — everything you need to change the story lives here. You never have to touch index.html.
   ABILITIES  : the 8 powers the host hands out (English + Persian text)
   SCENES     : story scenes the host can show to everyone
   TRAPS      : special cells on the board
   ROLES      : the two role cards
   QUESTIONS  : vocabulary questions [question, right answer, [3 wrong answers]] for 3 levels */
window.SD = {

  /* mode: 'turn'   = chosen at the start of your own turn
           'other'  = used during another player's turn (Judger)
           'passive'= works by itself, cash in once (Backpack)
     Every ability can be used ONCE per game. */
  ABILITIES: {
    frozen: {
      name: 'Frozen Mind', mode: 'turn', type: 'time', val: 5,
      en: 'Time freezes: you get 5 extra seconds to answer your question.',
      fa: 'ذهن یخ‌زده: ۵ ثانیه زمان اضافه برای جواب دادن به سوال.'
    },
    elephant: {
      name: 'Elephant Memory', mode: 'turn', type: 'memory',
      en: 'Instead of a vocabulary question, you get a memory question about your own earlier questions (their level, their answers, your dice). Needs 2 answered questions first.',
      fa: 'حافظه‌ی فیل: به‌جای سوال واژگان، یک سوال حافظه‌ای درباره‌ی سوال‌های قبلی خودت می‌آید (سطح، جواب درست، تاس). باید قبلاً به ۲ سوال جواب داده باشی.'
    },
    runner: {
      name: 'Runner', mode: 'turn', type: 'runner',
      en: 'Correct answer: the pawn moves DOUBLE the dice total. Wrong answer: you do NOT go back.',
      fa: 'دونده: با جواب درست، مهره دو برابر عدد تاس جلو می‌رود. با جواب غلط عقب نمی‌روی.'
    },
    tech: {
      name: 'Tech Savvy', mode: 'turn', type: 'swap',
      en: 'After you see your question, you may swap it once for a new one.',
      fa: 'خبره‌ی تکنولوژی: بعد از دیدن سوال، یک بار می‌توانی آن را با سوال دیگری عوض کنی.'
    },
    over: {
      name: 'Over Thinker', mode: 'turn', type: 'fifty',
      en: 'Two wrong options are removed from your question.',
      fa: 'زیادفکر: دو گزینه‌ی غلط از سوالت حذف می‌شود.'
    },
    drama: {
      name: 'Drama Queen', mode: 'turn', type: 'drama',
      en: 'You may choose TWO options. If one of them is right, your answer counts as correct.',
      fa: 'ملکه‌ی دراما: می‌توانی دو گزینه انتخاب کنی. اگر یکی از آن‌ها درست باشد، جوابت درست حساب می‌شود.'
    },
    judger: {
      name: 'Judger', mode: 'other', type: 'judger',
      en: "During another player's turn, before the question appears, predict if they will answer correctly. Right prediction: the pawn moves DOUBLE the dice forward. Wrong prediction: DOUBLE the dice backward.",
      fa: 'داور: در نوبت یک بازیکن دیگر، قبل از دیدن سوال پیش‌بینی می‌کنی جواب درست می‌دهد یا نه. پیش‌بینی درست: مهره دو برابر تاس جلو می‌رود. پیش‌بینی غلط: دو برابر تاس عقب می‌رود.'
    },
    backpack: {
      name: 'Essential Backpack', mode: 'passive', type: 'backpack',
      en: 'Pick two friends. Every correct answer by you or by either friend puts 1 point in your backpack. Cash in once, any time: 1 point = 1 cell forward.',
      fa: 'کوله‌پشتی ضروری: دو نفر را انتخاب کن. با هر جواب درست خودت یا هرکدام از آن دو، یک امتیاز در کوله‌ات جمع می‌شود. یک بار، هر وقت خواستی، خرجش کن: هر امتیاز ۱ خانه جلو.'
    }
  },

  ROLES: {
    traitor: {
      title: 'YOU ARE A TRAITOR', titleFa: 'شما خائن هستید',
      en: 'To win, you must stop the players from moving forward. Do not get caught.',
      fa: 'برای برنده شدن باید جلوی پیشروی بازیکن‌ها را بگیرید. لو نروید.'
    },
    team: {
      title: 'YOU ARE TRAPPED', titleFa: 'شما گیر افتاده‌اید',
      en: 'You are trapped in the Upside Down and you must escape!',
      fa: 'شما در دنیای وارونه گیر افتاده‌اید و باید فرار کنید.'
    }
  },

  /* special cells. kind: harder = next question gets harder for the player who lands,
     less = next player has 5 s less time (same level), back = pawn goes back N cells, fwd = pawn goes forward N cells */
  TRAPS: {
    vecna:     { icon: '🌀', name: "Vecna's Curse",       kind: 'harder', text: 'Your next question is harder.' },
    flayer:    { icon: '🧠', name: "Mind Flayer's Shadow", kind: 'less',   val: 5, text: 'The next player has 5 seconds less.' },
    demodog:   { icon: '🐺', name: 'Demodog Pack',        kind: 'back',   val: 3, text: 'The pawn goes back 3 cells.' },
    demogorgon:{ icon: '👹', name: 'Demogorgon',          kind: 'back',   val: 5, text: 'The pawn goes back 5 cells.' },
    eleven:    { icon: '⚡', name: "Eleven's Power",      kind: 'fwd',    val: 2, text: 'The pawn jumps forward 2 cells.' }
  },

  /* board length choices for the host (calibrated with simulations for a 10-minute game) */
  BOARDS: [
    { n: 90,  t: '90 cells — quick players' },
    { n: 100, t: '100 cells' },
    { n: 110, t: '110 cells — recommended', d: 1 },
    { n: 120, t: '120 cells — hard' }
  ],

  FIRST_SCENE: 'start',
  SCENES: {
    start: {
      title: 'The Hawkins Gate',
      text: 'It is night. The power is out and a red rift has opened in the woods next to the lab. You must escape the Upside Down before dawn.',
      gm: 'Introduce the players. Remind them: every power can be used only once.',
      choices: [{ label: 'Enter the woods', to: 'forest' }]
    },
    forest: {
      title: 'The Dark Forest',
      text: 'You hear breathing between the trees. The lights flicker. The Demogorgon is close.',
      gm: 'Wait for the players to decide. Let them describe what they do.',
      choices: [
        { label: 'The Demogorgon grabs someone', to: 'caught' },
        { label: 'Hide in the tunnel', to: 'tunnel' }
      ]
    },
    caught: {
      title: 'In the Demogorgon\'s Grip',
      text: 'The Demogorgon has caught one of you! Decide who helps and what weapon you use.',
      gm: 'If the rescue works, go to the tunnel. If not, go to the lab (captured).',
      choices: [
        { label: 'Rescue works', to: 'tunnel' },
        { label: 'Rescue fails', to: 'lab_trap' }
      ]
    },
    tunnel: {
      title: 'The Tunnels Under the Town',
      text: 'The tunnels are full of sticky vines. Far away, you hear the Demodogs.',
      gm: 'Lead them toward the lab or toward the gate.',
      choices: [
        { label: 'Reach the lab', to: 'lab' },
        { label: 'See the final gate', to: 'gate' }
      ]
    },
    lab_trap: {
      title: 'Prisoners in the Lab',
      text: 'Some of you are stuck in the lab cells. You need to find a way out.',
      gm: 'They must use their powers (and their heads) to get out.',
      choices: [{ label: 'Escape succeeds', to: 'tunnel' }]
    },
    lab: {
      title: 'Hawkins Lab',
      text: 'The halls are empty, but the lights are blinking red. A map on the wall shows the way to the gate.',
      gm: 'Give them a clue and guide them to the gate.',
      choices: [{ label: 'Reach the gate', to: 'gate' }]
    },
    gate: {
      title: 'The Final Gate',
      text: 'The gate of the Upside Down is in front of you. If the pawn reaches the exit before time runs out, you escape.',
      gm: 'Ask the players for their last decision.',
      choices: [{ label: 'Escape succeeds', to: 'win' }]
    },
    win: {
      title: 'Escape',
      text: 'The gate closes behind you. Hawkins is safe, at least until tomorrow night.',
      gm: 'End of the story.',
      choices: []
    }
  },

    /* واژگان Energy Vocabulary — سوال‌ها: [متن سوال، جواب درست، سه گزینه‌ی غلط] در سه سطح آسان، متوسط و سخت */
  QUESTIONS: {
  1: [
    ["to prevent something from being wasted", "conserve", ["switch", "generate", "monitor"]],
    ["to change from using one thing to another", "switch", ["conserve", "charge", "monitor"]],
    ["a machine used in the home", "appliance", ["landfill", "investment", "consumption"]],
    ["poisonous and harmful to living things", "toxic", ["eco-", "saving", "on standby"]],
    ["to produce or create something (e.g., electricity)", "generate", ["monitor", "conserve", "charge"]],
    ["to watch and check something regularly", "monitor", ["generate", "switch", "conserve"]],
    ["a machine that uses hot air to dry clothes", "tumble dryer", ["appliance", "landfill", "national grid"]],
    ["a place where large amounts of rubbish are buried", "landfill", ["national grid", "appliance", "investment"]],
    ["short for ecology/ecological; relating to the environment", "eco-", ["saving", "toxic", "better still"]],
    ["even better (used for emphasis)", "better still", ["on standby", "saving", "investment"]]
  ],
  2: [
    ["We must ____ water.", "conserve", ["generate", "monitor", "charge"]],
    ["Energy-____ light bulbs reduce costs. (adjective)", "-saving", ["eco-", "toxic", "investment"]],
    ["High electricity ____ can be expensive.", "consumption", ["saving", "appliance", "investment"]],
    ["____-friendly products are better for the planet.", "eco", ["toxic", "saving", "standby"]],
    ["Switching providers gave us a good ____. (noun)", "saving", ["consumption", "investment", "landfill"]],
    ["Never leave the computer ____ overnight.", "on standby", ["monitor", "tumble dryer", "landfill"]],
    ["Remember to ____ up your laptop.", "charge", ["monitor", "conserve", "generate"]],
    ["Too much waste goes to the ____.", "landfill", ["national grid", "appliance", "tumble dryer"]],
    ["Solar panels are a good ____.", "investment", ["consumption", "landfill", "appliance"]],
    ["Electricity is supplied from the ____.", "National Grid", ["landfill", "appliance", "tumble dryer"]]
  ],
  3: [
    ["I want to ____ to a more energy-efficient car.", "switch", ["conserve", "monitor", "generate"]],
    ["Plug in the power bank so you can ____ up your phone later.", "charge", ["monitor", "switch", "conserve"]],
    ["Walk to the shop, or ____, cycle.", "better still", ["on standby", "investment", "saving"]],
    ["Wind turbines ____ electricity from the wind.", "generate", ["conserve", "monitor", "switch"]],
    ["Check your meter every week to ____ how much gas you use.", "monitor", ["generate", "conserve", "charge"]],
    ["Old batteries are ____ waste, so don't put them in the bin.", "toxic", ["eco-", "saving", "on standby"]],
    ["Turning off lights when you leave helps to ____ energy.", "conserve", ["generate", "monitor", "charge"]],
    ["The TV still uses a little power when it is ____.", "on standby", ["toxic", "tumble dryer", "landfill"]],
    ["Using a washing line instead of a ____ saves electricity.", "tumble dryer", ["landfill", "national grid", "investment"]],
    ["The network that connects power stations across the country is the ____.", "national grid", ["landfill", "appliance", "investment"]]
  ]
  }
};
