let sortState = {
    columnIndex: 0,
    ascending: true
};

function normalizeText(value) {
    return String(value).toLowerCase().trim();
}

function getCellText(row, cellIndex) {
    const cell = row.cells[cellIndex];
    return cell ? cell.textContent : "";
}

function sanitizeForSearch(value) {
   
    return normalizeText(value).replace(/[<>]/g, "");
}

function applyFilter() {
    const input = document.getElementById("searchInput");
    const filterText = sanitizeForSearch(input.value);

    const tbody = document.getElementById("tableBody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.forEach(row => {
        const company = normalizeText(getCellText(row, 0));
        const country = normalizeText(getCellText(row, 1));

        const match = company.includes(filterText) || country.includes(filterText);
        row.style.display = match ? "" : "none";
    });
}

function sortTable(columnIndex) {
    const tbody = document.getElementById("tableBody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    // Sortiert Richtung umschalten, wenn gleiche Spalte erneut geklickt wird
    if (sortState.columnIndex === columnIndex) {
        sortState.ascending = !sortState.ascending;
    } else {
        sortState.columnIndex = columnIndex;
        sortState.ascending = true;
    }

    rows.sort((a, b) => {
        const aText = getCellText(a, columnIndex);
        const bText = getCellText(b, columnIndex);

        // Spalte 2 ist Zahl (CO2)
        if (columnIndex === 2) {
            const aNum = Number(String(aText).replace(/[^\d.-]/g, ""));
            const bNum = Number(String(bText).replace(/[^\d.-]/g, ""));
            return sortState.ascending ? aNum - bNum : bNum - aNum;
        }

        const aNorm = normalizeText(aText);
        const bNorm = normalizeText(bText);

        if (aNorm < bNorm) return sortState.ascending ? -1 : 1;
        if (aNorm > bNorm) return sortState.ascending ? 1 : -1;
        return 0;
    });

    // Reihen neu einsetzen
    rows.forEach(row => tbody.appendChild(row));
}

function applyDirection(dirValue) {
    document.documentElement.setAttribute("dir", dirValue);

    // lokales Menü: bei rtl rechts, sonst links
    const localMenu = document.querySelector(".local-menu");
    if (!localMenu) return;

    localMenu.classList.toggle("rtl", dirValue === "rtl");
}

function setupEvents() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", applyFilter);
    }

    const dirSelect = document.getElementById("dirSelect");
    if (dirSelect) {
        dirSelect.addEventListener("change", (e) => {
            applyDirection(e.target.value);
        });

        // Startwert setzen
        applyDirection(dirSelect.value);
    }
}

document.addEventListener("DOMContentLoaded", setupEvents);
