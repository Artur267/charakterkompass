"use strict";

const STORAGE_KEY = "charakter-kompass-v1";
const TYPE_ORDER = ["D", "I", "S", "G"];
const SVG_NS = "http://www.w3.org/2000/svg";

// Jeder Block enthält vier Eigenschaften mit fester Typ-Zuordnung.
const blocks = [
  [
    { label: "begeistert", type: "I" },
    { label: "entschlossen", type: "D" },
    { label: "gewissenhaft", type: "G" },
    { label: "loyal", type: "S" },
  ],
  [
    { label: "konkurrierend", type: "D" },
    { label: "ausgleichend", type: "S" },
    { label: "gesellig", type: "I" },
    { label: "gründlich", type: "G" },
  ],
  [
    { label: "reserviert", type: "G" },
    { label: "gewinnend", type: "I" },
    { label: "gutmütig", type: "S" },
    { label: "ruhelos", type: "D" },
  ],
  [
    { label: "freundlich", type: "I" },
    { label: "aggressiv", type: "D" },
    { label: "logisch", type: "G" },
    { label: "entspannt", type: "S" },
  ],
  [
    { label: "einsichtig", type: "S" },
    { label: "kontaktfreudig", type: "I" },
    { label: "anspruchsvoll", type: "D" },
    { label: "vorsichtig", type: "G" },
  ],
  [
    { label: "beherrscht", type: "G" },
    { label: "nett", type: "I" },
    { label: "aufmerksam", type: "S" },
    { label: "stur", type: "D" },
  ],
  [
    { label: "willensstark", type: "D" },
    { label: "taktvoll", type: "G" },
    { label: "mitfühlend", type: "S" },
    { label: "verspielt", type: "I" },
  ],
  [
    { label: "inspirierend", type: "I" },
    { label: "beständig", type: "S" },
    { label: "hartnäckig", type: "D" },
    { label: "akkurat", type: "G" },
  ],
  [
    { label: "verbindlich", type: "S" },
    { label: "einsichtig", type: "G" },
    { label: "gesprächig", type: "I" },
    { label: "herausfordernd", type: "D" },
  ],
  [
    { label: "direkt", type: "D" },
    { label: "fröhlich", type: "I" },
    { label: "diplomatisch", type: "G" },
    { label: "rücksichtsvoll", type: "S" },
  ],
];

