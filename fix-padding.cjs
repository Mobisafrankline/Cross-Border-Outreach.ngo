const fs = require('fs');
const path = require('path');
const dir = './src/app/pages';
const files = fs.readdirSync(dir);
let updated = 0;

files.forEach(f => {
  if(f.endsWith('.tsx')) {
    const p = path.join(dir, f);
    let content = fs.readFileSync(p, 'utf8');
    
    // Replace the double padding values (pt-20, pt-24, pt-28, pt-32) that were 
    // manually added to min-h-screen divs inside individual pages
    let newContent = content
      .replace(/className="min-h-screen pt-(?:20|24|28|32) bg-gray-50"/g, 'className="min-h-screen bg-gray-50"')
      .replace(/className="min-h-screen pt-(?:20|24|28|32)"/g, 'className="min-h-screen"');
      
    if(content !== newContent) {
      fs.writeFileSync(p, newContent);
      console.log('Updated ' + f);
      updated++;
    }
  }
});

console.log(`Finished updating ${updated} files.`);
