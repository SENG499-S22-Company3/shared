import { gql } from "@apollo/client/core";
import { request } from "../config";

describe("Generate survey response with preferred classes,", () => {
    it("should return success response on valid survey submission", async () => {
        const client = request.createApolloClient();

        const mutation = gql`
          mutation {
            login(username: "testuser", password: "testpassword") {
              message
              token
              success
            }
          }
        `;

        const loginResponse = await client.mutate({ mutation });
        expect(loginResponse.errors).toBeUndefined();
        expect(loginResponse.data.login.success).toBeTruthy();
        expect(loginResponse.data.login.message).toBeDefined();
        expect(loginResponse.data.login.token).toBeDefined();

        const response = await client.mutate({
            mutation: gql`
                mutation {
                    createTeachingPreference(
                        input: {
                            "peng": false,
                            "userId": 99,
                            "courses": [
                                {
                                    "subject": "Design Project",
                                    "code": "SENG499",
                                    "term": "SUMMER",
                                    "preference": 5 
                                }
                            ],
                            "nonTeachingTerm": "FALL",
                            "hasRelief": true,
                            "reliefReason": "I want to go on a vacation",
                            "hasTopic": false,
                            "topicDescription": null
                        }
                    )   {
                        message
                        success
                        }
                    }
                `,
            });
        console.log(response.data);
        expect(response.data.createTeachingPreference.message).toEqual("");
        expect(response.data.createTeachingPreference.success).toBeTruthy();
    });
});