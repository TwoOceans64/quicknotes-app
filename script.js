const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const categorySelect = document.querySelector("#note-category");
const list = document.querySelector("#notes-list");
const count = document.querySelector("#note-count");
const error = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

const STORAGE_KEY = "quicknotes-app";
let notes = loadNotes();

function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function render(filtered = notes) {
  list.innerHTML = "";
  if (filtered.length === 0) {
    list.textContent = "No notes match your search.";
    updateCount();
    return;
  }
  filtered.forEach(note => {
    const li = document.createElement("li");
    li.classList.add("note", `category-${note.category}`);

    const text = document.createElement("p");
    text.textContent = note.text;

    const meta = document.createElement("small");
    meta.textContent = `${note.category} — ${note.createdAt}`;

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.addEventListener("click", () => deleteNote(note.id));

    li.appendChild(text);
    li.appendChild(meta);
    li.appendChild(del);
    list.appendChild(li);
  });
  updateCount();
}

function addNote(text, category) {
  const note = {
    id: Date.now(),
    text,
    category,
    createdAt: new Date().toLocaleString()
  };
  notes.push(note);
  saveNotes();
  render();
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  render();
}

function updateCount() {
  if (notes.length === 0) {
    count.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    count.textContent = "You have 1 note.";
  } else {
    count.textContent = `You have ${notes.length} notes.`;
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const text = input.value.trim();
  const category = categorySelect.value;

  if (text === "") {
    error.textContent = "Please type a note first.";
    return;
  }
  if (text.length > 200) {
    error.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  error.textContent = "";
  addNote(text, category);
  input.value = "";
});

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = notes.filter(n => n.text.toLowerCase().includes(term));
  render(filtered);
});

render();