const typeInfo = {
  D: {
    name: "Choleriker",
    color: "#d94d50",
    quadrant: "oben links",
    axis: "aufgabenorientiert + offensiv/extrovertiert",
    short:
      "Energiegeladen, direkt, entscheidungsfreudig, ziel- und aufgabenorientiert. Will Dinge bewegen und übernimmt gerne Verantwortung.",
    strengths: [
      "entschlossen",
      "mutig",
      "durchsetzungsfähig",
      "lösungsorientiert",
      "übernimmt Führung",
      "treibt Projekte voran",
    ],
    weaknesses: [
      "kann ungeduldig wirken",
      "manchmal zu direkt",
      "übergeht Gefühle anderer",
      "will Kontrolle behalten",
      "hört nicht immer lange zu",
    ],
    tips: [
      "bewusster zuhören",
      "andere stärker einbeziehen",
      "Pausen vor Entscheidungen machen",
      "Empathie trainieren",
      "nicht jede Situation als Wettbewerb sehen",
    ],
    profile:
      "Dein Profil ist stark auf Wirksamkeit, Tempo und klare Ergebnisse ausgerichtet. Du erkennst schnell, wo etwas entschieden oder bewegt werden muss, und gehst lieber in die Verantwortung, als lange abzuwarten.",
    selfEffect:
      "Deine Eigenwirkung entsteht vor allem durch Präsenz, Klarheit und Entscheidungsfreude. Du vermittelst: Hier passiert etwas, es gibt eine Richtung, und Hindernisse werden aktiv angegangen.",
    externalEffect:
      "Andere können dich als kraftvoll, fokussiert und verlässlich in Drucksituationen erleben. Wenn dein Tempo sehr hoch ist, kann dieselbe Energie aber auch als dominant, ungeduldig oder wenig einladend interpretiert werden.",
  },
  I: {
    name: "Sanguiniker",
    color: "#d99425",
    quadrant: "oben rechts",
    axis: "menschenorientiert + offensiv/extrovertiert",
    short:
      "Offen, begeisternd, kontaktfreudig und menschenorientiert. Bringt Energie in Gruppen und motiviert andere.",
    strengths: [
      "kommunikativ",
      "optimistisch",
      "begeisterungsfähig",
      "kreativ",
      "motivierend",
      "verbindend",
    ],
    weaknesses: [
      "verliert sich manchmal in Ideen",
      "kann Details übersehen",
      "braucht Anerkennung",
      "startet mehr, als beendet wird",
      "kann unstrukturiert wirken",
    ],
    tips: [
      "Prioritäten setzen",
      "Aufgaben schriftlich festhalten",
      "Zusagen realistisch prüfen",
      "Fokuszeiten einplanen",
      "auch unangenehme Details ernst nehmen",
    ],
    profile:
      "Dein Profil ist kontaktstark, beweglich und ideenorientiert. Du reagierst schnell auf Stimmungen, bringst Menschen zusammen und findest oft einen positiven Zugang, selbst wenn Situationen noch unklar sind.",
    selfEffect:
      "Deine Eigenwirkung entsteht durch Begeisterung, Offenheit und sprachliche Lebendigkeit. Du vermittelst: Austausch lohnt sich, Ideen dürfen wachsen, und eine Gruppe kann gemeinsam Energie entwickeln.",
    externalEffect:
      "Andere können dich als inspirierend, nahbar und motivierend erleben. Wenn zu viele Impulse gleichzeitig kommen, kann das aber auch als sprunghaft, unstrukturiert oder zu wenig verbindlich interpretiert werden.",
  },
  S: {
    name: "Phlegmatiker",
    color: "#26977d",
    quadrant: "unten rechts",
    axis: "menschenorientiert + defensiv/introvertiert",
    short:
      "Ruhig, loyal, geduldig, ausgleichend und menschenorientiert. Sorgt für Stabilität und Harmonie.",
    strengths: [
      "zuverlässig",
      "empathisch",
      "geduldig",
      "loyal",
      "guter Zuhörer",
      "teamorientiert",
      "ausgleichend",
    ],
    weaknesses: [
      "vermeidet Konflikte",
      "sagt manchmal zu spät Nein",
      "Veränderungen können schwerfallen",
      "stellt eigene Bedürfnisse zurück",
      "kann passiv wirken",
    ],
    tips: [
      "eigene Meinung klarer äußern",
      "Grenzen setzen",
      "Veränderungen Schritt für Schritt zulassen",
      "Konflikte früher ansprechen",
      "Bedürfnisse nicht verstecken",
    ],
    profile:
      "Dein Profil ist stabilisierend, beziehungsorientiert und ausgleichend. Du nimmst wahr, was Menschen brauchen, und schaffst durch Ruhe, Verlässlichkeit und Geduld eine sichere Atmosphäre.",
    selfEffect:
      "Deine Eigenwirkung entsteht durch Beständigkeit, Zuhören und eine unaufgeregte Präsenz. Du vermittelst: Man kann sich auf dich verlassen, Spannungen müssen nicht eskalieren, und Zusammenarbeit darf menschlich bleiben.",
    externalEffect:
      "Andere können dich als vertrauenswürdig, warm und angenehm kooperativ erleben. Wenn du dich stark zurücknimmst, kann das aber auch als Unsicherheit, Passivität oder fehlende klare Position interpretiert werden.",
  },
  G: {
    name: "Melancholiker",
    color: "#5867c8",
    quadrant: "unten links",
    axis: "aufgabenorientiert + defensiv/introvertiert",
    short:
      "Analytisch, gewissenhaft, strukturiert, genau und aufgabenorientiert. Denkt tief nach und legt Wert auf Qualität.",
    strengths: [
      "gründlich",
      "zuverlässig",
      "reflektiert",
      "qualitätsbewusst",
      "analytisch",
      "verantwortungsvoll",
      "strukturiert",
    ],
    weaknesses: [
      "kann perfektionistisch sein",
      "entscheidet manchmal zu langsam",
      "kritisiert sich selbst stark",
      "wirkt distanziert",
      "bleibt lange bei Fehlern hängen",
    ],
    tips: [
      "Fortschritt vor Perfektion setzen",
      "Entscheidungen mit Zeitlimit treffen",
      "Erfolge bewusst wahrnehmen",
      "Fehler als Lernmomente sehen",
      "öfter ins Handeln kommen",
    ],
    profile:
      "Dein Profil ist analytisch, qualitätsbewusst und reflektiert. Du willst Dinge verstehen, bevor du sie bewertest, und achtest darauf, dass Ergebnisse nicht nur schnell, sondern auch sauber und tragfähig sind.",
    selfEffect:
      "Deine Eigenwirkung entsteht durch Genauigkeit, Struktur und einen ruhigen, prüfenden Blick. Du vermittelst: Qualität zählt, Details sind relevant, und gute Entscheidungen brauchen Substanz.",
    externalEffect:
      "Andere können dich als verlässlich, klug und sorgfältig erleben. Wenn du sehr kritisch oder zurückhaltend wirkst, kann das aber auch als distanziert, perfektionistisch oder schwer zufriedenzustellen interpretiert werden.",
  },
};

// Zentrale DOM-Referenzen halten die Renderfunktionen übersichtlich.
const elements = {
  saveStatus: document.querySelector("#saveStatus"),
  userName: document.querySelector("#userName"),
  quizView: document.querySelector("#quizView"),
  resultView: document.querySelector("#resultView"),
  resultHeading: document.querySelector("#resultHeading"),
  resultPerson: document.querySelector("#resultPerson"),
  progressText: document.querySelector("#progressText"),
  progressMeter: document.querySelector("#progressMeter"),
  progressFill: document.querySelector("#progressFill"),
  traitForm: document.querySelector("#traitForm"),
  validationMessage: document.querySelector("#validationMessage"),
  roundFeedback: document.querySelector("#roundFeedback"),
  blockDots: document.querySelector("#blockDots"),
  backButton: document.querySelector("#backButton"),
  nextButton: document.querySelector("#nextButton"),
  resetButton: document.querySelector("#resetButton"),
  profileBadge: document.querySelector("#profileBadge"),
  scoreTotal: document.querySelector("#scoreTotal"),
  scoreBars: document.querySelector("#scoreBars"),
  quadrantChart: document.querySelector("#quadrantChart"),
  interpretationHeading: document.querySelector("#interpretationHeading"),
  mainDescription: document.querySelector("#mainDescription"),
  secondaryType: document.querySelector("#secondaryType"),
  profileAssessment: document.querySelector("#profileAssessment"),
  selfEffect: document.querySelector("#selfEffect"),
  externalEffect: document.querySelector("#externalEffect"),
  strengthList: document.querySelector("#strengthList"),
  weaknessList: document.querySelector("#weaknessList"),
  tipsList: document.querySelector("#tipsList"),
  editAnswersButton: document.querySelector("#editAnswersButton"),
  copyResultButton: document.querySelector("#copyResultButton"),
  downloadPdfButton: document.querySelector("#downloadPdfButton"),
  restartResultButton: document.querySelector("#restartResultButton"),
  copyStatus: document.querySelector("#copyStatus"),
  toast: document.querySelector("#toast"),
};

