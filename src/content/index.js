var delayTimer;

function scanInput() {
  clearTimeout(delayTimer); // Clear the previous timer

  delayTimer = setTimeout(function () {
    var input = document.getElementById("prompt-textarea").value;
    console.log(input)
  }, 1000); // Wait for 1 second before making the request
}

document.getElementById("prompt-textarea").addEventListener("input", scanInput);

document.getElementById("prompt-textarea").addEventListener("input", scanInput);
