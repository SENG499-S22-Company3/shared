import { gql } from "@apollo/client/core";
import { request } from "../config";

describe("Generate base schedule with courses to timeslots and professors to courses assigned", () => {
  it("should return an authentication error when not logged in", async () => {
    const { client } = request.createApolloClient();
    // Attempt to generate schedule

    const response = await client.mutate({
      mutation: gql`
        mutation {
          generateSchedule(
            input: {
              algorithm1: COMPANY3
              algorithm2: COMPANY4
              term: SUMMER
              year: 2022
              courses: [{ subject: "CSC", code: "225", section: 0 }]
            }
          ) {
            message
            success
          }
        }
      `,
    });

    expect(response.data.generateSchedule.message).toEqual("Not logged in");
    expect(response.data.generateSchedule.success).toBeFalsy();
  });

  it("should allow schedule generation when logged in", async () => {
    const { client } = request.createApolloClient();
    // Login
    const loginResponse = await client.mutate({
      mutation: gql`
        mutation {
          login(username: "testadmin", password: "testpassword") {
            success
            token
            message
          }
        }
      `,
    });

    expect(loginResponse.data.login.success).toBeTruthy();
    expect(loginResponse.data.login.token).toEqual("");
    expect(loginResponse.data.login.message).toEqual("Success");

    const generateScheduleResponse = await client.mutate({
      mutation: gql`
        mutation {
          generateSchedule(
            input: {
              algorithm1: COMPANY3
              algorithm2: COMPANY4
              term: SUMMER
              year: 2022
              courses: [{ subject: "CSC", code: "225", section: 0 }]
            }
          ) {
            message
            success
          }
        }
      `,
    });

    expect(generateScheduleResponse.data.generateSchedule.message).toEqual(
      "Generating Schedule for Year: 2022"
    );
    expect(generateScheduleResponse.data.generateSchedule.success).toBeTruthy();
  });
});