let state = loadState();
let toastTimer = 0;
let hasRenderedBlock = false;

render();

elements.userName.addEventListener("input", () => {
  state.userName = elements.userName.value;
  saveState();
});

elements.traitForm.addEventListener("change", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.type !== "radio") {
    return;
  }

  const traitIndex = Number(input.dataset.traitIndex);
  state.answers[state.currentBlock][traitIndex] = Number(input.value);
  saveState();
  updateValidationHint(false);
  renderBlockDots();
});

elements.backButton.addEventListener("click", () => {
  if (state.currentBlock > 0) {
    state.currentBlock -= 1;
    saveState();
    renderBlock();
  }
});

elements.nextButton.addEventListener("click", () => {
  if (!isBlockValid(state.currentBlock)) {
    updateValidationHint(true);
    focusValidationMessage();
    return;
  }

  const finishedBlock = state.currentBlock + 1;
  if (state.currentBlock === blocks.length - 1) {
    state.showResult = true;
    saveState();
    renderResult();
    showToast("Alle Blöcke geschafft. Dein Profil ist bereit.");
    return;
  }

  state.currentBlock += 1;
  saveState();
  renderBlock();
  showToast(`Block ${finishedBlock} abgeschlossen. Stark sortiert.`);
});

elements.resetButton.addEventListener("click", resetTest);
elements.restartResultButton.addEventListener("click", resetTest);

elements.editAnswersButton.addEventListener("click", () => {
  state.showResult = false;
  state.currentBlock = blocks.length - 1;
  saveState();
  renderBlock();
});

elements.copyResultButton.addEventListener("click", async () => {
  const resultText = buildResultText();

  try {
    await copyText(resultText);
    elements.copyStatus.textContent = "Ergebnis wurde kopiert.";
  } catch {
    elements.copyStatus.textContent =
      "Kopieren war nicht möglich. Markiere den Ergebnistext bitte manuell.";
  }
});

elements.downloadPdfButton.addEventListener("click", () => {
  downloadResultPdf();
});

function createEmptyAnswers() {
  return blocks.map(() => Array(4).fill(null));
}

function loadState() {
  const fallback = {
    userName: "",
    currentBlock: 0,
    showResult: false,
    answers: createEmptyAnswers(),
  };

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || !Array.isArray(stored.answers)) {
      return fallback;
    }

    return {
      userName: typeof stored.userName === "string" ? stored.userName.slice(0, 80) : "",
      currentBlock: clampNumber(stored.currentBlock, 0, blocks.length - 1),
      showResult: Boolean(stored.showResult),
      answers: normalizeAnswers(stored.answers),
    };
  } catch {
    return fallback;
  }
}

function normalizeAnswers(savedAnswers) {
  // Gespeicherte Daten werden defensiv geprüft, damit alte oder kaputte Werte nicht stören.
  return blocks.map((block, blockIndex) => {
    const savedBlock = Array.isArray(savedAnswers[blockIndex])
      ? savedAnswers[blockIndex]
      : [];

    return block.map((_, traitIndex) => {
      const value = Number(savedBlock[traitIndex]);
      return [1, 2, 3, 4].includes(value) ? value : null;
    });
  });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  elements.saveStatus.textContent = "Gespeichert";
}

function render() {
  elements.userName.value = state.userName;

  if (state.showResult && blocks.every((_, index) => isBlockValid(index))) {
    renderResult();
  } else {
    state.showResult = false;
    renderBlock();
  }
}

function renderBlock() {
  elements.quizView.hidden = false;
  elements.resultView.hidden = true;
  elements.copyStatus.textContent = "";

  const blockNumber = state.currentBlock + 1;
  const progressPercent = (blockNumber / blocks.length) * 100;
  elements.progressText.textContent = `Block ${blockNumber} von ${blocks.length}`;
  elements.progressMeter.setAttribute("aria-valuenow", String(blockNumber));
  elements.progressFill.style.width = `${progressPercent}%`;
  elements.nextButton.textContent =
    state.currentBlock === blocks.length - 1 ? "Ergebnis anzeigen" : "Weiter";
  elements.backButton.disabled = state.currentBlock === 0;
  elements.validationMessage.hidden = true;
  elements.roundFeedback.textContent = getCompletionText();

  elements.traitForm.innerHTML = "";
  blocks[state.currentBlock].forEach((trait, traitIndex) => {
    elements.traitForm.appendChild(createTraitField(trait, traitIndex));
  });

  renderBlockDots();
  if (hasRenderedBlock) {
    animateQuizCard();
  } else {
    hasRenderedBlock = true;
  }
}

function createTraitField(trait, traitIndex) {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "trait-card";

  const legend = document.createElement("legend");
  legend.textContent = trait.label;
  fieldset.appendChild(legend);

  const options = document.createElement("div");
  options.className = "scale-options";

  [1, 2, 3, 4].forEach((value) => {
    const inputId = `block-${state.currentBlock}-trait-${traitIndex}-value-${value}`;
    const input = document.createElement("input");
    input.type = "radio";
    input.id = inputId;
    input.name = `trait-${traitIndex}`;
    input.value = String(value);
    input.dataset.traitIndex = String(traitIndex);
    input.checked = state.answers[state.currentBlock][traitIndex] === value;

    const label = document.createElement("label");
    label.setAttribute("for", inputId);
    label.innerHTML = `${value}<span>${getScaleLabel(value)}</span>`;

    options.append(input, label);
  });

  fieldset.appendChild(options);
  return fieldset;
}

