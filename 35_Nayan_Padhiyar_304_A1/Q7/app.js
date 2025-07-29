import fetch from 'node-fetch';

async function fetchGoogle() {
  const res = await fetch('https://www.google.com');
  const text = await res.text();
  console.log(text.substring(0, 500)); // Print first 500 chars
}

fetchGoogle();
