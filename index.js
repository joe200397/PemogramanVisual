const electron = require("electron");
const uuid = require("uuid/v1");

const {app, BrowserWindow, Menu, ipcMain} = electron;

let todayWindow;
let createWindow;
let listWindow;

let allAppointment = [];

app.on("ready", ()=> {
    todayWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        title: "See A Doctor"
    });

    todayWindow.loadURL(`file://${__dirname}/index.html`);
    todayWindow.on("close", () => {

        app.quit();
        todayWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

const listWindowCreator = () => {
    listWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title:"All Appointment"
    });

    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("close", () => (listWindow = null));
};

const createWindowCreator = () => {
    createWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title:"Create Appointment"
    });

    createWindow.setMenu(null);
    createWindow.loadURL(`file://${__dirname}/create.html`);
    createWindow.on("close", () => (createWindow = null));
};

const aboutWindowCreator = () => {
    createWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title:"About"
    });

    createWindow.setMenu(null);
    createWindow.loadURL(`file://${__dirname}/about.html`);
    createWindow.on("close", () => (createWindow = null));
};

ipcMain.on('appointment:create', (event, appointment) => {
    appointment["id"] = uuid();
    appointment["done"] = 0;

    allAppointment.push(appointment);
    createWindow.close();

    console.log(allAppointment);
});

ipcMain.on("appointment:request:list", event => {
   listWindow.webContents.send('appointment:response:list',allAppointment);
});

ipcMain.on("appointment:request:index", event => {
    console.log("here here");
});

ipcMain.on("appointment:done", (event, id) => {
    console.log("here here here");
});

const menuTemplate = [{
        label: "File",
        submenu: [
            {
                label: "New Appointment",

                click() {
                    createWindowCreator();
                }
            },
            {
                label: "All Appointment",

                click() {
                    listWindowCreator();
                }
            },
            {
                label: "Quit",
                accelerator: process.platform === "darwin" ? "Command + Q" : "Ctrl + Q",
                click() {
                    app.quit();
                }
            }
        ]
    },

    {

        label: "View",
        submenu: [{role: "Reload"}, {role: "toggledevtools"}]
    },
    
    {
        label: "About",
        click(){
            aboutWindowCreator();
        }
    }


]