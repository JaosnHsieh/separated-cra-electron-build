const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const CRA_BUILD_FOLDER = `cra-build`;

let window;

function createWindow() {
  window = new BrowserWindow({ width: 800, height: 600 });

  const appUrl = url.format({
    pathname: 'index.html',
    protocol: 'file',
    slashes: true,
  });

  /**
   * if need HMR while developing cra
   * const appUrl = 'http://localhost:3000';
   *
   */
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
      if (IS_PRODUCTION) {
        callback({
          path: path.normalize(
            path.join(app.getAppPath(), CRA_BUILD_FOLDER, url),
          ),
        });
        return;
      }

      callback({
        path: path.normalize(path.join(__dirname, CRA_BUILD_FOLDER, url)),
      });
    },
    (err) => {
      if (err) console.error('Failed to register protocol');
    },
  );
  createWindow();
});
