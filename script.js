const btn = document.getElementById('toggleBtn');
btn.onclick = () => {
  if (document.body.style.background === 'white') {
    document.body.style.background = '#0b0c21'; // dark
    document.body.style.color = '#ddd';
  } else {
    document.body.style.background = 'white'; // light
    document.body.style.color = 'black';
  }
};
