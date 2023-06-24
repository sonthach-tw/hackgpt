var delayTimer;
import axios from 'axios';

var chatGPTAlert = document.createElement("p");
function setupPopup() {
  const popup = document.createElement("div");
  popup.id = "popup";
  popup.innerHTML = "<div id=\"popup\">\n" +
    "  <h3>Popup Content</h3>\n" +
    "  <p>This is the content of the popup.</p>\n" +
    "</div>";

  popup.style.display = 'none';
  popup.style.position = 'fixed';
  popup.style.color = 'black';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.backgroundColor = '#fff';
  popup.style.padding = '20px';
  popup.style.borderRadius = '5px';
  popup.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
  popup.style.zIndex = '9999';

// Insert pop up after the chatgpt-alert
  document.getElementById("chatgpt-alert").insertAdjacentElement("afterend", popup);


  document.getElementById("chatgpt-alert").addEventListener("click", function () {
    console.log('click popup')
    // toggle the display of the popup
    if (popup.style.display === 'none') {
      popup.style.display = 'block';
    } else {
      popup.style.display = 'none';
    }
  })
}


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
    John_the_Ripper: /^[J,j]ohn\ [T,t]he\ [R,r]ipper|john-[1-9].[1-9].[1-9]|Many\ salts:|Only\ one\ salt:|openwall.com\/john\/|List.External:[0-9a-zA-Z]*|Loaded\ [0-9]*\ password hash|guesses:\ \d*\ \ time:\ \d*:\d{2}:\d{2}:\d{2}|john\.pot$/,
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
    MySQLite_database_dump: /^DROP\ TABLE\ IF\ EXISTS\ \[[a-zA-Z]*\];|CREATE\ TABLE\ \[[a-zA-Z]*\];$/
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


function scanInput() {
  clearTimeout(delayTimer); // Clear the previous timer

  var input = document.getElementById("prompt-textarea").value;


  if (input === ''){
    chatGPTAlert.innerHTML = ``
  }else {
    chatGPTAlert.textContent = 'Checking for patterns...'
    chatGPTAlert.style.color = "white"
  }

  delayTimer = setTimeout(function () {
    if (input === '') {
      return
    }
    axios.post('http://107.23.251.205:5001/predict', {
      text: input,
      labels: ["secret", "project information", "credit card number", "password"]
    }).then((res)=>{
      // {credit card number: 0.10985954850912094, password: 0.5424003005027771, project information: 0.1493598371744156, secret: 0.19838030636310577}
      const resObj = res.data
      console.log(resObj)
      // Check if any value > 0.5 then log the key to console
      for (const key in resObj) {
        if (resObj[key] > 0.5) {
          console.log(key)
          // Set chatGPTAlert content
          chatGPTAlert.innerHTML = `This message contains ${key}!`
          // make the color red
          chatGPTAlert.style.color = "red"

          const submitButton = textarea.parentNode.childNodes[textarea.parentNode.childNodes.length - 1]
          submitButton.disabled = true
        }else {
          chatGPTAlert.innerHTML = `Nothing has been detected!`
          // make the color red
          chatGPTAlert.style.color = "green"
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






