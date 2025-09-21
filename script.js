const boardData = [
  { flight: "MT101", destination: "LONDON", time: "12:40", gate: "A4", status: "BOARDING" },
  { flight: "MT215", destination: "PARIS", time: "13:05", gate: "B1", status: "LAST CALL" },
  { flight: "MT330", destination: "ROME", time: "13:20", gate: "C2", status: "ON TIME" },
  { flight: "MT452", destination: "BERLIN", time: "13:45", gate: "A8", status: "DELAYED" },
  { flight: "MT509", destination: "ATHENS", time: "14:00", gate: "B4", status: "GATE OPEN" },
  { flight: "MT612", destination: "MADRID", time: "14:10", gate: "C5", status: "BOARDING" },
  { flight: "MT784", destination: "DUBLIN", time: "14:35", gate: "A3", status: "ON TIME" },
  { flight: "MT845", destination: "LISBON", time: "14:50", gate: "B6", status: "BOARDING" },
  { flight: "MT912", destination: "BARCELONA", time: "15:05", gate: "C1", status: "FINAL CALL" },
  { flight: "MT980", destination: "AMSTERDAM", time: "15:20", gate: "A5", status: "ON TIME" },
  { flight: "MT104", destination: "DUBAI", time: "15:40", gate: "D2", status: "BOARDING" },
  { flight: "MT118", destination: "NEW YORK", time: "16:05", gate: "E1", status: "CHECK-IN" }
];

const departureRows = Array.from(document.querySelectorAll(".departure-row"));
const offers = Array.from(document.querySelectorAll(".offer"));
const selectionOutput = document.querySelector("[data-selection]");
const ctaPanel = document.querySelector(".cta-panel");
let boardIndex = 0;

function refreshBoard() {
  if (!departureRows.length) {
    return;
  }

  departureRows.forEach((row, rowIndex) => {
    const data = boardData[(boardIndex + rowIndex) % boardData.length];

    row.dataset.flight = data.flight;
    row.dataset.destination = data.destination;
    row.dataset.time = data.time;
    row.dataset.gate = data.gate;
    row.dataset.status = data.status;

    row.querySelector(".departure-cell--flight").textContent = data.flight;
    row.querySelector(".departure-cell--destination").textContent = data.destination;
    row.querySelector(".departure-cell--time").textContent = data.time;
    row.querySelector(".departure-cell--gate").textContent = data.gate;
    row.querySelector(".departure-cell--status").textContent = data.status;

    row.setAttribute(
      "aria-label",
      `${data.flight} to ${data.destination}, ${data.status} at ${data.time} from gate ${data.gate}`
    );

    row.classList.remove("is-flipping");
    row.classList.remove("is-selected");
    // Trigger reflow to restart the animation
    void row.offsetWidth;
    row.classList.add("is-flipping");
  });

  boardIndex = (boardIndex + departureRows.length) % boardData.length;
}

function clearSelections() {
  [...departureRows, ...offers].forEach((item) => item.classList.remove("is-selected"));
}

function updateSelection(message) {
  if (!selectionOutput) {
    return;
  }

  selectionOutput.textContent = message;
  if (ctaPanel) {
    ctaPanel.classList.add("cta-panel--active");
  }
}

function bindBoardInteractions() {
  departureRows.forEach((row) => {
    row.addEventListener("animationend", () => {
      row.classList.remove("is-flipping");
    });

    row.addEventListener("click", () => {
      clearSelections();
      row.classList.add("is-selected");
      updateSelection(
        `${row.dataset.flight} to ${row.dataset.destination} ${row.dataset.status?.toLowerCase()} at ${row.dataset.time} (Gate ${row.dataset.gate})`
      );
    });
  });
}

function bindOfferInteractions() {
  offers.forEach((offer) => {
    offer.addEventListener("click", () => {
      clearSelections();
      offer.classList.add("is-selected");
      const destination = offer.dataset.destination;
      const price = offer.dataset.price;
      updateSelection(`${destination} from ${price}. Tap call to reserve your seat.`);
    });
  });
}

refreshBoard();
bindBoardInteractions();
bindOfferInteractions();

if (departureRows.length) {
  setInterval(refreshBoard, 7000);
}