function getScaleLabel(value) {
  const labels = {
    1: "wenig",
    2: "etwas",
    3: "eher",
    4: "stark",
  };
  return labels[value];
}

function getCompletionText() {
  const validBlocks = blocks.filter((_, index) => isBlockValid(index)).length;
  if (validBlocks === 0) {
    return "";
  }

  return `${validBlocks} von ${blocks.length} Blöcken sind vollständig.`;
}

function renderBlockDots() {
  elements.blockDots.innerHTML = "";

  blocks.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = "block-dot";
    dot.textContent = String(index + 1);
    dot.setAttribute(
      "aria-label",
      `Block ${index + 1}: ${isBlockValid(index) ? "vollständig" : "offen"}`,
    );

    if (isBlockValid(index)) {
      dot.classList.add("done");
    }

    if (index === state.currentBlock && !state.showResult) {
      dot.classList.add("active");
    }

    elements.blockDots.appendChild(dot);
  });
}

function updateValidationHint(showError) {
  if (!showError) {
    elements.validationMessage.hidden = true;
    return;
  }

  const values = state.answers[state.currentBlock].filter((value) => value !== null);
  const missingValues = [1, 2, 3, 4].filter((value) => !values.includes(value));
  const duplicateValues = [1, 2, 3, 4].filter(
    (value) => values.filter((selected) => selected === value).length > 1,
  );

  if (values.length < 4) {
    elements.validationMessage.textContent =
      "Bitte bewerte alle vier Eigenschaften, bevor du weitergehst.";
  } else if (duplicateValues.length > 0) {
    elements.validationMessage.textContent =
      `Jede Zahl darf nur einmal vorkommen. Doppelt vergeben: ${duplicateValues.join(", ")}.`;
  } else if (missingValues.length > 0) {
    elements.validationMessage.textContent =
      `Bitte verwende jede Zahl von 1 bis 4 genau einmal. Es fehlt: ${missingValues.join(", ")}.`;
  } else {
    elements.validationMessage.textContent =
      "Bitte verwende die Zahlen 1, 2, 3 und 4 genau einmal.";
  }

  elements.validationMessage.hidden = false;
}

function focusValidationMessage() {
  elements.validationMessage.setAttribute("tabindex", "-1");
  elements.validationMessage.focus();
}

function isBlockValid(blockIndex) {
  // Gültig ist ein Block nur, wenn 1, 2, 3 und 4 jeweils genau einmal vorkommen.
  const values = state.answers[blockIndex];
  if (!Array.isArray(values) || values.length !== 4) {
    return false;
  }

  return [1, 2, 3, 4].every((value) => values.includes(value));
}

function calculateScores() {
  // Die Punkte werden direkt anhand der Typ-Zuordnung der Eigenschaften aufsummiert.
  const scores = { D: 0, I: 0, S: 0, G: 0 };

  blocks.forEach((block, blockIndex) => {
    block.forEach((trait, traitIndex) => {
      scores[trait.type] += Number(state.answers[blockIndex][traitIndex] || 0);
    });
  });

  return scores;
}

function getRankedTypes(scores) {
  return [...TYPE_ORDER].sort((a, b) => {
    if (scores[b] !== scores[a]) {
      return scores[b] - scores[a];
    }

    return TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b);
  });
}

function renderResult() {
  if (!blocks.every((_, index) => isBlockValid(index))) {
    state.showResult = false;
    renderBlock();
    return;
  }

  elements.quizView.hidden = true;
  elements.resultView.hidden = false;
  elements.saveStatus.textContent = "Gespeichert";

  const scores = calculateScores();
  const ranked = getRankedTypes(scores);
  const mainType = ranked[0];
  const secondaryType = ranked[1];
  const total = TYPE_ORDER.reduce((sum, type) => sum + scores[type], 0);

  elements.profileBadge.textContent =
    `Haupttyp: ${mainType} - ${typeInfo[mainType].name}`;
  elements.resultHeading.textContent = getDisplayName()
    ? `Charakter-Profil für ${getDisplayName()}`
    : "Dein Charakter-Profil";
  elements.resultPerson.textContent = getDisplayName()
    ? `Auswertung für ${getDisplayName()}`
    : "Auswertung ohne Namensangabe";
  elements.scoreTotal.textContent = `Gesamtsumme: ${total}`;

  renderScoreBars(scores);
  renderQuadrantChart(scores);
  renderInterpretation(mainType, secondaryType);
  window.requestAnimationFrame(() => elements.resultView.scrollIntoView({ block: "start" }));
}

function renderScoreBars(scores) {
  elements.scoreBars.innerHTML = "";

  TYPE_ORDER.forEach((type) => {
    const row = document.createElement("div");
    row.className = "bar-row";

    const top = document.createElement("div");
    top.className = "bar-top";
    top.innerHTML = `<span>${type} - ${typeInfo[type].name}</span><strong>${scores[type]} / 40</strong>`;

    const track = document.createElement("div");
    track.className = "bar-track";
    track.setAttribute("aria-label", `${type}: ${scores[type]} von 40 Punkten`);

    const fill = document.createElement("span");
    fill.className = "bar-fill";
    fill.style.width = `${(scores[type] / 40) * 100}%`;
    fill.style.background = typeInfo[type].color;

    track.appendChild(fill);
    row.append(top, track);
    elements.scoreBars.appendChild(row);
  });
}

