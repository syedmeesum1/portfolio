const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<a href="([^"]*)" class="btn primary" target="_blank">\s*Visit Project\s*<i\s*class="fa-solid fa-arrow-up-right-from-square"><\/i>\s*<\/a>/g, 
  `<a href="$1" class="specular-button" target="_blank">
                                <span class="specular-button__fx" aria-hidden="true"></span>
                                <span class="specular-button__label">Visit Project <i class="fa-solid fa-arrow-up-right-from-square"></i></span>
                            </a>`);

if (!html.includes('specularButton.js')) {
    html = html.replace('</body>', '    <script type="module" src="specularButton.js"></script>\n</body>');
}
fs.writeFileSync('index.html', html);

let css = fs.readFileSync('style.css', 'utf8');
if (!css.includes('.specular-button')) {
    css += `
/* Specular Button CSS */
.specular-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-radius: 18px;
  color: #f5f5f5;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  overflow: visible;
  padding: 0;
  transition: transform 0.3s ease;
}

.specular-button:hover {
  transform: translateY(-3px);
}

.specular-button__fx {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  pointer-events: none;
  z-index: 0;
}

.specular-button__fx canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.specular-button__label {
  position: relative;
  z-index: 1;
  padding: 1rem 2.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
`;
    fs.writeFileSync('style.css', css);
}
