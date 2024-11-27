const dns = require("dns");

function verifyDomain(email) {
  return new Promise((resolve, reject) => {
    const domain = email.split("@")[1];
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        reject(`Error resolving MX records for domain ${domain}: ${err}`);
      } else {
        resolve(addresses.length > 0);
      }
    });
  });
}

module.exports = verifyDomain;
