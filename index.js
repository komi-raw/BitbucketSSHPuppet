//https://github.com/komi-raw/BitbucketSSHPuppet.git
import { configDotenv } from 'dotenv';
import puppeteer from 'puppeteer';
import { Bitbucket } from './pages/Bitbucket.js';

const ENV = configDotenv();

async function main(){
    if(ENV.parsed?.USERMAIL === undefined || ENV.parsed?.USERPWD === undefined){
        console.error('ERROR : EMAIL OR PWD NOT PROVIDED, MISSING .env ?')
        return;
    }
    const browser = await puppeteer.launch({headless: true});
    const BC = new Bitbucket(browser, ENV.parsed.USERMAIL, ENV.parsed.USERPWD, ENV.parsed.USERKEY, ENV.parsed.USERKEYLABEL);
    let result = '';
    try{
        result = await BC.process();
    } catch(ex){
        console.error('Error : Verify all previous inputs.');
        browser.close();
        return;
    }
    if(BC.flag){
        console.error(result);
    } else {
        console.log(result);
    }
    browser.close();
    return;
}

main();