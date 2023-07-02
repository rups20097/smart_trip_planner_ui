var result = document.getElementById("text_typed");

function startConverting() {
    if ("webkitSpeechRecognition" in window) {
        var speechRecognizer = new webkitSpeechRecognition();
        // speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.lang = "en-US";
        speechRecognizer.start();

        var finalTranscripts = "";

        speechRecognizer.onresult = function (event) {
            var interimTranscripts = "";
            for (var i = event.resultIndex; i < event.results.length; i++) {
                var transcript = event.results[i][0].transcript;
                transcript.replace("\n", "<br>");
                if (event.results[i].isFinal) {
                    console.log("DONE", result);
                    finalTranscripts += transcript;
                    send_text();
                    setTimeout(() => {
                        result.value= "";
                    }, 0)
                } else {
                    console.log("NOT DONE");
                    interimTranscripts += transcript;
                }
            }
            // result.value = finalTranscripts + '<span style="color: #999">' + interimTranscripts + "</span>";
            result.value = finalTranscripts + interimTranscripts;
        };
        speechRecognizer.onerror = function (event) { };
    } else {
        alert("Your browser is not supported for speech to text conversion. Please download Google chrome or Update your Google chrome!!")
    }
}
