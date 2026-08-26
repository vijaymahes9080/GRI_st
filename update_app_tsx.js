const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace(/hasPermission\(currentUser\?\.role/g, 'hasPermission(currentUser');
fs.writeFileSync('src/App.tsx', appContent);
