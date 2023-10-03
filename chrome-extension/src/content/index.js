var delayTimer;
import axios from 'axios';

var chatGPTAlert = document.createElement("p");

// function setupPopup() {
//   const popup = document.createElement("div");
//   popup.id = "popup";
//   popup.innerHTML = "<div id=\"popup\">\n" +
//     "  <h3>Popup Content</h3>\n" +
//     "  <p>This is the content of the popup.</p>\n" +
//     "</div>";
//
//   popup.style.display = 'none';
//   popup.style.position = 'fixed';
//   popup.style.color = 'black';
//   popup.style.top = '50%';
//   popup.style.left = '50%';
//   popup.style.transform = 'translate(-50%, -50%)';
//   popup.style.backgroundColor = '#fff';
//   popup.style.padding = '20px';
//   popup.style.borderRadius = '5px';
//   popup.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
//   popup.style.zIndex = '9999';
//
// // Insert pop up after the chatgpt-alert
//   document.getElementById("chatgpt-alert").insertAdjacentElement("afterend", popup);
//
//
//   document.getElementById("chatgpt-alert").addEventListener("click", function () {
//     console.log('click popup')
//     // toggle the display of the popup
//     if (popup.style.display === 'none') {
//       popup.style.display = 'block';
//     } else {
//       popup.style.display = 'none';
//     }
//   })
// }


function setupCheckingElement() {

  chatGPTAlert.className = 'chatgpt-alert'
  chatGPTAlert.id = 'chatgpt-alert'
  chatGPTAlert.style.color = 'white'
  chatGPTAlert.style.cursor = 'pointer'
  chatGPTAlert.style.padding = '10px'
  chatGPTAlert.style.paddingBottom = '0px'
  document.getElementById("prompt-textarea").insertAdjacentElement("afterend", chatGPTAlert);
}

