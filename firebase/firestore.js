const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: "flytanthome",
  private_key_id: "075b93553f745f358b5d39c105269c2737b1b0ee",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDKvi96ffuRLpd3\nlMCZ+2u/o16iFRFo49FqAlrLBVLiozSnia2p5U3IdjD81pdBRQnzQ/dZ8Fvl+jTd\ngkCGzVbhl2Quv+IbjyD0tTFXqlJLfXZiowCAmSRV8o8FdzgmaYSK5GAcXtXQg6N+\n0iSulX0Sh3ALSN7rS7dnTvaJ8vemU0SBnStTXOb2O2/NpdqKWk60h6nQtSG6Db5f\noA4bc2O0tuqY7Glrdx4lDXBXQm7521elvl4gYG6qqfqliBkVCGITlJp6dZdzHhb+\ns/qtOa8OkVZ4bv1d0prTymy4/HBsg7XSrX2+UZ5eclUMFp9JiiZpCP/2YpjiytlR\nqcLzq1PPAgMBAAECggEABCUcUx4/dPN4ouKzQzbsjWqWTaRpbLVJhlsLkXxYpRA1\nqi0SAzF2rtdwBX1uLjdMUsexWF/qS7vnz3NEiWNl3IaVkVthELO1WKUEwip4EmI7\nd+mU8wwdaJgpUoZZ2hBCM3Mj1X1z7ieJORu9JqYyJvKxYTI3Q/oa2FX9WFvcOvf9\nICPIwuZJh5z5fsX9QbQnxtcrx5SzJpMkcU9h/+svNQLwBQHa5FwGzvNzNqwLXCb9\nO9sxA9YnEAtWWQnYIZgtkjH9LH9GGqwUEpMPkEzb2xMtiJYDjQK8mCUYAlJQ64pw\n8xUQUzmJxJxVycAqmSXWpXQrCHHaeVlpH8DKVJySIQKBgQDmxrCL2qf9AqIfq68i\npgLIXCs60tRk7aTMM18smjLq/o8Y3gn0AYfuk9cQE331CPbQFH+SynQ4A+O4nM6J\nRxSXeiP0sPB6febsVeYZX6izXKUt4RGUwhFR5RE4j2pMYnMhlx1jko8hoatHImVh\nvdjyvkG76S/IxYTnmePY3NZBdwKBgQDg5xpOWvSFED0POBknr0mc2m8+Pc4t3lbk\nvMgvG7x/tIxm7FSUyKDbFUb62ab+1TX9M/nRw0Sx/Xdp7s4tTB9pVxw91QALFalU\n2VJZne+riYz4DiPikOyQ9fEKmMJBY3oujOcPcRQMIlpTmLcpETndUGpKVCfjCrlO\nqIEdj7fWaQKBgHts6sFxyYTVIraDkSCb30MfoHNOjRAJ1ajtFMr7EZ6DVS88meAp\n7XSZF13evvANwktZmz18EBphYiq7mu7q2EWHqrFU7Njme1oNOwp5EfYT57gY9tkz\nziWZuNMiSPzfbqoZczttCCY5nCxoZgaXje+N+AQzXD4p/cIMmULEIcdTAoGAF9Ym\noZteQyQfdJd7gws/ABLeq3gdfBsOlpuzk9qateZK4zW1GTfSZKXyqe+blXK/kCCM\nH8FUbJDysRWQYJiq051Z7uu+X25iTg3ifoEQv9uKR1goUYEOsaZ/b6IVJJ0IfBqO\n+sH/X/HcJPQQpZefzGcTfOFCgPvH/CA73wg2cdECgYEAm+szuufAe3jmCVt7AMSY\nwB+dpZ2f/H6dMm2eSBWdGl4UVqdpz4bBVWy4ZD6mthpvxmsFwqghahq7ZPRsN8Lu\ndbCFIpGDktosEspiv6emXC/bxm12ZruNHQ5uF/3wuHkvBDxChuFB6I5D+mIGIGM0\nle+V4QmmNnMyxr+fWl9h1xQ=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-ku29g@flytanthome.iam.gserviceaccount.com",
  client_id: "106387868236905081417",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ku29g%40flytanthome.iam.gserviceaccount.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flytanthome-default-rtdb.firebaseio.com",
});

const firestore = admin.firestore();

module.exports = firestore;
