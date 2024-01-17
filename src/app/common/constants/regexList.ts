export const RegularExpressions = {
  passwordRegexPattern:
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/,
  emailPattern:
    /^(?!.*--)[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9]\.)+[a-zA-Z]{2,}(?<!-)$/,
  templateName: /^(?![_ -])[a-zA-Z0-9]+(?:[_ -](?![_-]))?[a-zA-Z0-9]+(?:[_ -](?![_-])?[a-zA-Z0-9]+)*$/,
  excessiveSpacesPattern: /^([A-Za-z]+ )*[A-Za-z]+$/,
  phonePattern: /^[6789]\d{9}$/,
  contactControlMaxLength: 10,
  namePattern: /^[A-Za-z'-]+$/, 
  // /^\s*[A-Za-z'-]+\s*$/ - with space allow
  namePatternWithEmptyString: /^[A-Za-z'-]*$/,
  verificationReasonPattern : /^(?=.*[A-Za-z0-9@#,.()\-'.])\s*[A-Za-z0-9@#,.()\-'.\s]+\s*$/,
  min4Char : 4,
  max100Char: 100,
  max255Char: 255,
  maxNameLength :35,
  minNameLength : 2,
  min1Char : 1,
  min3Char : 3,
  min10Char: 10,
  max30Char : 30,
  max50Char : 50,
  // for bulk upload module
  contactInd: /^[0-9]{10}$/g,
  templateNames: /^([\w\s-]+,?\s*)+$/,
  alphaNumeric : /^[a-zA-Z0-9]*$/,
  globalSearchPattern : /^[a-zA-Z0-9_ ]+$/,
  countryCode: /^\d{1,4}$/,
  nameWithSpace : /^[A-Za-z ]+$/
}

export const RegExpLength = {
  minVerificationReason:10,
  maxGlobalSearch : 25,
  maxQid : 20,
  maxRequestId : 22,
  maxCombinedRequestId : 24,
  checkNameMinLength: 4,
  checkNameMaxLength:30,
  documentListMinLength:2,
  documentListMaxLength:20,
  additionalCheck : /^[A-Za-z\s]*$/
}