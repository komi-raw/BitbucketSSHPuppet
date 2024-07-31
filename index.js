//https://github.com/komi-raw/BitbucketSSHPuppet.git
import { configDotenv } from 'dotenv';
import puppeteer from 'puppeteer';
import { Bitbucket } from './pages/Bitbucket.js';
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";

const ENV = configDotenv();
const exec = promisify(execCb);

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
        try{
            await exec('echo 1 > $HOME/bbucket.log');
        } catch(e){}
        return;
    }
    if(BC.flag){
        console.error(result);
        try{
            await exec('echo 1 > $HOME/bbucket.log');
        } catch(e){}
    } else {
        console.log(result);
        try{
            await exec('echo 0 > $HOME/bbucket.log');
        } catch(e){}
    }
    browser.close();
    return;
}

main();