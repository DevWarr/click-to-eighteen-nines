const GAME_DATA_LOCAL_STORAGE_KEY = "click-to-eighteen-nines-game-data"
const INITIAL_DATA = {
    currentCount: 0n,
    clicks: {
        "plus-1": 0,
        "minus-": 0,
        "minus-30": 0,
        "minus-111": 0,
        "minus-333": 0,
        "minus-1500": 0,
        "minus-10000": 0,
        "minus-100000000000000000": 0,
        "set-counter": 0
    },
    restarts: 0,
    gamesWon: 0
}

let gameData;
let counterText;
let setCounterForm;
let setCounterInput;

/** 
 * Loads data from localStorage.
 * 
 * If no data is found, uses INITIAL_DATA
 */
const loadData = () => {
    const dataString = window.localStorage.getItem(GAME_DATA_LOCAL_STORAGE_KEY)
    try {
        const gameData = JSON.parse(dataString)
        gameData.currentCount = BigInt(gameData.currentCount)
        return gameData
    } catch {
        return INITIAL_DATA
    }
}

const saveData = (data) => {
    if (!data) data = {...gameData}
    data.currentCount = data.currentCount.toString()
    const dataString = JSON.stringify(data)
    window.localStorage.setItem(GAME_DATA_LOCAL_STORAGE_KEY, dataString)
}

const setCounterText = (currentCount) => {
    if (!currentCount || !Number.isInteger(currentCount)) {
        currentCount = gameData.currentCount
    }

    counterText.textContent = gameData
        .currentCount
        .toString()
        .padStart(18, "0")
}

gameData = loadData()
window.onbeforeunload = () => saveData()
window.onunload = () => saveData()

counterText = document.getElementById("counter-display")
setCounterText()

const updateCount = (countDelta, buttonType) => {
    gameData.currentCount += BigInt(countDelta)
    gameData.clicks[buttonType] += 1
    setCounterText()
    saveData()
}

// Setting button actions
document
    .getElementById("plus-1")
    .onclick = () => { updateCount(1, "plus-1") };

document
    .getElementById("minus-1")
    .onclick = () => { updateCount(-1, "minus-1") };

document
    .getElementById("minus-30")
    .onclick = () => { updateCount(-30, "minus-30") };

document
    .getElementById("minus-111")
    .onclick = () => { updateCount(-111, "minus-111") };

document
    .getElementById("minus-333")
    .onclick = () => { updateCount(-333, "minus-333") };

document
    .getElementById("minus-1500")
    .onclick = () => { updateCount(-1500, "minus-1500") };

document
    .getElementById("minus-10000")
    .onclick = () => { updateCount(-10000, "minus-10000") };

document
    .getElementById("minus-100000000000000000")
    .onclick = () => { updateCount(-100000000000000000, "minus-100000000000000000") };

document.getElementById("restart").onclick = () => {
    const confirmRestart = confirm("This will reset game data and score to zero. Are you sure?")
    if (confirmRestart) {
        const currentRestarts = gameData.restarts
        const currentGamesWon = gameData.gamesWon
        gameData = INITIAL_DATA
        gameData.restarts = currentRestarts + 1
        gameData.gamesWon = currentGamesWon
    }
    setCounterText()
    saveData()
}

// FORM OPTIONS

setCounterForm = document.getElementById("set-counter-form")
setCounterForm.style.display = "none";
setCounterForm.isOpen = false;
setCounterForm.onsubmit = (event) => {
    event.preventDefault()
}

setCounterInput = document.getElementById("set-counter-input")

const openForm = () => {
    setCounterForm.style.display = "flex"
    setCounterForm.isOpen = true;
    setCounterInput.value = 0
    setCounterInput.focus()
}

const closeForm = () => {
    setCounterInput.blur()
    setCounterInput.value = 0
    setCounterForm.style.display = "none"
    setCounterForm.isOpen = false;
}

const setCounterManually = () => {
    countToSet = setCounterInput.value
    allCharsAreIntegers = countToSet
        .split("")
        .every(char => {
            console.log({char, num: Number(char)})
            try {
                return Number.isInteger(Number(char))
            } catch { return false; }
        })

    if (allCharsAreIntegers && countToSet > -1) {
        gameData.currentCount = BigInt(countToSet)
        gameData.clicks["set-counter"] += 1
        setCounterText()
        saveData()
    }
    closeForm()
}

document.getElementById("set-counter-toggle").onclick = () => {
    if (setCounterForm.isOpen) {
        closeForm()
    }
    else openForm()
}

document
    .getElementById("set-counter-confirm")
    .onclick = () => { setCounterManually() }

document
    .getElementById("set-counter-cancel")
    .onclick = () => { closeForm() }
