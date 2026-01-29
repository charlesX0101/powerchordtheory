document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const resultBox = document.createElement("div");
  resultBox.setAttribute("id", "search-results");
  resultBox.style.position = "absolute";
  resultBox.style.background = "#111";
  resultBox.style.border = "1px solid #333";
  resultBox.style.color = "#fff";
  resultBox.style.maxHeight = "200px";
  resultBox.style.overflowY = "auto";
  resultBox.style.padding = "0.5rem";
  resultBox.style.zIndex = "1000";
  resultBox.style.display = "none";
  document.body.appendChild(resultBox);

  let searchData = [];

  fetch("/search.json")
    .then(res => res.json())
    .then(data => searchData = data);

  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    resultBox.innerHTML = "";
    if (!query) {
      resultBox.style.display = "none";
      return;
    }

    const matches = searchData.filter(entry =>
      entry.title.toLowerCase().includes(query) ||
      entry.content.toLowerCase().includes(query)
    ).slice(0, 10); // limit to 10 results

    if (matches.length > 0) {
      matches.forEach(entry => {
        const item = document.createElement("div");
        item.innerHTML = `<a href="${entry.url}" style="color:#0ff; text-decoration:underline;">${entry.title}</a>`;
        item.style.padding = "0.25rem 0";
        resultBox.appendChild(item);
      });
    } else {
      resultBox.innerHTML = "<div style='color:#999;'>No results found</div>";
    }

    const rect = searchInput.getBoundingClientRect();
    resultBox.style.top = `${rect.bottom + window.scrollY}px`;
    resultBox.style.left = `${rect.left + window.scrollX}px`;
    resultBox.style.width = `${rect.width}px`;
    resultBox.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !resultBox.contains(e.target)) {
      resultBox.style.display = "none";
    }
  });
});
