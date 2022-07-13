import { gql } from "@apollo/client/core";
import { request } from "../config";

describe("survey form data", () => {
  it("should return a list of courses", async () => {
    const client = request.createApolloClient();
    const loginresponse = await client.mutate({
      mutation: gql`
        mutation {
          login(username: "testadmin", password: "testpassword") {
            success
            message
          }
        }
      `,
    });
    expect(loginresponse.data.login.success).toBeTruthy();

    const response = await client.query({
      query: gql`
        query {
          survey {
            courses {
              subject
              code
              term
            }
          }
        }
      `,
    });
    const courses = response.data.survey.courses;
    expect(courses.length).toBeGreaterThan(0);
    expect(
      courses.find((course: any) => course.subject === "CSC")
    ).toBeDefined();
  });
});