function renderInterpretation(mainType, secondaryType) {
  const main = typeInfo[mainType];
  const secondary = typeInfo[secondaryType];
  const assessment = buildAssessment(mainType, secondaryType);
  elements.interpretationHeading.textContent =
    `${mainType} - ${main.name}: ${main.axis}`;
  elements.mainDescription.textContent = main.short;
  elements.secondaryType.textContent =
    `Nebentyp: ${secondaryType} - ${secondary.name} (${secondary.axis}).`;
  elements.profileAssessment.textContent = assessment.profile;
  elements.selfEffect.textContent = assessment.selfEffect;
  elements.externalEffect.textContent = assessment.externalEffect;

  renderList(elements.strengthList, main.strengths);
  renderList(elements.weaknessList, main.weaknesses);
  renderList(elements.tipsList, main.tips);
}

function buildAssessment(mainType, secondaryType) {
  const main = typeInfo[mainType];
  const secondary = typeInfo[secondaryType];
  const secondaryNote =
    `Dein Nebentyp ${secondaryType} - ${secondary.name} färbt dieses Muster zusätzlich: ` +
    getSecondaryInfluence(secondaryType);

  return {
    profile: `${main.profile} ${secondaryNote}`,
    selfEffect:
      `${main.selfEffect} Besonders deutlich wird das, wenn du unter Druck handelst oder Verantwortung übernimmst.`,
    externalEffect:
      `${main.externalEffect} Diese Außenwirkung ist keine feste Wahrheit, sondern ein Hinweis darauf, wo Selbstbild und Fremdwahrnehmung auseinanderfallen können.`,
  };
}

function getSecondaryInfluence(type) {
  const influences = {
    D: "es bringt mehr Direktheit, Tempo und Entscheidungsdruck in dein Auftreten.",
    I: "es bringt mehr Kontaktfreude, sichtbare Begeisterung und kommunikative Leichtigkeit hinein.",
    S: "es bringt mehr Ruhe, Harmoniebedürfnis und Verlässlichkeit in deine Wirkung.",
    G: "es bringt mehr Genauigkeit, Reflexion und Qualitätsanspruch in deine Entscheidungen.",
  };
  return influences[type];
}

function renderList(listElement, items) {
  listElement.innerHTML = "";
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    listElement.appendChild(listItem);
  });
}

function renderQuadrantChart(scores) {
  const chart = elements.quadrantChart;
  const center = 210;
  const radius = 150;
  const points = getChartPoints(scores, center, radius);

  // Das SVG wird bei jedem Ergebnis neu aufgebaut, inklusive Titel und Beschreibung.
  chart.replaceChildren(
    makeSvgTitle("chartTitle", "Koordinatendiagramm der vier Typen"),
    makeSvgDesc(
      "chartDesc",
      "Die vier Punktwerte werden in den passenden Quadranten platziert und zu einem Profil verbunden.",
    ),
    makeRect(20, 20, 190, 190, "rgba(217,77,80,0.08)"),
    makeRect(210, 20, 190, 190, "rgba(217,148,37,0.1)"),
    makeRect(210, 210, 190, 190, "rgba(38,151,125,0.09)"),
    makeRect(20, 210, 190, 190, "rgba(88,103,200,0.09)"),
    makeLine(20, center, 400, center, "#aeb8c7", 1.5),
    makeLine(center, 20, center, 400, "#aeb8c7", 1.5),
    makeText(center, 16, "offensiv / extrovertiert", "axis-label", "middle"),
    makeText(center, 414, "defensiv / introvertiert", "axis-label", "middle"),
    makeText(24, center - 8, "aufgabenorientiert", "axis-label", "start"),
    makeText(396, center - 8, "menschenorientiert", "axis-label", "end"),
    ...makeScaleMarks(center, radius),
    makeText(66, 58, "D", "quadrant-label", "middle", typeInfo.D.color),
    makeText(354, 58, "I", "quadrant-label", "middle", typeInfo.I.color),
    makeText(354, 368, "S", "quadrant-label", "middle", typeInfo.S.color),
    makeText(66, 368, "G", "quadrant-label", "middle", typeInfo.G.color),
    makePolygon(points, "rgba(24,32,46,0.11)", "#18202e"),
    ...TYPE_ORDER.map((type) => makeScorePoint(type, points[type], scores[type])),
  );
}

function getChartPoints(scores, center, radius) {
  // Höhere Werte wandern diagonal weiter vom Mittelpunkt in den passenden Quadranten.
  const directions = {
    D: { x: -1, y: -1 },
    I: { x: 1, y: -1 },
    S: { x: 1, y: 1 },
    G: { x: -1, y: 1 },
  };

  return TYPE_ORDER.reduce((points, type) => {
    const distance = (scores[type] / 40) * radius;
    points[type] = {
      x: center + directions[type].x * distance,
      y: center + directions[type].y * distance,
    };
    return points;
  }, {});
}

function makeScaleMarks(center, radius) {
  const nodes = [];
  const directions = {
    D: { x: -1, y: -1 },
    I: { x: 1, y: -1 },
    S: { x: 1, y: 1 },
    G: { x: -1, y: 1 },
  };

  TYPE_ORDER.forEach((type) => {
    [10, 20, 30, 40].forEach((value) => {
      const distance = (value / 40) * radius;
      const x = center + directions[type].x * distance;
      const y = center + directions[type].y * distance;
      nodes.push(makeCircle(x, y, 3, "#ffffff", "#aeb8c7", 1));

      if (value === 20 || value === 40) {
        nodes.push(
          makeText(
            x + directions[type].x * 13,
            y + directions[type].y * 3,
            String(value),
            "tick-label",
            directions[type].x < 0 ? "end" : "start",
          ),
        );
      }
    });
  });

  nodes.push(makeCircle(center, center, 4, "#18202e", "#18202e", 1));
  nodes.push(makeText(center + 8, center - 8, "0", "tick-label", "start"));
  return nodes;
}

