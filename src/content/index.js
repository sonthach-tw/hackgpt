// Import Talisman
function scanInput() {
  var input = document.getElementById("prompt-textarea").value;
  console.log(input)
  // TODO: 1. Scan input for secret keys
}

document.getElementById("prompt-textarea").addEventListener("input", scanInput);
