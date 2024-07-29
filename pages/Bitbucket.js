export class Bitbucket {
    _loginPage = "https://id.atlassian.com/login?application=bitbucket";
    _tokenPage = "https://id.atlassian.com/login/security-screen";
    _bitbucket = 'https://bitbucket.org/';

    constructor(browser, mail, pwd, key) {
        this.browser = browser;
        this.mail = mail;
        this.pwd = pwd;
        this.key = key;
    }

    async process() {
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1080, height: 1024 });
        await this.page.goto(this._loginPage);
        await this.login();
        await this.settings();
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

        await this.page.waitForNavigation({ waitUntil: "networkidle0" });
        
        await this.handleIfTokenPage();
        
        await this.page.goto(this._bitbucket);
    }

    async handleIfTokenPage() {
        const url = await this.page.url();
        if (url.startsWith(this._tokenPage)) {
            await this.page.locator("#mfa-promote-dismiss").click();
        }
    }
}
