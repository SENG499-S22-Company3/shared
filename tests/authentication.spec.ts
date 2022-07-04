import {
    sendGraphQLQuery,
} from "./test_config";

describe("Authentication should function correctly for users", () => {
    it("should log in with valid admin credentials", async () => {
        // Login
        const responseLogin = await sendGraphQLQuery(
          `mutation {
            login(username: "testadmin", password: "testpassword") {
                success
                token
                message
            }
          }`
        )

        const responseJSONLogin = await responseLogin.json();
        const responseHeadersLogin = await responseLogin.headers;
        const sessionCookie = await responseHeadersLogin.get("set-cookie") || "";
        expect(responseJSONLogin.data.login.success).toEqual(true);
        expect(responseJSONLogin.data.login.token).toEqual("");
        expect(responseJSONLogin.data.login.message).toEqual("Success");

        // Execute me query and return current user
        const responseMeQuery = await sendGraphQLQuery(
          `query {
            me {
              id
            }
          }`,
          sessionCookie
        )
        const responseMeQueryJSON = await responseMeQuery.json();
        expect(responseMeQueryJSON.data.me.id).toEqual(1);
        console.log(responseMeQueryJSON);

        // Logout
        const responseLogout = await sendGraphQLQuery(
          `mutation {
            logout {
                success
                token
                message
            }
          }`,
          sessionCookie
        )

        const responseJSONLogout = await responseLogout.json();      
        expect(responseJSONLogout.data.logout.success).toEqual(true);
        expect(responseJSONLogout.data.logout.token).toEqual("");
        expect(responseJSONLogout.data.logout.message).toEqual("Logged out");
    });

    it("should log in with valid user credentials", async () => {
        // Login
        const responseLogin = await sendGraphQLQuery(
          `mutation {
            login(username: "testuser", password: "testpassword") {
                success
                token
                message
            }
          }`
        )

        const responseJSONLogin = await responseLogin.json();
        const responseHeadersLogin = await responseLogin.headers;
        const sessionCookie = await responseHeadersLogin.get("set-cookie") || "";
        expect(responseJSONLogin.data.login.success).toEqual(true);
        expect(responseJSONLogin.data.login.token).toEqual("");
        expect(responseJSONLogin.data.login.message).toEqual("Success");

        // Execute me query and return current user
        const responseMeQuery = await sendGraphQLQuery(
          `query {
            me {
              id
            }
          }`,
          sessionCookie
        )
        const responseMeQueryJSON = await responseMeQuery.json();
        expect(responseMeQueryJSON.data.me.id).toEqual(2);
        console.log(responseMeQueryJSON);

        // Logout
        const responseLogout = await sendGraphQLQuery(
          `mutation {
            logout {
                success
                token
                message
            }
          }`,
          sessionCookie
        )

        const responseJSONLogout = await responseLogout.json();      
        expect(responseJSONLogout.data.logout.success).toEqual(true);
        expect(responseJSONLogout.data.logout.token).toEqual("");
        expect(responseJSONLogout.data.logout.message).toEqual("Logged out");
    });

    it("should fail authentication with invalid user credentials", async () => {
        // Attempt Login
        const responseLogin = await sendGraphQLQuery(
          `mutation {
            login(username: "fakeuser", password: "fakepassword") {
                success
                token
                message
            }
          }`
        )

        // Expect login to fail
        const responseJSONLogin = await responseLogin.json();
        expect(responseJSONLogin.data.login.success).toEqual(false);
        expect(responseJSONLogin.data.login.token).toEqual("");
        expect(responseJSONLogin.data.login.message).toEqual("Incorrect username or password");
    });
});