export class Bitbucket{
    
    constructor(browser, mail, pwd, key, microsoft = false){
        this.browser = browser;
        this.mail = mail;
        this.pwd = pwd;
        this.key = key;
        this.isMicrosoft = microsoft;
    }
    
    async process(){
        this.page = await this.browser.newPage();
        await this.page.setViewport({width: 1080, height: 1024});
        await this.page.goto('https://id.atlassian.com/login?application=bitbucket');
        await this.page.locator("#username").fill(this.mail);
    }
}