function makeSvgTitle(id, text) {
  const title = document.createElementNS(SVG_NS, "title");
  title.setAttribute("id", id);
  title.textContent = text;
  return title;
}

function makeSvgDesc(id, text) {
  const desc = document.createElementNS(SVG_NS, "desc");
  desc.setAttribute("id", id);
  desc.textContent = text;
  return desc;
}

function makeScorePoint(type, point, score) {
  const group = document.createElementNS(SVG_NS, "g");
  const circle = makeCircle(point.x, point.y, 9, typeInfo[type].color, "#ffffff", 3);
  const label = makeText(
    point.x,
    point.y - 16,
    `${type} ${score}`,
    "axis-label",
    "middle",
    typeInfo[type].color,
  );
  group.append(circle, label);
  return group;
}

function makeRect(x, y, width, height, fill) {
  const rect = document.createElementNS(SVG_NS, "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", fill);
  return rect;
}

function makeLine(x1, y1, x2, y2, stroke, strokeWidth) {
  const line = document.createElementNS(SVG_NS, "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", stroke);
  line.setAttribute("stroke-width", strokeWidth);
  return line;
}

function makeCircle(cx, cy, r, fill, stroke, strokeWidth) {
  const circle = document.createElementNS(SVG_NS, "circle");
  circle.setAttribute("cx", cx);
  circle.setAttribute("cy", cy);
  circle.setAttribute("r", r);
  circle.setAttribute("fill", fill);
  circle.setAttribute("stroke", stroke);
  circle.setAttribute("stroke-width", strokeWidth);
  return circle;
}

function makePolygon(points, fill, stroke) {
  const polygon = document.createElementNS(SVG_NS, "polygon");
  const pointString = ["D", "I", "S", "G"]
    .map((type) => `${points[type].x},${points[type].y}`)
    .join(" ");
  polygon.setAttribute("points", pointString);
  polygon.setAttribute("fill", fill);
  polygon.setAttribute("stroke", stroke);
  polygon.setAttribute("stroke-width", "2.5");
  polygon.setAttribute("stroke-linejoin", "round");
  return polygon;
}

function makeText(x, y, text, className, anchor, fill) {
  const textNode = document.createElementNS(SVG_NS, "text");
  textNode.setAttribute("x", x);
  textNode.setAttribute("y", y);
  textNode.setAttribute("text-anchor", anchor);
  textNode.setAttribute("class", className);
  if (fill) {
    textNode.setAttribute("fill", fill);
  }
  textNode.textContent = text;
  return textNode;
}

function buildResultText() {
  const scores = calculateScores();
  const ranked = getRankedTypes(scores);
  const mainType = ranked[0];
  const secondaryType = ranked[1];
  const main = typeInfo[mainType];
  const total = TYPE_ORDER.reduce((sum, type) => sum + scores[type], 0);
  const displayName = getDisplayName() || "ohne Namensangabe";
  const assessment = buildAssessment(mainType, secondaryType);

  return [
    "Charakter-Kompass Ergebnis",
    `Name: ${displayName}`,
    "",
    `Punkte: D ${scores.D}, I ${scores.I}, S ${scores.S}, G ${scores.G}`,
    `Gesamtsumme: ${total}`,
    `Haupttyp: ${mainType} - ${main.name}`,
    `Nebentyp: ${secondaryType} - ${typeInfo[secondaryType].name}`,
    "",
    "Kurzbeschreibung:",
    main.short,
    "",
    "Dein Profil:",
    assessment.profile,
    "",
    "Deine Eigenwirkung:",
    assessment.selfEffect,
    "",
    "Wie andere dich interpretieren könnten:",
    assessment.externalEffect,
    "",
    `Stärken: ${main.strengths.join(", ")}`,
    `Mögliche Schwächen: ${main.weaknesses.join(", ")}`,
    `Entwicklungstipps: ${main.tips.join(", ")}`,
    "",
    "Hinweis: Das Ergebnis ist keine medizinische oder psychologische Diagnose, sondern ein Reflexionsmodell.",
  ].join("\n");
}

function getDisplayName() {
  return state.userName.trim().replace(/\s+/g, " ");
}

function downloadResultPdf() {
  if (!blocks.every((_, index) => isBlockValid(index))) {
    elements.copyStatus.textContent =
      "Der PDF-Download ist verfügbar, sobald alle Blöcke vollständig sind.";
    return;
  }

  const blob = createResultPdfBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getPdfFileName();
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  elements.copyStatus.textContent = "PDF wurde erstellt.";
  showToast("PDF-Download gestartet.");
}

function createResultPdfBlob() {
  return new Blob([buildResultPdf()], { type: "application/pdf" });
}

function getPdfFileName() {
  const nameSlug = slugify(getDisplayName());
  return `charakter-kompass-${nameSlug || "ergebnis"}.pdf`;
}

function buildResultPdf() {
  const scores = calculateScores();
  const ranked = getRankedTypes(scores);
  const mainType = ranked[0];
  const secondaryType = ranked[1];
  const main = typeInfo[mainType];
  const secondary = typeInfo[secondaryType];
  const total = TYPE_ORDER.reduce((sum, type) => sum + scores[type], 0);
  const data = {
    displayName: getDisplayName() || "ohne Namensangabe",
    date: new Date().toLocaleDateString("de-DE"),
    scores,
    mainType,
    secondaryType,
    main,
    secondary,
    assessment: buildAssessment(mainType, secondaryType),
    total,
  };

  return assemblePdf([
    createPdfSummaryPage(data),
    createPdfAssessmentPage(data),
    createPdfDevelopmentPage(data),
  ]);
}