function checkPattern(input) {
  // Define the patterns
  const patterns = {
    google_two_factor_backup: /^(?:BACKUP VERIFICATION CODES|SAVE YOUR BACKUP CODES)[\s\S]{0,300}$/,
    heroku_key: /^(heroku_api_key|HEROKU_API_KEY|heroku_secret|HEROKU_SECRET)[a-z_ =\s"'\:]{0,10}[^a-zA-Z0-9-]\w{8}(?:-\w{4}){3}-\w{12}[^a-zA-Z0-9\-]$/,
    MailGun_API_Key: /^key-[0-9a-zA-Z]{32}$/,
    microsoft_office_365_oauth_context: /^https:\/\/login.microsoftonline.com\/common\/oauth2\/v2.0\/token|https:\/\/login.windows.net\/common\/oauth2\/token$/,
    PayPal_Braintree_Access_Token: /^access_token\$production\$[0-9a-z]{16}\$[0-9a-f]{32}$/,
    Picatic_API_Key: /^sk_live_[0-9a-z]{32}$/,
    ECDSA_Private_Key: /^-----BEGIN ECDSA PRIVATE KEY-----\s.*,ENCRYPTED(?:.|\s)+?-----END ECDSA PRIVATE KEY-----$/,
    KeePass_1x_CSV_Passwords: /^"Account","Login Name","Password","Web Site","Comments"$/,
    KeePass_1x_XML_Passwords: /^<pwlist>\s*?<pwentry>[\S\s]*?<password>[\S\s]*?<\/pwentry>\s*?<\/pwlist>$/,
    Password_etc_shadow: /^[a-zA-Z0-9\-]+:(?:(?:!!?)|(?:\*LOCK\*?)|\*|(?:\*LCK\*?)|(?:\$.*\$.*\$.*?)?):\d*:\d*:\d*:\d*:\d*:\d*$/,
    MailChimp_API_Key: /^[0-9a-f]{32}-us[0-9]{1,2}$/,
    PGP_Header: /^-{5}(?:BEGIN|END)\ PGP\ MESSAGE-{5}$/,
    PKCS7_Encrypted_Data: /^(?:Signer|Recipient)Info(?:s)?\ ::=\ \w+|[D|d]igest(?:Encryption)?Algorithm|EncryptedKey\ ::= \w+$/,
    PuTTY_SSH_DSA_Key: /^PuTTY-User-Key-File-2: ssh-dss\s*Encryption: none(?:.|\s?)*?Private-MAC:$/,
    PuTTY_SSH_RSA_Key: /^PuTTY-User-Key-File-2: ssh-rsa\s*Encryption: none(?:.|\s?)*?Private-MAC:$/,
    Samba_Password_config_file: /^[a-z]*:\d{3}:[0-9a-zA-Z]*:[0-9a-zA-Z]*:\[U\ \]:.*$/,
    SSH_DDS_Public: /^ssh-dss [0-9A-Za-z+/]+[=]{2}$/,
    SSH_RSA_Public: /^ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3} [^@]+@[^@]+$/,
    SSL_Certificate: /^-----BEGIN CERTIFICATE-----(?:.|\n)+?\s-----END CERTIFICATE-----$/,
    Lightweight_Directory_Access_Protocol: /^(?:dn|cn|dc|sn):\s*[a-zA-Z0-9=, ]*$/,
    Arista_network_configuration: /^via\ \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3},\ \d{2}:\d{2}:\d{2}$/,
    Huawei_config_file: /^sysname\ HUAWEI|set\ authentication\ password\ simple\ huawei$/,
    Metasploit_Module: /^require\ 'msf\/core'|class\ Metasploit|include\ Msf::Exploit::\w+::\w+$/,
    Network_Proxy_Auto_Config: /^proxy\.pac|function\ FindProxyForURL\(\w+,\ \w+\)$/,
    Nmap_Scan_Report: /^Nmap\ scan\ report\ for\ [a-zA-Z0-9.]+$/,
    Cisco_Router_Config: /^service\ timestamps\ [a-z]{3,5}\ datetime\ msec|boot-[a-z]{3,5}-marker|interface\ [A-Za-z0-9]{0,10}[E,e]thernet$/,
    Simple_Network_Management_Protocol_Object_Identifier: /^(?:\d\.\d\.\d\.\d\.\d\.\d{3}\.\d\.\d\.\d\.\d\.\d\.\d\.\d\.\d\.\d{4}\.\d)|[a-zA-Z]+[)(0-9]+\.[a-zA-Z]+[)(0-9]+\.[a-zA-Z]+[)(0-9]+\.[a-zA-Z]+[)(0-9]+\.[a-zA-Z]+[)(0-9]+\.[a-zA-Z]+[)(0-9]+\.[a-zA-Z0-9)(]+\.[a-zA-Z0-9)(]+\.[a-zA-Z0-9)(]+\.[a-zA-Z0-9)(]+$/,
    Bank_of_America_Routing_Numbers_California: /^(?:121|026)00(?:0|9)(?:358|593)$/,
    BBVA_Compass_Routing_Number_California: /^321170538$/,
    Chase_Routing_Numbers_California: /^322271627$/,
    Citibank_Routing_Numbers_California: /^32(?:11|22)71(?:18|72)4$/,
    USBank_Routing_Numbers_California: /^12(?:1122676|2235821)$/,
    United_Bank_Routing_Number_California: /^122243350$/,
    Wells_Fargo_Routing_Numbers_California: /^121042882$/,
    SWIFT_Codes: /^[A-Za-z]{4}(?:GB|US|DE|RU|CA|JP|CN)[0-9a-zA-Z]{2,5}$/,
    CVE_Number: /^CVE-\d{4}-\d{4,7}$/,
    Dropbox_Links: /^https:\/\/www.dropbox.com\/(?:s|l)\/\S+$/,
    Box_Links: /^https:\/\/app.box.com\/[s|l]\/\S+$/,
    Large_number_of_US_Zip_Codes: /^(\d{5}-\d{4}|\d{5})$/,
    MySQL_database_dump: /^DROP DATABASE IF EXISTS(?:.|\n){5,200}CREATE DATABASE(?:.|\n){5,200}DROP TABLE IF EXISTS(?:.|\n){5,200}CREATE TABLE$/,
    MySQLite_database_dump: /^DROP\ TABLE\ IF\ EXISTS\ \[[a-zA-Z]*\];|CREATE\ TABLE\ \[[a-zA-Z]*\];$/,
    GitHub_Access_Token: /^[a-zA-Z0-9]{40}$/,
    AWS_Access_Key_ID: /^AKIA[0-9A-Z]{16}$/,
    AWS_Secret_Access_Key: /^[\w\/+=]{40}$/,
    Slack_Token: /^xox[baprs]-[0-9]{12}-[0-9]{12}-[0-9]{12}-[a-z0-9]{32}$/,
    Trello_API_Key: /^[0-9a-f]{32}$/,
    Trello_Token: /^[0-9a-f]{64}$/,
    Discord_Token: /^[\w-]{24}\.[\w-]{6}\.[\w-]{27}$/,
    Auth0_Client_ID: /^[\w-]{26}$/,
    Auth0_Client_Secret: /^[\w-]{43}$/,
    Asana_PAT: /^0\/[0-9a-f]{32}$/,
    JIRA_Token: /^[0-9a-f]{48}$/,
    Slack_Webhook_URL: /^https:\/\/hooks\.slack\.com\/services\/T\w+\/B\w+\/\w+$/,
    Google_API_Key: /^[A-Za-z0-9_]{39}$/,
    AWS_SQS_Queue_URL: /^https:\/\/sqs\.[a-zA-Z0-9\-]{3,}\.amazonaws\.com\/[0-9]{12}\/[a-zA-Z0-9\-_]+$/,
    Firebase_Web_API_Key: /^[a-zA-Z0-9_\-]{25,}$/,
    CREDIT_CARD: /^((4\d{3})|(5[1-5]\d{2})|(6011))([- ]?)\d{4}\4\d{4}\4\d{4}|3[4,7]\d{13}$/,

// Previous patterns...
    Slack_User_Token: /^xoxp-[0-9]{12}-[0-9]{12}-[0-9]{12}-[a-z0-9]{32}$/,
    GitHub_Client_ID: /^[0-9a-f]{20}$/,
    GitHub_Client_Secret: /^[0-9a-f]{40}$/,
    Twitter_API_Key: /^[a-zA-Z0-9]{25,32}$/,
    Twitter_API_Secret_Key: /^[a-zA-Z0-9]{35,45}$/,
    // LinkedIn_Client_ID: /^[a-zA-Z0-9]{12}$/,
    LinkedIn_Client_Secret: /^[a-zA-Z0-9]{16}$/,
    // Facebook_App_ID: /^[0-9]{13,15}$/,
    Facebook_App_Secret: /^[0-9a-f]{32}$/,
    Google_Service_Account_Key: /^[\w-]{36}\.json$/,
    Azure_Service_Principal_Client_ID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    Azure_Service_Principal_Client_Secret: /^[0-9a-zA-Z]{44}$/,
    Salesforce_Session_ID: /^00D[a-zA-Z0-9]{12,15}\.[a-zA-Z0-9]{4,15}\.[a-zA-Z0-9]{4,15}$/,
    Salesforce_OAuth_Access_Token: /^00D[a-zA-Z0-9]{12,15}![a-zA-Z0-9]{8,48}$/,
    SendGrid_API_Key: /^SG\.[a-zA-Z0-9_\-]{22}\.[a-zA-Z0-9_\-]{43}$/,
    Twilio_Account_SID: /^AC[a-zA-Z0-9]{32}$/,
    Twilio_Auth_Token: /^[0-9a-f]{32}$/,
    Stripe_Secret_Key: /^sk_live_[0-9a-zA-Z]{24}$/,
    Stripe_Publishable_Key: /^pk_live_[0-9a-zA-Z]{24}$/,
    PayPal_Client_ID: /^A[a-zA-Z0-9_-]{16,32}$/,
    PayPal_Client_Secret: /^[a-zA-Z0-9]{24,32}$/,
    Zoom_API_Key: /^[a-zA-Z0-9]{19}$/,
    Zoom_API_Secret: /^[a-zA-Z0-9]{39}$/,
    Slack_App_Token: /^xapp-[A-Z0-9]{21}-[A-Z0-9]{9}-[A-Z0-9]{9}-[a-z0-9]{32}$/,
    Dropbox_API_Token: /^[-_a-zA-Z0-9]{64}$/,
    WhatsApp_API_Token: /^[0-9a-zA-Z]{32}$/,
    Authy_API_Key: /^[0-9a-zA-Z]{32}$/,
    Slack_Bot_User_OAuth_Access_Token: /^xoxb-[0-9]{12}-[0-9]{12}-[a-zA-Z0-9]{24}$/,
    Slack_App_User_OAuth_Access_Token: /^xoxp-[0-9]{12}-[0-9]{12}-[a-zA-Z0-9]{24}$/,


    Docker_Hub_Access_Token: /^[a-zA-Z0-9]{64}$/,
    DigitalOcean_API_Token: /^[a-f0-9]{64}$/,
    Slack_Signing_Secret: /^[0-9a-f]{32}$/,
    GitHub_Personal_Access_Token: /^[0-9a-f]{40}$/,
    Jenkins_Credential: /^(?:username|password): .+$/,
    JFrog_Artifactory_API_Key: /^[0-9a-f]{32}$/,
    GitLab_Access_Token: /^[0-9a-zA-Z]{20,}$/,

    // Add more patterns here...
    Atlassian_API_Token: /^[0-9a-zA-Z]{48}$/,
    Atlassian_App_Secret: /^[0-9a-f]{40}$/,
    // Slack_Secret: /^[0-9a-zA-Z]{16,32}$/,
    Microsoft_Azure_Client_ID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    Microsoft_Azure_Client_Secret: /^[0-9a-zA-Z]{24,72}$/,
    Microsoft_Azure_Tenant_ID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    Microsoft_Azure_Subscription_ID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    Microsoft_Azure_Application_ID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    Microsoft_Azure_Certificate: /^-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----$/,
    IBM_Cloud_API_Key: /^[a-zA-Z0-9]{32}$/,
    IBM_Watson_API_Key: /^[a-zA-Z0-9]{44}$/,
    IBM_Watson_Assistant_Workspace_ID: /^[a-zA-Z0-9]{32}$/,
    IBM_Watson_Assistant_API_Key: /^[a-zA-Z0-9_\-]{40}$/,
    Google_Service_Account_JSON: /^{[\s\S]*"type": "service_account"[\s\S]*}$/,
    EMAIL: /^[\w+\-.]+@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)*\.[a-zA-Z0-9]{2,}$/
  };

  const res = []

  // Check if input matches any pattern
  for (const patternKey in patterns) {
    const pattern = patterns[patternKey];
    if (pattern.test(input)) {
      res.push(patternKey)
    }
  }

  // If no match found
  return res;
}


