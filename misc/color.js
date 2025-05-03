function rgb2hex(rgbString) {
  const [red, green, blue] = rgbString.match(/\d+/g).map(Number);
  const rgb = (red << 16) | (green << 8) | blue;
  return '#' + (0x1000000 + rgb).toString(16).slice(1);
}

exports.rgb2hex = rgb2hex;

function hex2rgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const hexValue = parseInt(hex, 16);
  const red = (hexValue >> 16) & 255;
  const green = (hexValue >> 8) & 255;
  const blue = hexValue & 255;
  return `rgb(${red}, ${green}, ${blue})`;
}

exports.hex2rgb = hex2rgb;
