const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

let window;

function createWindow() {
  window = new BrowserWindow({ width: 800, height: 600 });

  const appUrl = IS_PRODUCTION
    ? url.format({
        pathname:
          '/cra-build/index.html' /* Attention here: origin is path.join(__dirname, 'index.html') */,
        protocol: 'file',
        slashes: true,
      })
    : 'http://localhost:3000';

  console.log(`$ appUrl ${appUrl}`);
  window.loadURL(appUrl);

  window.webContents.openDevTools();
  window.on('closed', () => {
    window = null;
  });
}

app.on('ready', () => {
  protocol.interceptFileProtocol(
    'file',
    (request, callback) => {
      const url = request.url.substr(7); /* all urls start with 'file://' */
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (err) => {
      if (err) console.error('Failed to register protocol');
    },
  );
  createWindow();
});
