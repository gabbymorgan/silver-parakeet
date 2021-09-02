const Axios = require("axios");
const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
const counties = require("./addresses.json");

puppeteer.use(
  RecaptchaPlugin({
    provider: { id: "2captcha", token: process.env.TWO_CAPTCHA_API_KEY }, // $3 per 1000 reCAPTCHAs - https://2captcha.com/?from=6690177
    visualFeedback: true,
  })
);

const formFields = {
  HOW_LAW_VIOLATED: {
    selector: "#forminator-field-textarea-1",
    value:
      "Mrs. Krabappel and Principal Skinner were in the closet making babies and I saw one of the babies and the baby looked at me.",
  },
  HOW_OBTAINED: {
    selector: "#forminator-field-text-1",
    value: "Word on the street.",
  },
  CLINIC_OR_DOCTOR: {
    selector: "#forminator-field-text-6",
    value: "",
  },
  CITY: { selector: "#forminator-field-text-2", value: "" },
  STATE: { selector: "#forminator-field-text-3", value: "TX" },
  ZIP: { selector: "#forminator-field-text-4", value: "" },
  COUNTY: { selector: "#forminator-field-text-5", value: "" },
  NOT_A_POLITICIAN: { selector: "input[value=no]" },
};

const setAddress = () => {
  const countyIndex = Math.floor(Math.random() * counties.length);
  const county = counties[countyIndex];
  const cityIndex = Math.floor(Math.random() * county.cities.length);
  const city = county.cities[cityIndex];
  const zipCodeIndex = Math.floor(Math.random() * city.zipCodes.length);
  const zipCode = city.zipCodes[zipCodeIndex];
  formFields.COUNTY.value = county.name;
  formFields.CITY.value = city.name;
  formFields.ZIP.value = zipCode;
};

const setName = async () => {
  const getNameResponse = await Axios.get("https://randommer.io/api/Name", {
    params: { nameType: "fullname", quantity: 1 },
    headers: { "X-Api-Key": process.env.RANDOM_NAME_API_KEY },
  });
  formFields.CLINIC_OR_DOCTOR.value = "Dr. " + getNameResponse.data[0];
};

const fillField = async (page, fieldName) => {
  const field = formFields[fieldName];
  if (fieldName === "NOT_A_POLITICIAN") {
    await page.$eval(field.selector, (el) => {
      el.click();
    });
  } else {
    await page.$eval(
      field.selector,
      (el, field) => {
        el.value = field.value;
      },
      field
    );
  }
};

const fillForm = async (page) => {
  await page.goto("https://prolifewhistleblower.com/anonymous-form/");
  await page.waitForSelector(formFields.HOW_LAW_VIOLATED.selector, {
    timeout: 0,
  });
  for (let fieldName in formFields) {
    await fillField(page, fieldName);
  }
  await page.solveRecaptchas();
  await page.$eval(".forminator-button-submit", (el) => el.click());
  await page.waitFor(3000);
  await page.screenshot({ path: "./screenshot.png", fullPage: true });
};

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--proxy-server=socks5://127.0.0.1:9050"],
    });
    const page = await browser.newPage();
    setAddress();
    await setName();
    await fillForm(page);
    await page.waitFor(5000);
    await page.screenshot({ path: "./screenshot.png", fullPage: true });

    await browser.close();
  } catch (error) {
    console.log({ error });
  }
})();
