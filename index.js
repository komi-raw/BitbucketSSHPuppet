import { configDotenv } from 'dotenv';
import puppeteer from 'puppeteer';
import { Bitbucket } from './pages/Bitbucket.js';

const ENV = configDotenv();

async function main(){
    if(ENV.parsed?.USERMAIL === undefined || ENV.parsed?.USERPWD === undefined){
        console.error('ERROR : EMAIL OR PWD NOT PROVIDED')
        return;
    }
    const browser = await puppeteer.launch({headless: false});
    const BC = new Bitbucket(browser, ENV.parsed.USERMAIL, ENV.parsed.USERPWD, ENV.parsed.USERKEY, ENV.parsed.USERKEYLABEL);
    const result = await BC.process();
    if(BC.flag){
        console.error(result);
    } else {
        console.log(result);
    }
    browser.close();
    return;
}

main();