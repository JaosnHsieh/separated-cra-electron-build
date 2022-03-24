const { app, BrowserWindow, protocol, remote } = require('electron');
const path = require('path');
const url = require('url');

const IS_PRODUCTION = app.isPackaged;

let window;

function createWindow() {
  window = new BrowserWindow({ width: 800, height: 600 });

  const appUrl = IS_PRODUCTION
    ? url.format({
        pathname: path.join(remote.app.getAppPath(), 'cra-build', 'index.html'),
        protocol: 'app',
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
  protocol.registerFileProtocol(
    'app',
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