function createPdfSummaryPage(data) {
  const page = [];
  let y = 790;

  drawPdfRect(page, 0, 0, 595.28, 841.89, [0.965, 0.976, 0.992]);
  drawPdfRect(page, 0, 774, 595.28, 68, [0.095, 0.126, 0.18]);
  drawPdfText(page, "Charakter-Kompass Ergebnis", 48, y, 24, [1, 1, 1], "F2");
  drawPdfText(
    page,
    `Name: ${data.displayName} | Erstellt am: ${data.date}`,
    48,
    y - 24,
    11,
    [0.86, 0.9, 0.95],
  );

  y = 720;
  drawPdfText(page, "Ergebnisübersicht", 48, y, 17, [0.095, 0.126, 0.18], "F2");
  y -= 28;
  drawPdfText(
    page,
    `Haupttyp: ${data.mainType} - ${data.main.name}`,
    48,
    y,
    14,
    hexToPdfRgb(data.main.color),
    "F2",
  );
  y -= 22;
  drawPdfText(
    page,
    `Nebentyp: ${data.secondaryType} - ${data.secondary.name}`,
    48,
    y,
    12,
  );
  y -= 20;
  drawPdfText(page, `Gesamtsumme: ${data.total}`, 48, y, 12);

  y -= 46;
  drawPdfText(page, "Punktzahlen", 48, y, 15, [0.095, 0.126, 0.18], "F2");
  y -= 26;
  TYPE_ORDER.forEach((type) => {
    const score = data.scores[type];
    const color = hexToPdfRgb(typeInfo[type].color);
    drawPdfText(page, `${type} - ${typeInfo[type].name}: ${score} / 40`, 48, y, 11);
    drawPdfRect(page, 190, y - 3, 250, 9, [0.88, 0.9, 0.94]);
    drawPdfRect(page, 190, y - 3, (score / 40) * 250, 9, color);
    y -= 28;
  });

  y -= 10;
  drawPdfText(page, "Kurzbeschreibung", 48, y, 15, [0.095, 0.126, 0.18], "F2");
  y -= 24;
  y = addWrappedPdfText(page, data.main.short, 48, y, 86, 11, 16);

  y -= 16;
  drawPdfText(page, "Stärken", 48, y, 15, [0.095, 0.126, 0.18], "F2");
  y -= 24;
  y = addPdfList(page, data.main.strengths, 48, y, 82);

  drawPdfText(
    page,
    "Hinweis: Dieses Ergebnis ist ein Reflexionsmodell und keine medizinische oder psychologische Diagnose.",
    48,
    52,
    9,
    [0.37, 0.42, 0.48],
  );

  return page.join("\n");
}

function createPdfAssessmentPage(data) {
  const page = [];
  let y = 790;

  drawPdfRect(page, 0, 0, 595.28, 841.89, [0.985, 0.988, 0.994]);
  drawPdfText(page, "Einordnung und Wirkung", 48, y, 22, [0.095, 0.126, 0.18], "F2");
  drawPdfText(
    page,
    `${data.displayName} | Haupttyp ${data.mainType} - ${data.main.name}, Nebentyp ${data.secondaryType} - ${data.secondary.name}`,
    48,
    y - 24,
    10,
    [0.37, 0.42, 0.48],
  );

  y = 720;
  drawPdfText(page, "Dein Profil", 48, y, 16, [0.095, 0.126, 0.18], "F2");
  y -= 24;
  y = addWrappedPdfText(page, data.assessment.profile, 48, y, 86, 10.5, 15);

  y -= 24;
  drawPdfText(page, "Deine Eigenwirkung", 48, y, 16, [0.095, 0.126, 0.18], "F2");
  y -= 24;
  y = addWrappedPdfText(page, data.assessment.selfEffect, 48, y, 86, 10.5, 15);

  y -= 24;
  drawPdfText(
    page,
    "Wie andere dich interpretieren könnten",
    48,
    y,
    16,
    [0.095, 0.126, 0.18],
    "F2",
  );
  y -= 24;
  y = addWrappedPdfText(page, data.assessment.externalEffect, 48, y, 86, 10.5, 15);

  drawPdfText(
    page,
    "Selbstbild und Fremdwahrnehmung können je nach Situation, Beziehung und Stresslevel variieren.",
    48,
    52,
    9,
    [0.37, 0.42, 0.48],
  );

  return page.join("\n");
}

function createPdfDevelopmentPage(data) {
  const page = [];
  let y = 790;

  drawPdfRect(page, 0, 0, 595.28, 841.89, [0.985, 0.988, 0.994]);
  drawPdfText(page, "Selbstentwicklung", 48, y, 22, [0.095, 0.126, 0.18], "F2");
  drawPdfText(
    page,
    `${data.displayName} | ${data.mainType} - ${data.main.name} mit Nebentyp ${data.secondaryType} - ${data.secondary.name}`,
    48,
    y - 24,
    10,
    [0.37, 0.42, 0.48],
  );

  y = 720;
  drawPdfText(page, "Mögliche Schwächen", 48, y, 16, [0.095, 0.126, 0.18], "F2");
  y -= 26;
  y = addPdfList(page, data.main.weaknesses, 48, y, 84);

  y -= 28;
  drawPdfText(
    page,
    "Tipps zur Selbstentwicklung",
    48,
    y,
    16,
    [0.095, 0.126, 0.18],
    "F2",
  );
  y -= 26;
  y = addPdfList(page, data.main.tips, 48, y, 84);

  y -= 28;
  drawPdfText(page, "Achsenmodell", 48, y, 16, [0.095, 0.126, 0.18], "F2");
  y -= 24;
  [
    "D: oben links, aufgabenorientiert + offensiv/extrovertiert",
    "I: oben rechts, menschenorientiert + offensiv/extrovertiert",
    "S: unten rechts, menschenorientiert + defensiv/introvertiert",
    "G: unten links, aufgabenorientiert + defensiv/introvertiert",
  ].forEach((line) => {
    drawPdfText(page, line, 48, y, 10.5, [0.22, 0.26, 0.32]);
    y -= 17;
  });

  y -= 20;
  drawPdfText(page, "Punktprofil", 48, y, 16, [0.095, 0.126, 0.18], "F2");
  y -= 24;
  drawPdfText(
    page,
    `D ${data.scores.D} | I ${data.scores.I} | S ${data.scores.S} | G ${data.scores.G}`,
    48,
    y,
    12,
  );

  drawPdfText(
    page,
    "Charakter-Kompass - spielerischer Selbsttest ohne diagnostischen Anspruch.",
    48,
    52,
    9,
    [0.37, 0.42, 0.48],
  );

  return page.join("\n");
}

