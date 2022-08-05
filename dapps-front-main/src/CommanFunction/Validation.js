export function isValidationEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email === "" || email === "undefined") {
    return false;
  }
  return re.test(String(email).toLowerCase());
}

export function isValidEmail(value) {
  console.log("helllooooooooooooo");
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
  return re.test(String(value).toLowerCase());
}

export function isName(name) {
  if (name === "" || typeof name === "undefined") {
    return false;
  } else {
    return true;
  }
}

export const isSpecialChar = (text) => {
  var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  // return true if found special char
  return format.test(text);
};

export function isBlank(value) {
  return value === null || value.match(/^ *$/) !== null;
}

export function isUrlValid(userInput) {
  if (typeof userInput === "undefined" || userInput === "") {
    return false;
  }
  var res = userInput.match(
    /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
  );
  if (res == null) return false;
  else return true;
}

export function isUrlValidTelegram(userInput) {
  if (typeof userInput === "undefined" || userInput === "") {
    return false;
  }
  var res = userInput.match(
    /https?:\/\/(t(elegram)?\.me|telegram\.org)\/([A-Za-z0-9\_]{5,32})\/?/g // eslint-disable-line no-useless-escape
  );
  if (res == null) return false;
  else return true;
}

export function isValidAlphabet(value) {
  const re = /^[A-Z a-z]+$/;
  return re.test(value);
}

export function isValidPassword(value) {
  const re = /^(?=.*\d)(?=.*[A-Z]).{8,20}$/;
  if (value === "" || value === "undefined") {
    return false;
  }
  return re.test(value);
}

export function isValidAlNumber(value) {
  const re = /^[0-9]*$/;
  return re.test(value);
}

export function isValidContact(value) {
  const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return re.test(value);
}

export function isValidIdNumber(value) {
  const re = /^[0-9]*$/;
  return re.test(value);
}
export function isValidName(value) {
  const re = /^\S*$/;
  return re.test(value);
}