function showAlert(key, priority, canMask = false) {
  chatGPTAlert.innerHTML = `This message might contains ${key}! ${canMask ? ', click to mask' : ''}`
  // make the color light orange
  chatGPTAlert.style.color = "#ff8c00"
  if (priority >= 0.5) {
    chatGPTAlert.style.color = "#ff0000"
  }

  const submitButton = textarea.parentNode.childNodes[textarea.parentNode.childNodes.length - 1]
  // submitButton.disabled = true
}

function greenText() {
  chatGPTAlert.innerHTML = `Nothing has been detected!`
  // make the color light green
  chatGPTAlert.style.color = '#00ff00'
  const submitButton = textarea.parentNode.childNodes[textarea.parentNode.childNodes.length - 1]
  submitButton.disabled = false
}
// create array with 100 elements

function maskWords(input, maskingWords) {
  chatGPTAlert.addEventListener('click', () => {
    const maskedInput = input.split(' ').map((word) => {
      const found = maskingWords.find((maskingWord) => {
        return maskingWord.word === word
      })
      if (found) {
        return `<<MASKED>>`
      } else {
        return word
      }

    }).join(' ')
    document.getElementById("prompt-textarea").value = maskedInput
    greenText()
  })
}

function scanInput() {
  clearTimeout(delayTimer); // Clear the previous timer

  var input = document.getElementById("prompt-textarea").value;


  if (input === '') {
    chatGPTAlert.innerHTML = ``
  } else {
    chatGPTAlert.textContent = 'Checking for patterns...'
    chatGPTAlert.style.color = "white"
  }

  const maskingWords = []
  input.split(' ').forEach((word) => {
    const patterns  = checkPattern(word)
    if (patterns.length > 0) {
      showAlert(patterns.join(', '))
      maskingWords.push({
        word: word,
        pattern: patterns[0]
      })
    }
  })
  if (maskingWords.length !== 0) {
    maskWords(input, maskingWords);
    return
  }

  delayTimer = setTimeout(function () {
    if (input === '') {
      return
    }
    const sensitiveLabels = ["secret","project information","credit card","password", "ssh key","project user story"]
    const normalLabels = []
    const labels = sensitiveLabels.concat(normalLabels)

    // replace word map labels
    console.log(labels)

    // replace input if it contains any value of labels
    const maskedInput = input.replace(/(secret|project information|credit card|password|ssh key|project user story)/g, '')

    axios.post('http://107.23.251.205:5001/predict', {
      text: maskedInput,
      labels: labels
    }).then((res) => {
      // {credit card number: 0.10985954850912094, password: 0.5424003005027771, project information: 0.1493598371744156, secret: 0.19838030636310577}
      const resObj = res.data
      console.log(resObj)
      // Check if any value > 0.5 then log the key to console
      for (const key in resObj) {
        if (resObj[key] > 0.3) {
          console.log(key)
          // Set chatGPTAlert content
          return showAlert(key,resObj[key]);
        } else{
          greenText();
        }
      }
    })

  }, 1000)
}

document.getElementById("prompt-textarea").addEventListener("input", scanInput);


var textarea = document.getElementById("prompt-textarea");

textarea.addEventListener("input", scanInput);


setupCheckingElement();


setupPopup();
console.log("Hello from the content script!");