function addWrappedPdfText(page, text, x, y, maxChars, size, lineHeight, color, font) {
  wrapPdfText(text, maxChars).forEach((line) => {
    drawPdfText(page, line, x, y, size, color, font);
    y -= lineHeight;
  });
  return y;
}

function addPdfList(page, items, x, y, maxChars) {
  items.forEach((item) => {
    const lines = wrapPdfText(`- ${item}`, maxChars);
    lines.forEach((line, index) => {
      drawPdfText(page, line, x + (index > 0 ? 10 : 0), y, 10.5, [0.22, 0.26, 0.32]);
      y -= 16;
    });
  });
  return y;
}

function wrapPdfText(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    if ((line + " " + word).trim().length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  });

  if (line) {
    lines.push(line);
  }

  return lines;
}

function drawPdfText(page, text, x, y, size = 11, color = [0.09, 0.13, 0.18], font = "F1") {
  page.push(
    `${formatPdfColor(color)} rg BT /${font} ${formatPdfNumber(size)} Tf 1 0 0 1 ${formatPdfNumber(
      x,
    )} ${formatPdfNumber(y)} Tm (${escapePdfText(text)}) Tj ET`,
  );
}

function drawPdfRect(page, x, y, width, height, color) {
  page.push(
    `${formatPdfColor(color)} rg ${formatPdfNumber(x)} ${formatPdfNumber(y)} ${formatPdfNumber(
      width,
    )} ${formatPdfNumber(height)} re f`,
  );
}

function assemblePdf(pageStreams) {
  const kids = pageStreams
    .map((_, index) => `${5 + index * 2} 0 R`)
    .join(" ");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${kids}] /Count ${pageStreams.length} >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  ];

  pageStreams.forEach((stream, index) => {
    const pageObject = 5 + index * 2;
    const contentObject = pageObject + 1;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObject} 0 R >>`,
    );
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  let output = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets[index + 1] = output.length;
    output += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = output.length;
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    output += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  output +=
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n` +
    `${xrefOffset}\n%%EOF`;

  return output;
}

function escapePdfText(text) {
  return normalizePdfText(text)
    .split("")
    .map((char) => {
      const byte = getWinAnsiByte(char);
      if (byte === 40 || byte === 41 || byte === 92) {
        return `\\${String.fromCharCode(byte)}`;
      }
      if (byte >= 32 && byte <= 126) {
        return String.fromCharCode(byte);
      }
      return `\\${byte.toString(8).padStart(3, "0")}`;
    })
    .join("");
}

function normalizePdfText(text) {
  return String(text)
    .replace(/[–—]/g, "-")
    .replace(/[„“”]/g, '"')
    .replace(/[‚‘’]/g, "'")
    .replace(/…/g, "...");
}

function getWinAnsiByte(char) {
  const winAnsiMap = {
    Ä: 196,
    Ö: 214,
    Ü: 220,
    ä: 228,
    ö: 246,
    ü: 252,
    ß: 223,
    é: 233,
    è: 232,
    á: 225,
    à: 224,
    ó: 243,
    ò: 242,
    í: 237,
    ì: 236,
    ú: 250,
    ù: 249,
    É: 201,
    È: 200,
  };
  const code = char.charCodeAt(0);
  if (code >= 32 && code <= 126) {
    return code;
  }
  return winAnsiMap[char] || 63;
}

function formatPdfColor(color) {
  return color.map((value) => formatPdfNumber(value)).join(" ");
}

function formatPdfNumber(value) {
  const trimmed = Number(value)
    .toFixed(3)
    .replace(/\.0+$/, "")
    .replace(/(\.\d*?)0+$/, "$1");
  return trimmed === "-0" ? "0" : trimmed;
}

function hexToPdfRgb(hex) {
  const cleanHex = hex.replace("#", "");
  return [0, 2, 4].map((start) => parseInt(cleanHex.slice(start, start + 2), 16) / 255);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  const success = document.execCommand("copy");
  textArea.remove();

  if (!success) {
    throw new Error("Copy command failed");
  }
}

function resetTest() {
  localStorage.removeItem(STORAGE_KEY);
  state = {
    userName: "",
    currentBlock: 0,
    showResult: false,
    answers: createEmptyAnswers(),
  };
  elements.userName.value = "";
  elements.saveStatus.textContent = "Zurückgesetzt";
  renderBlock();
  showToast("Alle gespeicherten Daten wurden gelöscht.");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.hidden = false;

  toastTimer = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, 2600);
}

function animateQuizCard() {
  const card = document.querySelector(".quiz-card");
  card.classList.remove("is-entering");
  void card.offsetWidth;
  card.classList.add("is-entering");
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return min;
  }

  return Math.min(Math.max(Math.round(number), min), max);
}
