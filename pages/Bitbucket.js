export class Bitbucket {
    _loginPage = "https://id.atlassian.com/login?application=bitbucket";
    _tokenPage = "https://id.atlassian.com/login/security-screen";
    _bitbucket = 'https://bitbucket.org/';

    flag = false;

    constructor(browser, mail, pwd, key, keylabel) {
        this.browser = browser;
        this.mail = mail;
        this.pwd = pwd;
        this.key = key;
        this.keylabel = keylabel;
    }

    async process() {
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1080, height: 1024 });
        await this.page.goto(this._loginPage);
        const loginSuccess = await this.login();
        if(!loginSuccess) {
            this.flag = true;
            return "User not found.";
        }
        await this.settings();
        const keyAdded = await this.ssh();
        if(!keyAdded){
            this.flag = true;
            return "Key not added, maybe already existing ?";
        }    
        return "Ok, Success.";
    }

    async ssh(){
        await this.page.waitForNavigation({ waitUntil: "networkidle0" });
        await this.page.waitForSelector('#add-key');
        await this.page.locator('#add-key').click();
        await this.page.waitForSelector('#id_label');
        await this.page.keyboard.press("Tab");
        await this.page.keyboard.type(this.keylabel);
        await this.page.keyboard.press("Tab");
        await this.page.keyboard.type(this.key);

        for(let i = 0; i < 4; i++) await this.page.keyboard.press("Tab");
        await this.page.keyboard.press("Enter");
        
        try{
            await this.page.waitForSelector('div.error', {timeout: 2000});
            return false;
        }catch(ex){
        }

        return true;
    }

    async settings()
    {
        await this.page.locator("a[href='/account/signin/']").click();
        await this.page.waitForNavigation({ waitUntil: "networkidle0" });
        
        await this.page.locator('button[data-testid="h-nav-settings-cog"]').click();
        await this.page.waitForSelector('a[href="/account/settings/"]');
        await this.page.locator('a[href="/account/settings/"]').click();
        await this.page.locator('a[href="/account/settings/ssh-keys/"]').click();
    }

    async login() {
        const sendLogin = async () => {
            await this.page.locator("#login-submit").click();
        };

        await this.page.locator("#username").fill(this.mail);
        await sendLogin();
        await this.page.waitForSelector("#password");
        await this.page.locator("#password").fill(this.pwd);
        await sendLogin();
        await this.page.locator()
        try {
            await this.page.waitForSelector('section[data-testid="form-error"]', {timeout: 1000})
            return false;
        } catch(ex) {
        }
        await this.page.waitForNavigation({ waitUntil: "networkidle0" });
        
        await this.handleIfTokenPage();
        
        await this.page.goto(this._bitbucket);
        return true;
    }

    async handleIfTokenPage() {
        const url = await this.page.url();
        if (url.startsWith(this._tokenPage)) {
            await this.page.locator("#mfa-promote-dismiss").click();
        }
    }
}
