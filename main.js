// Modules to control application life and create native browser window
const {
  app, 
  BrowserWindow,
  Menu,
  Tray
} = require('electron')
const path = require('path')

let tray = null;
let mainWindow;
let menuIcon = path.join(__dirname,'icon/hot-cup.png')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  });

  mainWindow.hide();

  tray = new Tray(menuIcon);

  mainWindow.on('show', () => {
    const bounds = tray.getBounds();
    mainWindow.setPosition(bounds.x, bounds.y);
  });
  
  //show tray when clicked
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });



  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.dock.hide();
