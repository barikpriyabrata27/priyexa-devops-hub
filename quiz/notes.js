const note = document.querySelector("#note");

function currentDoc() {
  const hash = decodeURIComponent(location.hash.slice(1)).replace(/^\//, "");
  return hash || "README.md";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function resolveHref(fromDoc, href) {
  if (/^(https?:|mailto:)/.test(href)) {
    return href;
  }
  if (href.startsWith("#")) {
    return href;
  }

  const url = new URL(href, `https://notes.local/knowledge/${fromDoc}`);
  const path = decodeURIComponent(url.pathname);

  if (path.startsWith("/knowledge/") && path.endsWith(".md")) {
    return `#${path.slice("/knowledge/".length)}${url.hash}`;
  }
  if (path.startsWith("/quiz/")) {
    return path.slice("/quiz/".length);
  }
  return `..${path}`;
}

function inline(text, fromDoc) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      const url = resolveHref(fromDoc, href);
      const external = url.startsWith("http");
      return `<a href="${url}"${external ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function renderMarkdown(source, fromDoc) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.startsWith("```")) {
      const code = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      blocks.push(`<h${level}>${inline(heading[2], fromDoc)}</h${level}>`);
      index += 1;
      continue;
    }

    if (line.startsWith(">")) {
      const quote = [];
      while (index < lines.length && lines[index].startsWith(">")) {
        quote.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(`<blockquote>${inline(quote.join(" "), fromDoc)}</blockquote>`);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*]\s+/, ""));
        index += 1;
      }
      blocks.push(`<ul>${items.map((item) => `<li>${inline(item, fromDoc)}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(`<ol>${items.map((item) => `<li>${inline(item, fromDoc)}</li>`).join("")}</ol>`);
      continue;
    }

    if (line.trim().startsWith("|")) {
      const rows = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(lines[index]);
        index += 1;
      }
      const cells = (row) => row.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
      const head = cells(rows[0]);
      const body = rows.slice(1).filter((row) => !/^[\s|:-]+$/.test(row));
      blocks.push(
        `<table><thead><tr>${head.map((cell) => `<th>${inline(cell, fromDoc)}</th>`).join("")}</tr></thead><tbody>${
          body.map((row) => `<tr>${cells(row).map((cell) => `<td>${inline(cell, fromDoc)}</td>`).join("")}</tr>`).join("")
        }</tbody></table>`
      );
      continue;
    }

    if (/^---\s*$/.test(line)) {
      blocks.push("<hr>");
      index += 1;
      continue;
    }

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith("```") &&
      !lines[index].startsWith("#") &&
      !lines[index].startsWith(">") &&
      !/^\s*[-*]\s+/.test(lines[index]) &&
      !/^\d+\.\s+/.test(lines[index]) &&
      !lines[index].trim().startsWith("|") &&
      !/^---\s*$/.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(`<p>${inline(paragraph.join(" "), fromDoc)}</p>`);
  }

  return blocks.join("\n");
}

function markActive(doc) {
  const section = doc.split("/")[0];
  document.querySelectorAll(".nav a").forEach((link) => {
    const target = decodeURIComponent(link.getAttribute("href").slice(1));
    const active = target === "README.md"
      ? doc === "README.md"
      : target.startsWith(`${section}/`);
    link.classList.toggle("active", active);
  });
}

async function showNote() {
  const doc = currentDoc();
  markActive(doc);
  note.innerHTML = "<p>Loading notes…</p>";

  try {
    const response = await fetch(`../knowledge/${doc}`);
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    const markdown = await response.text();
    note.innerHTML = renderMarkdown(markdown, doc);
    const title = note.querySelector("h1");
    document.title = title ? `${title.textContent} — Study notes` : "Study notes";
    window.scrollTo(0, 0);
  } catch {
    note.innerHTML = "<p>That note could not be loaded.</p>";
  }
}

window.addEventListener("hashchange", showNote);
showNote();
