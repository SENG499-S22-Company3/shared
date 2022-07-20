import { gql } from "@apollo/client/core";
import { request } from "../config";

describe("Users are able to submit teaching preferences", () => {
    it("should submit preference survey when logged in as user", async () => {
      // Given (login & submit a preference survey)
      const { client, setToken } = request.createApolloClient();

      // Login as admin
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
      expect(loginResponse.data.login.token).toBeDefined();
      expect(loginResponse.data.login.message).toEqual("Success");
      setToken(loginResponse.data.login.token);

      // Create test user
      const randomUsername = Math.floor(Math.random() * 1000000).toString();
      const createTestUserResponse = await client.mutate({
        mutation: gql`
          mutation {
            createUser(username: "${randomUsername}") {
              success
              message
              username
              password
            }
          }
        `,
      })
      expect(createTestUserResponse.data.createUser.success).toBeTruthy();
      expect(createTestUserResponse.data.createUser.message).toEqual("User created successfully with password 'testpassword'. Please login and change it.");
      expect(createTestUserResponse.data.createUser.username).toEqual(randomUsername);
      expect(createTestUserResponse.data.createUser.password).toEqual("testpassword");
      setToken("");

      // Login as new user
      const loginTestUserResponse = await client.mutate({
        mutation: gql`
          mutation {
              login(username: "${randomUsername}", password: "testpassword") {
              success
              token
              message
              }
          }
        `,
      });
      expect(loginTestUserResponse.data.login.success).toBeTruthy();
      expect(loginTestUserResponse.data.login.token).toBeDefined();
      expect(loginTestUserResponse.data.login.message).toEqual("Success");
      setToken(loginTestUserResponse.data.login.token);     

      // When
      const submitPreferenceResponse = await client.mutate({
        mutation: gql`
          mutation {
            createTeachingPreference(
              input: {
                peng: false,
                userId: 1,
                courses: [
                  {subject: "CSC", code: "111", term: FALL, preference: 1}
                ],
                nonTeachingTerm: FALL,
                hasRelief: false,
                reliefReason: "",
                hasTopic: false,
                topicDescription: "",
                fallTermCourses: 2,
                springTermCourses: 2,
                summerTermCourses: 2
              }
            ) {
              message
              success
            }
          }
        `,
      });

      // Then (confirm preference submitted)
      expect(submitPreferenceResponse.data.createTeachingPreference.message).toEqual('Teaching preferences updated.');
      expect(submitPreferenceResponse.data.createTeachingPreference.success).toEqual(true);

      // Re-login as admin
      setToken("");
      const loginAdminResponse = await client.mutate({
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
      expect(loginAdminResponse.data.login.success).toBeTruthy();
      expect(loginAdminResponse.data.login.token).toBeDefined();
      expect(loginAdminResponse.data.login.message).toEqual("Success");
      setToken(loginAdminResponse.data.login.token);

      // Validate that submitted course preference for professors is valid by querying for all users
      const getAllUsersResponse = await client.query({
        query: gql`
          query {
            allUsers {
              id
              username
              displayName
              password
              role
              preferences {
                id {
                  subject
                  title
                  code
                  term
                }
                preference
              }
              active
              hasPeng
            }
          }
        `,
      });

      // Filter to search for new user
      const filterNewUser = (element: any, index: any, array: any) => {
          return element.username == randomUsername;
      };
      const newUser = getAllUsersResponse.data.allUsers.filter(filterNewUser)[0];    

      // Validate preference is correct
      expect(newUser.preferences.length).toEqual(1);
      expect(newUser.preferences[0].id.subject).toEqual('CSC');
      expect(newUser.preferences[0].id.code).toEqual('111');
      expect(newUser.preferences[0].id.title).toEqual('Fundamentals of Programming with Engineering Applications');
      expect(newUser.preferences[0].preference).toEqual(1);
    });

    it("should not allow preference survey submission if not logged in", async () => {
        // Given (login & submit a preference survey)
        const { client } = request.createApolloClient();

        // When
        const submitPreferenceResponse = await client.mutate({
            mutation: gql`
              mutation {
                createTeachingPreference(
                  input: {
                    peng: false,
                    userId: 1,
                    courses: [],
                    nonTeachingTerm: FALL,
                    hasRelief: false,
                    hasTopic: false,
                    topicDescription: ""
                  }
                ) {
                  message
                  success
                }
              }
            `,
          });

        // Then
        expect(submitPreferenceResponse.data.createTeachingPreference.message).toEqual("Not logged in");
        expect(submitPreferenceResponse.data.createTeachingPreference.success).toBeFalsy();
    });
});