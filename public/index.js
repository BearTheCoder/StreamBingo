function testCommand() {
  const data = {
    name: "BearTheCoder",
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  };

  fetch('/api', options).then(() => console.log("Data Sent!..."));
}