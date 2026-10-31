// Tailwind is compiled ahead of time (no CDN script on the live site).
// After changing classes in the pages or scripts, rebuild the stylesheet with:
//   npx tailwindcss@3 -c tailwind.config.js -i tailwind/input.css -o src/assets/css/tailwind.css --minify
module.exports = { content: ['./src/**/*.html', './src/**/*.js'], theme: { extend: {} } };
