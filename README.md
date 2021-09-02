# silver-parakeet

## What is it?

Silver Parakeet is an educational program showing how Puppeteer could be used to automatically submit random fake reports to the website: https://prolifewhistleblower.com/anonymous-form/. This website is used for reporting women trying to exercise their right to bodily autonomy in the state of Texas, an act that became illegal yesterday, September 1, 2021.

## How Do I Use It?

Hypothetically, if you were to use it, the steps would go like this:

1. Install Tor and [configure for puppeteer](https://levelup.gitconnected.com/anonymous-web-scrapping-with-node-js-tor-apify-and-cheerio-3b36ec6a45dc)
2. Install [Node/npm](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-beginners-tutorial)
3. [Clone](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github/cloning-a-repository) this repo
4. Get API keys from [Randommer](https://randommer.io/) and [2Captcha](https://2captcha.com)
5. Create a `.env` file in the top-level directory and make it look like this:

```
RANDOM_NAME_API_KEY=put randommer api key here
TWO_CAPTCHA_API_KEY=put 2Captcha api key here
```

6. Open the terminal, go to the project folder, and type `npm run develop`, and hit `Enter`
7. That's it!
