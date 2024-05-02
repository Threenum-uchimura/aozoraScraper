"use strict";
/**
 * myScraper.ts
 *
 * class：Scrape
 * function：scraping site
 * updated: 2024/04/29
 **/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scrape = void 0;
// constants
const DISABLE_EXTENSIONS = "--disable-extensions"; // disable extension
const ALLOW_INSECURE = "--allow-running-insecure-content"; // allow insecure content
const IGNORE_CERT_ERROR = "--ignore-certificate-errors"; // ignore cert-errors
const NO_SANDBOX = "--no-sandbox"; // no sandbox
const DISABLE_SANDBOX = "--disable-setuid-sandbox"; // no setup sandbox
const DISABLE_DEV_SHM = "--disable-dev-shm-usage"; // no dev shm
const NO_FIRST_RUN = "--no-first-run"; // no first run
const NO_ZYGOTE = "--no-zygote"; // no zygote
const HYDE_BARS = "--hide-scrollbars"; // hyde sb
const MUTE_AUDIO = "--mute-audio"; // mute audio
const MAX_SCREENSIZE = "--start-maximized"; // max screen
const DEF_USER_AGENT1 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"; // useragent1
const DEF_USER_AGENT2 = "Mozilla/5.0 (Linux; U; Android 4.0.3; ja-jp; SC-02C Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30"; // useragent2
const DEF_USER_AGENT3 = "Mozilla/5.0 (Android; Mobile; rv:21.0) Gecko/21.0 Firefox/21.0"; // useragent3
const DEF_USER_AGENT4 = "Mozilla/5.0 (Linux; Android 4.0.3; SC-02C Build/IML74K) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.58 Mobile Safari/537.31"; // useragent4
const DEF_USER_AGENT5 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36"; // useragent5
// define modules
const promises_1 = require("node:timers/promises"); // wait for seconds
const puppeteer_1 = __importDefault(require("puppeteer")); // Puppeteer for scraping
// class
class Scrape {
    // constractor
    constructor() {
        // result
        this._result = false;
        // height
        this._height = 0;
        // height
        this._useragents = [DEF_USER_AGENT1, DEF_USER_AGENT2, DEF_USER_AGENT3, DEF_USER_AGENT4, DEF_USER_AGENT5];
    }
    // initialize
    init() {
        return new Promise(async (resolve, reject) => {
            try {
                const puppOptions = {
                    headless: true, // no display mode
                    ignoreDefaultArgs: [DISABLE_EXTENSIONS], // ignore extensions
                    args: [
                        NO_SANDBOX,
                        DISABLE_SANDBOX,
                        NO_FIRST_RUN,
                        NO_ZYGOTE,
                        ALLOW_INSECURE,
                        IGNORE_CERT_ERROR,
                        MAX_SCREENSIZE,
                        DISABLE_DEV_SHM,
                        HYDE_BARS,
                        MUTE_AUDIO
                    ], // args
                };
                // lauch browser
                Scrape.browser = await puppeteer_1.default.launch(puppOptions);
                // create new page
                Scrape.page = await Scrape.browser.newPage();
                // set viewport
                Scrape.page.setViewport({
                    width: 1920,
                    height: 1000,
                });
                // random
                const arrIdx = Math.floor(Math.random() * 4);
                // mimic agent
                await Scrape.page.setUserAgent(this._useragents[arrIdx]);
                // allow multiple downloadd
                await Scrape.page._client().send('Page.setDownloadBehavior', {
                    behavior: 'allow',
                    downloadPath: 'C:\\Users\\koichi\\Downloads'
                });
                // resolved
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`1: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // get page title
    getTitle() {
        return new Promise(async (resolve, reject) => {
            try {
                // resolved
                resolve(await Scrape.page.title);
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`2: ${e.message}`);
                    // reject
                    reject(e.message);
                }
            }
        });
    }
    // get a href
    getHref(elem) {
        return new Promise(async (resolve, reject) => {
            try {
                // resolved
                resolve(await Scrape.page.$eval(elem, (elm) => elm.href));
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`2: ${e.message}`);
                    // reject
                    reject(e.message);
                }
            }
        });
    }
    // press enter
    pressEnter() {
        return new Promise(async (resolve, reject) => {
            try {
                // press enter key
                await Scrape.page.keyboard.press("Enter");
                // resolved
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`3: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // goback
    doGoBack() {
        return new Promise(async (resolve, reject) => {
            try {
                // go back
                await Scrape.page.goBack();
                // resolved
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`2: ${e.message}`);
                    // reject
                    reject(e.message);
                }
            }
        });
    }
    // go page
    doGo(targetPage) {
        return new Promise(async (resolve, reject) => {
            try {
                // goto target page
                await Scrape.page.goto(targetPage);
                // get page height
                const height = await Scrape.page.evaluate(() => {
                    return document.body.scrollHeight;
                });
                // body height
                this._height = height;
                // resolved
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`4: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // click
    doClick(elem) {
        return new Promise(async (resolve, reject) => {
            try {
                // click target element
                await Scrape.page.$$eval(elem, (elements) => elements[0].click());
                // resolved
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`5: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // type
    doType(elem, value) {
        return new Promise(async (resolve, reject) => {
            try {
                // type element on specified value
                await Scrape.page.type(elem, value, { delay: 100 });
                // resolved
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`6: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // counter
    doCountChildren(elem) {
        return new Promise(async (resolve, reject) => {
            try {
                // type element on specified value
                const child = await Scrape.page.$eval(elem, (e) => e.children);
                // if exists
                if (child) {
                    // resolved
                    resolve(Object.keys(child).length);
                }
                else {
                    // resolved
                    resolve(0);
                }
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`7: ${e.message}`);
                    // reject
                    reject(0);
                }
            }
        });
    }
    // clear
    doClear(elem) {
        return new Promise(async (resolve, reject) => {
            try {
                // clear the textbox
                await Scrape.page.$eval(elem, (element) => (element.value = ""));
                // resolved
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`8: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // select
    doSelect(elem) {
        return new Promise(async (resolve, reject) => {
            try {
                // select dropdown element
                await Scrape.page.select(elem);
                // resolved
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`9: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // screenshot
    doScreenshot(path) {
        return new Promise(async (resolve, reject) => {
            try {
                // take screenshot of window
                await Scrape.page.screenshot({ path: path });
                // resolved
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`10: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // mouse wheel
    mouseWheel() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(this._height);
                // mouse wheel to bottom
                await Scrape.page.mouse.wheel({ deltaY: this._height - 200 });
                // resolved
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`11: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // eval
    doSingleEval(selector, property) {
        return new Promise(async (resolve, reject) => {
            try {
                // target item
                const exists = await Scrape.page.$eval(selector, () => true).catch(() => false);
                // no result
                if (!exists) {
                    console.log("error");
                    reject("error");
                }
                else {
                    // target value
                    const item = await Scrape.page.$(selector);
                    // if not null
                    if (item !== null) {
                        // got data
                        const data = await (await item.getProperty(property)).jsonValue();
                        // if got data not null
                        if (data) {
                            // resolved
                            resolve(data);
                        }
                        else {
                            reject("error");
                        }
                    }
                    else {
                        reject("error");
                    }
                }
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`12: ${e.message}`);
                    // reject
                    reject(e.message);
                }
            }
        });
    }
    // eval
    doMultiEval(selector, property) {
        return new Promise(async (resolve, reject) => {
            try {
                // data set
                let datas = [];
                // target list
                const list = await Scrape.page.$$(selector);
                // result
                const result = await Scrape.page.$(selector).then((res) => !!res);
                // if element exists
                if (result) {
                    // loop in list
                    for (const ls of list) {
                        // push to data set
                        datas.push(await (await ls.getProperty(property)).jsonValue());
                    }
                    // resolved
                    resolve(datas);
                }
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`13: ${e.message}`);
                    // reject
                    reject(e.message);
                }
            }
        });
    }
    // waitSelector
    doWaitFor(time) {
        return new Promise(async (resolve, reject) => {
            try {
                // wait for time
                await (0, promises_1.setTimeout)(time);
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`14: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // waitSelector
    doWaitSelector(elem, time) {
        return new Promise(async (resolve, reject) => {
            try {
                // target item
                const exists = await Scrape.page.$eval(elem, () => true).catch(() => false);
                // if element exists
                if (exists) {
                    // wait for loading selector
                    await Scrape.page.waitForSelector(elem, { timeout: time });
                    // resolved
                    resolve();
                }
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`15: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // wait for navigaion
    doWaitForNav(time) {
        return new Promise(async (resolve, reject) => {
            try {
                // wait for time
                await Scrape.page.waitForNavigation({ waitUntil: 'networkidle0', timeout: time });
                // resolved
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`16: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // check Selector
    doCheckSelector(elem) {
        return new Promise(async (resolve, reject) => {
            try {
                // target item
                const exists = await Scrape.page.$eval(elem, () => true).catch(() => false);
                // return true/false
                resolve(exists);
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`17: ${e.message}`);
                    // reject
                    reject(false);
                }
            }
        });
    }
    // close window
    doClose() {
        return new Promise(async (resolve, reject) => {
            try {
                // close browser
                await Scrape.browser.close();
                // resolved
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`18: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // reload
    doReload() {
        return new Promise(async (resolve, reject) => {
            try {
                // close browser
                await Scrape.page.reload();
                // resolved
                resolve();
            }
            catch (e) {
                // if type is error
                if (e instanceof Error) {
                    // error
                    console.log(`19: ${e.message}`);
                    // reject
                    reject();
                }
            }
        });
    }
    // set result
    set setSucceed(selector) {
        // Do something with val that takes time
        this._result = Scrape.page.$(selector).then((res) => !!res);
    }
    // get result
    get getSucceed() {
        return this._result;
    }
}
exports.Scrape = Scrape;
//# sourceMappingURL=myScraper0429el.js.map