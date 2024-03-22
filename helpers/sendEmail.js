import dotenv from "dotenv";
import ElasticEmail from "@elasticemail/elasticemail-client"

dotenv.config();
const { ELASTICEMAIL_API_KEY } = process.env;

const defaultClient = ElasticEmail.ApiClient.instance;
const apikey = defaultClient.authentications['apikey'];
apikey.apiKey = ELASTICEMAIL_API_KEY
const api = new ElasticEmail.EmailsApi();

export const sendEmail = (data) => {

    const { to, subject, html } = data;
    
    const email = ElasticEmail.EmailMessageData.constructFromObject({
        Recipients: [
            new ElasticEmail.EmailRecipient(to)
        ],
        Content: {
            Body: [
                ElasticEmail.BodyPart.constructFromObject({
                ContentType: "HTML",
                Content: html
                })
            ],
            Subject: subject,
            From: "iratololo1991@gmail.com"
        }
  });
  
    const callback = function(error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('API called successfully.');
        }
    };
    api.emailsPost(email, callback);
}