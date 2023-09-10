const eventSource = new EventSource("http://localhost:8080/events");
const toasterPanel = document.querySelector(".toaster");
const toasterLink = document.querySelector(".toaster-link");
const toasterText = document.querySelector(".toaster-text");
const toasterClose = document.querySelector("#toaster-close");

toasterClose.addEventListener("click", function () {
  toasterPanel.style.display = "none"; // Hide the toaster
  toasterPanel.classList.remove("visible"); // Remove any classes that might be making it visible
});

eventSource.onmessage = (event) => {
  try {
    // Parse the string data into an object
    const data = JSON.parse(event.data);

    if (data.alert) {
      console.log("this is an alert");
      toasterText.innerText = data.message;
      toasterLink.href = data.link;

      // Assuming "visible" class will make the panel visible,
      // make sure the initial CSS of .toaster sets display to none or similar
      toasterPanel.style.display = "block";
      toasterPanel.classList.add("visible");
    } else {
      console.log("Received event:", data.message);
    }
  } catch (err) {
    console.error("Error processing message:", err);
  }
};

eventSource.onerror = (error) => {
  console.error("EventSource failed:", error);
  eventSource.close();
};
