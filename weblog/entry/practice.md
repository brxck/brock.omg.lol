# Practice Guide

<style>
header { display: none; }
footer { display: none; }
aside { display: none; }
main > *:not(article) { display: none; }

body {
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 11pt;
  line-height: 1.4;
  letter-spacing: 0.01em;
  word-spacing: 0.1em;
}

article {
  font-family: inherit;
  margin: 0 auto;
  max-width: 700px;
}

article > h1 {
  display: none;
}

article * {
  font-family: inherit;
  letter-spacing: inherit;
  word-spacing: inherit;
}

.title-group {
  text-align: center;
  margin-bottom: 2em;
}

.title-group h1 {
  font-size: 1.6em;
  font-weight: bold;
  margin: 0 0 0.5em 0;
  line-height: 1.2;
}

.title-group .subtitle {
  font-size: 1.1em;
  margin: 0 0 1.5em 0;
}

.title-group .intro {
  font-size: 1.1em;
  margin: 0;
  text-align: center;
}

article h2 {
  font-size: 1.25em;
  font-weight: bold;
  margin: 1.5em 0 0.75em 0;
  text-transform: uppercase;
  text-indent: -2em;
  padding-left: 2em;
}

article ol {
  margin: 0.75em 1em;
  padding-left: 1.5em;
}

article li {
  margin: 0.5em 0;
}

article strong {
  font-weight: bold;
}

.cap {
  text-transform: capitalize;
}

.upper {
  text-transform: uppercase;
}

.underline {
  text-decoration: underline;
}

.two-column {
  column-count: 2;
  column-gap: 2em;
  margin: 0.75em 0;
}

.two-column ol {
  margin: 0;
}
</style>

<div class="title-group">
  <h1>Practice Guide for <span class="text cap">Computer</span></h1>
  <div class="subtitle">Adapted from Ron Miller's Advanced Improv Practice Guide</div>
  <p class="intro">Before starting your daily practice routine, read and seriously consider the following:</p>
</div>

<h2>A. DAILY AFFIRMATIONS</h2>

<ol>
  <li>How fortunate I am that in this life I am one who has been allowed to create beauty with <strong><span class="text">computer</span></strong>.</li>
  <li>It is my responsibility to create peace, beauty, and love with <strong><span class="text">computer</span></strong>.</li>
</ol>

<h2>B. I WILL BE KIND TO MYSELF</h2>

<ol>
  <li>IT IS ONLY <strong><span class="text upper">computer</span></strong></li>
  <li>No matter my level of development in <strong><span class="text">computer</span></strong>, how good or bad I think I am, it is only <strong><span class="text">computer</span></strong> and I am a beautiful person.</li>
  <li>I will not compare myself with my colleagues. If they do <strong><span class="text">computer</span></strong> beautifully, I will enjoy it and be thankful and proud that I live in fellowship with them.</li>
  <li>There will always be someone with more abilities in <strong><span class="text">computer</span></strong> than my own as there will be those with less.</li>
</ol>

<h2>C. REASONS TO DO <span class="text upper underline">computer</span></h2>

<ol>
  <li>To contribute to the world's spiritual growth.</li>
  <li>To contribute to my own self-discovery and spiritual growth.</li>
  <li>To pay homage to all the great practitioners of <strong><span class="text">computer</span></strong>, past and present, who have added beauty to the world.</li>
</ol>

<h2>D. RID YOUR SELF OF THE FOLLOWING REASONS FOR BEING A PRACTITIONER OF <span class="text upper underline">computer</span></h2>

<div class="two-column">
  <ol>
    <li>To create self-esteem</li>
    <li>To be "hip"</li>
    <li>To manipulate</li>
    <li>To get rich or famous</li>
  </ol>
</div>

<script>
function updateTextFromHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    let text = decodeURIComponent(hash);
    text = text.replace(/<[^>]*>/g, '');
    text = text.substring(0, 100);
    if (text.trim()) {
      document.querySelectorAll('.text').forEach(span => {
        span.textContent = text;
      });
    }
  }
}

updateTextFromHash();
window.addEventListener('hashchange', updateTextFromHash);
</script>
