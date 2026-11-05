"use strict";

const films = {
  ferry: {
    number: "01",
    title: "Sista färjan",
    image: "assets/sista-farjan.jpg",
    alt: "En kvinna i röd kappa ser ut över hamnen från en färja i blå skymning.",
    meta: "SPELFILM / 94 MIN / SVENSKT TAL",
    time: "18.00",
    synopsis:
      "När Mira missar dagens sista anslutning blir hon kvar ombord med en man som tycks ha glömt vart han var på väg. Färjan går mellan samma två kajer. Deras samtal tar en annan väg.",
    note: "Titta efter hur fönstren förändras under resan. I början ser vi hamnen genom dem. Mot slutet är det nästan bara spegelbilder kvar. Avståndet mellan två människor får ta lika stor plats som vattnet mellan kajerna.",
    screening:
      "Kvällen börjar med en kort introduktion på fem minuter. Filmen följer direkt efter. Slut cirka 19.40.",
  },
  windows: {
    number: "02",
    title: "Mellan husen",
    image: "assets/mellan-husen.jpg",
    alt: "En svartvit innergård med hängande tvätt och ett ensamt upplyst fönster.",
    meta: "KORTFILM / 28 MIN / UTAN DIALOG",
    time: "20.00",
    synopsis:
      "Kameran lämnar aldrig innergården. Ett fönster öppnas, en radio hörs, någon tar ner sin tvätt. Under en enda kväll växer ett porträtt fram av människor som förblir utanför bild.",
    note: "Här är det ljuden som flyttar blicken. Ett bestick mot en tallrik kan få ett mörkt fönster att kännas bebott. Ge filmen tid: den lilla förändringen är själva händelsen.",
    screening:
      "En kort introduktion på fem minuter, sedan filmen. Filmen berättas med bild och ljud, utan dialog. Slut cirka 20.35.",
  },
  light: {
    number: "03",
    title: "Det som lyser",
    image: "assets/det-som-lyser.jpg",
    alt: "En varmt upplyst tvättomat med fyra maskiner och en ensam röd stol.",
    meta: "SPELFILM / 78 MIN / SVENSKT TAL",
    time: "21.00",
    synopsis:
      "Ester arbetar natt i en tvättomat som snart ska stänga för gott. Under hennes sista pass kommer tre besökare in med tvätt, ursäkter och varsin anledning att stanna lite längre.",
    note: "Maskinernas jämna rytm håller ihop filmen. Lägg märke till den röda stolen: vem som sitter där, vem som lämnar den och vem som till sist drar fram en stol till.",
    screening:
      "Kvällens sista introduktion tar fem minuter. Därefter ser vi filmen utan paus. Slut cirka 22.25.",
  },
};

const dialog = document.querySelector("#film-dialog");
const seatSection = document.querySelector("#seat-section");
const receipt = document.querySelector("#demo-receipt");
const confirmButton = document.querySelector("#confirm-seats");
const status = document.querySelector("#seat-status");
const selectedSeats = new Set();
const unavailableSeats = new Set(["A3", "A4", "B6", "C2", "C3", "D7"]);
let currentFilm;
let opener;

function updateSelection(message) {
  const seats = [...selectedSeats].sort();
  status.textContent =
    message ||
    (seats.length
      ? `Ditt val: ${seats.join(", ")} · ${seats.length} ${seats.length === 1 ? "plats" : "platser"}.`
      : "Inga platser valda.");
  confirmButton.disabled = seats.length === 0;
  receipt.hidden = true;
  document.querySelectorAll(".seat:not(:disabled)").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(selectedSeats.has(button.dataset.seat)),
    );
  });
}

function buildSeats() {
  const map = document.querySelector("#seat-map");
  const fragment = document.createDocumentFragment();
  for (const row of ["A", "B", "C", "D"]) {
    const label = document.createElement("span");
    label.className = "seat-row-label";
    label.textContent = row;
    label.setAttribute("aria-hidden", "true");
    fragment.append(label);
    for (let number = 1; number <= 8; number++) {
      const id = `${row}${number}`;
      const button = document.createElement("button");
      button.className = "seat";
      button.textContent = number;
      button.dataset.seat = id;
      button.disabled = unavailableSeats.has(id);
      button.setAttribute(
        "aria-label",
        `Rad ${row}, plats ${number}${button.disabled ? ", upptagen i exemplet" : ""}`,
      );
      if (!button.disabled) button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        if (selectedSeats.has(id)) selectedSeats.delete(id);
        else if (selectedSeats.size < 4) selectedSeats.add(id);
        else {
          updateSelection(
            `Du kan välja högst fyra platser. Ditt val: ${[...selectedSeats].sort().join(", ")}. Ta bort en vald stol för att byta.`,
          );
          return;
        }
        updateSelection();
      });
      fragment.append(button);
    }
  }
  map.replaceChildren(fragment);
}

function openFilm(key, trigger) {
  const film = films[key];
  if (!film) return;
  opener = trigger;
  currentFilm = film;
  document.querySelector("#detail-index").textContent =
    `EFTERBILD / FILM ${film.number}`;
  document.querySelector("#detail-title").textContent = film.title;
  document.querySelector("#detail-meta").textContent = film.meta;
  document.querySelector("#detail-synopsis").textContent = film.synopsis;
  document.querySelector("#detail-note").textContent = film.note;
  document.querySelector("#detail-time").textContent = film.time;
  document.querySelector("#detail-screening").textContent = film.screening;
  const image = document.querySelector("#detail-image");
  image.src = film.image;
  image.alt = film.alt;
  selectedSeats.clear();
  seatSection.hidden = true;
  updateSelection();
  document.body.classList.add("modal-open");
  dialog.showModal();
  dialog.scrollTop = 0;
  document.querySelector("#close-dialog").focus({ preventScroll: true });
}

document
  .querySelectorAll("[data-film]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      openFilm(button.dataset.film, button),
    ),
  );
document
  .querySelector("#close-dialog")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  opener?.focus({ preventScroll: true });
});

document.querySelectorAll("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    document
      .querySelectorAll("[data-filter]")
      .forEach((filter) =>
        filter.setAttribute("aria-pressed", String(filter === button)),
      );
    let visibleCount = 0;
    document.querySelectorAll(".film-row").forEach((row) => {
      row.hidden = category !== "all" && row.dataset.category !== category;
      if (!row.hidden) visibleCount++;
    });
    document.querySelector("#filter-status").textContent =
      `${visibleCount} ${visibleCount === 1 ? "film visas" : "filmer visas"}.`;
  }),
);

document.querySelector("#show-seats").addEventListener("click", () => {
  seatSection.hidden = false;
  document.querySelector("#seat-heading").focus({ preventScroll: true });
  seatSection.scrollIntoView({ block: "start" });
});
document.querySelector("#reset-seats").addEventListener("click", () => {
  selectedSeats.clear();
  updateSelection();
});
confirmButton.addEventListener("click", () => {
  if (!selectedSeats.size) return;
  document.querySelector("#receipt-summary").textContent =
    `${currentFilm.title} · ${currentFilm.time} · Platser ${[...selectedSeats].sort().join(", ")}.`;
  receipt.hidden = false;
  receipt.focus({ preventScroll: true });
  receipt.scrollIntoView({ block: "nearest" });
});

buildSeats();
