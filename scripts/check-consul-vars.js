const fs = require("fs");

const path = process.argv[2];

function findJinja2Changes(diffOutput) {
  const lines = diffOutput.split("\n");
  const jinja2FileRegex = /^diff --git a\/(.+\.jinja2) b\/(.+\.jinja2)$/;
  const modifiedLineRegex = /^\+(ParameterKey=.+)$/;

  const changedLines = [];

  let isJinja2File = false;

  lines.forEach((line) => {
    if (line.match(jinja2FileRegex)) {
      isJinja2File = true;
    } else if (line.startsWith("diff --git")) {
      isJinja2File = false;
    }

    if (isJinja2File) {
      const match = line.match(modifiedLineRegex);

      if (match) {
        changedLines.push(match[1].split("ParameterKey=")[1]);
      }
    }
  });

  return changedLines;
}

fs.readFile(path, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const changes = findJinja2Changes(data);

  if (changes.length) {
    process.exit(1);
  }
});
