const { app, dialog, BrowserWindow, ipcMain } = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
// const electron = require('electron');
const path = require('path');
const url = require('url');

// A. Functions IPC
// 1. Browse decks
ipcMain.on('browse-file', function (event) {
	dialog
		.showOpenDialog({
			title: 'Select the File',
			defaultPath: path.join(__dirname, './data/deck/'),
			buttonLabel: 'Select',
			// Restricting the user to only Text Files.
			filters: [
				{
					name: 'Text Files',
					extensions: ['txt', 'json'],
				},
			],
			properties: ['openFile'],
		})
		.then((file) => {
			// Stating whether dialog operation was
			// cancelled or not.
			if (!file.canceled) {
				// Updating the GLOBAL filepath variable
				// to user-selected file.
				var file_send = file.filePaths[0].toString();
				event.sender.send('selected-file', file_send);
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

// 2. Create deck
ipcMain.on('browse-create-file', function (event) {
	dialog
		.showOpenDialog({
			title: 'Select the File',
			defaultPath: path.join(__dirname, './data/'),
			buttonLabel: 'Select',
			// Restricting the user to only Text Files.
			filters: [
				{
					name: 'Text Files',
					extensions: ['txt', 'json'],
				},
			],
			properties: ['openFile'],
		})
		.then((file) => {
			// Stating whether dialog operation was
			// cancelled or not.
			if (!file.canceled) {
				// Updating the GLOBAL filepath variable
				// to user-selected file.
				var file_send = file.filePaths[0].toString();
				event.sender.send('selected-create-file', file_send);
			}
		})
		.catch((err) => {
			console.log(err);
		});
});
// 2B. Delete deck
ipcMain.on('del-browse-file', function (event) {
	dialog
		.showOpenDialog({
			title: 'Select the File',
			defaultPath: path.join(__dirname, './data/deck/'),
			buttonLabel: 'Select',
			// Restricting the user to only Text Files.
			filters: [
				{
					name: 'Text Files',
					extensions: ['txt', 'json'],
				},
			],
			properties: ['openFile'],
		})
		.then((file) => {
			// Stating whether dialog operation was
			// cancelled or not.
			if (!file.canceled) {
				// Updating the GLOBAL filepath variable
				// to user-selected file.
				var choice = dialog.showMessageBoxSync(win, {
					type: 'question',
					buttons: ['Yes', 'No'],
					title: 'Confirm',
					message: 'Are you sure you want to delete this file?',
				});
				if (choice == 0) {
					var file_send = file.filePaths[0].toString();
					event.sender.send('selected-del-file', file_send);
				} else {
					console.log('File not deleted');
				}
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

// 3. Create text edit window
let win2;
function createTextWindow() {
	win2 = new BrowserWindow({
		width: 700,
		height: 500,
		minWidth: 450,
		// webPreferences: {
		// 	preload: path.join(__dirname, 'preload.js'),
		// },
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	// win.loadFile('./src/index.html');
	win2.loadURL(`${__dirname}/src/create.html`);

	win2.on('closer', () => {
		win2.close();
	});
}

// 3B. IPC to ipcRenderer
ipcMain.on('create-file', function (event) {
	event.sender.send('opening-window');
	createTextWindow();
});

// 3C. Capture data sent from Win2
ipcMain.on('sending-data', (event, data, fname) => {
	win.webContents.send('sending-data-text', data, fname);
	win2.close();
});
// modify your existing createWindow() function
// 4. Create main window
let win;
function createWindow() {
	win = new BrowserWindow({
		width: 780,
		height: 910,
		minWidth: 450,
		// webPreferences: {
		// 	preload: path.join(__dirname, 'preload.js'),
		// },
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	// win.loadFile('./src/index.html');
	win.loadURL(`${__dirname}/src/index.html`);
	// win.webContents.openDevTools();
	win.setPosition(760, 0);

	// Global key shortcuts
	// a. Audio play
	electronLocalshortcut.register('W', () => {
		win.webContents.send('short-audio');
	});
	// b. Flash card
	electronLocalshortcut.register('C', () => {
		win.webContents.send('short-flash');
	});
	// c. Easy
	electronLocalshortcut.register('Q', () => {
		win.webContents.send('short-easy');
	});
	// d. Reset
	electronLocalshortcut.register('R', () => {
		win.webContents.send('short-reset');
	});
	// e. Close app
	electronLocalshortcut.register('CmdOrCtrl+W', () => {
		app.quit();
	});

	win.on('closed', () => {
		// win = null;
		// win2 = null;
		app.quit();
	});
}

app.whenReady().then(() => {
	createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// To stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
