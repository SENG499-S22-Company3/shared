import {
    sendGraphQLQuery,
} from "./test_config";

describe("Generate base schedule with courses to timeslots and professors to courses assigned", () => {
    it("should return an authentication error when not logged in", async () => {
        // Attempt to generate schedule
        const responseGenerateSchedule = await sendGraphQLQuery(
          `mutation {
            generateSchedule(input: { year: 2022 }) {
                message
                success
            }
          }`
        );

        const responseJSONLogin = await responseGenerateSchedule.json();
        expect(responseJSONLogin.data.generateSchedule.message).toEqual("Not logged in");
        expect(responseJSONLogin.data.generateSchedule.success).toEqual(false);
    });

    it("should return a valid schedule when logged in", async () => {
        // Login
        const responseLogin = await sendGraphQLQuery(
          `mutation {
            login(username: "testadmin", password: "testpassword") {
                success
                token
                message
            }
          }`
        );

        const responseJSONLogin = await responseLogin.json();
        const responseHeadersLogin = await responseLogin.headers;
        const sessionCookie = await responseHeadersLogin.get("set-cookie") || "";
        expect(responseJSONLogin.data.login.success).toEqual(true);
        expect(responseJSONLogin.data.login.token).toEqual("");
        expect(responseJSONLogin.data.login.message).toEqual("Success");


        const responseGenerateSchedule = await sendGraphQLQuery(
          `mutation {
            generateSchedule(input: { year: 2022 }) {
                message
                success
            }
          }`,
          sessionCookie
        )
        const responseGenerateScheduleJSON = await responseGenerateSchedule.json();
        expect(responseGenerateScheduleJSON.data.generateSchedule.message).toEqual("Generating Schedule for Year: 2022");
        expect(responseGenerateScheduleJSON.data.generateSchedule.success).toEqual(true);
    });
});