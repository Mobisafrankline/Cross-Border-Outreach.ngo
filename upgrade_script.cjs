const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/app/pages');
const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
};

const files = walk(dir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace background gradients with solid colors
  content = content.replace(/bg-gradient-to-[a-z]+\s+from-slate-[0-9]+(\/[0-9]+)?\s+via-slate-[0-9]+(\/[0-9]+)?\s+to-slate-[0-9]+(\/[0-9]+)?/g, 'bg-slate-900/90');
  content = content.replace(/bg-gradient-to-[a-z]+\s+from-[a-z]+-[0-9]+\s+to-[a-z]+-[0-9]+/g, (match) => {
    if (match.includes('text-transparent')) return match; // skip text gradients
    if (match.includes('from-blue')) return 'bg-blue-900';
    if (match.includes('from-slate')) return 'bg-slate-900';
    if (match.includes('from-orange')) return 'bg-orange-500';
    return match;
  });

  // Upgrade heading fonts (ensure font-playfair is added to h1, h2, h3)
  content = content.replace(/<(h[123])[^>]*className="([^"]*)"/g, (match, tag, classes) => {
    if (!classes.includes('font-playfair')) {
      return match.replace(classes, `${classes} font-playfair`);
    }
    return match;
  });

  // Upgrade paragraphs to font-source-serif ONLY if they are text-lg or text-xl or leading-relaxed (usually body paragraphs)
  content = content.replace(/<p[^>]*className="([^"]*)"/g, (match, classes) => {
    if ((classes.includes('text-lg') || classes.includes('text-xl') || classes.includes('leading-relaxed')) && !classes.includes('font-source-serif')) {
      return match.replace(classes, `${classes} font-source-serif`);
    }
    return match;
  });

  // Upgrade rounded-2xl to rounded-3xl for major cards (excluding small buttons which might have rounded-2xl? Usually buttons are rounded-full or rounded-xl)
  // Let's just do it for large rounded corners
  content = content.replace(/rounded-\[2\.5rem\]/g, 'rounded-3xl');
  content = content.replace(/rounded-\[3rem\]/g, 'rounded-3xl'); 
  content = content.replace(/rounded-2xl/g, 'rounded-3xl');

  // Write back
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Upgraded', files.length, 'files');
