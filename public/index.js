const data = {
  name: "BearTheCoder",
};

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data),
};

fetch('/api', options);



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

  fetch('/api', options);
}