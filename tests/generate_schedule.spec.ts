import each from "jest-each";
import { gql } from "@apollo/client/core";
import { request } from "../config";

describe("Generate base schedule with courses to timeslots and professors to courses assigned", () => {
  it("should return an authentication error when not logged in", async () => {
    const client = request.createApolloClient();
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
  describe("when logged in as an ADMIN", () => {
    it("should allow schedule generation when logged in", async () => {
      const client = request.createApolloClient();
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
      expect(
        generateScheduleResponse.data.generateSchedule.success
      ).toBeTruthy();
    });

    describe("when calling company 3 and company 4", () => {
      each([
        ["COMPANY3", "COMPANY3"],
        ["COMPANY3", "COMPANY4"],
        ["COMPANY4", "COMPANY3"],
        ["COMPANY4", "COMPANY4"],
      ]).test(
        'should return a schedule for alg1 "%s" and alg2 "%s"',
        async (alg1: string, alg2: string) => {
          const client = request.createApolloClient();
          // login
          await client.mutate({
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
          const generateScheduleResponse = await client.mutate({
            mutation: gql`
              mutation ($input: GenerateScheduleInput!) {
                generateSchedule(input: $input) {
                  success
                  message
                }
              }
            `,
            variables: {
              input: {
                algorithm1: alg1,
                algorithm2: alg2,
                term: "SUMMER",
                year: 2022,
                courses: [{ subject: "CSC", code: "225", section: 0 }],
              },
            },
          });

          expect(
            generateScheduleResponse.data.generateSchedule.message
          ).toEqual("Generating Schedule for Year: 2022");
          expect(
            generateScheduleResponse.data.generateSchedule.success
          ).toBeTruthy();
        }
      );
    });
  });
});
