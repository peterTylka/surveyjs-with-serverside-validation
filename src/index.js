import $ from "jquery";
import { Model } from "survey-core";
import "survey-js-ui";
import "survey-core/defaultV2.min.css";
import "./index.css";
import { json } from "./json";

//here we just do post to create form where is validation and based on response
// - ok - complete survey
// - nok - captcha problem -> highlight captcha question
// - nok - other problem with save -> complete survey with error message ?
function validateCountry(_, { data, errors, complete }) {
  const countryName = data["country"];
  if (!countryName) {
    complete();
    return;
  }
  fetch("https://surveyjs.io/api/CountriesExample?name=" + countryName)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const found = data.length > 0;
      if (!found) {
        errors["country"] = "Country is not found";
      }
      complete();
    });
}
const survey = new Model(json);
survey.onComplete.add((sender, options) => {
  console.log(JSON.stringify(sender.data, null, 3));
});
survey.onServerValidateQuestions.add(validateCountry);

$("#surveyElement").Survey({ model: survey });

// setTimeout(() => {
$('[data-name="captcha"] div:first-child')
  // .append("ahoj");
  .append('<img id="captcha-img" src="https://picsum.photos/100/100" />');
// }, 3000);
