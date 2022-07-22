import { gql } from "@apollo/client/core";
import { request } from "../config";
import { setTimeout } from "timers/promises";
import { isCourseSectionArrayValid } from "./utils/backend-utils";

describe("Generate base schedule with courses to timeslots and professors to courses assigned", () => {
  it("should return an authentication error when not logged in", async () => {
    // Given
    const { client } = request.createApolloClient();
    
    // When (Attempt to generate schedule)
    const response = await client.mutate({
      mutation: gql`
        mutation {
          generateSchedule(
            input: {
              algorithm1: COMPANY3
              algorithm2: COMPANY3
              year: 2022
              fallCourses: [{ subject: "CSC", code: "225", section: 0 }]
              springCourses: []
              summerCourses: []
            }
          ) {
            message
            success
          }
        }
      `,
    });

    // Then (expect authentication error)
    expect(response.data.generateSchedule.message).toEqual("Not logged in");
    expect(response.data.generateSchedule.success).toBeFalsy();
  });

  it("should allow schedule generation when logged in with 1 course (Summer 2022)", async () => {
    // Given
    const { client, setToken } = request.createApolloClient();

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
    expect(loginResponse.data.login.token).toBeDefined();
    expect(loginResponse.data.login.message).toEqual("Success");
    setToken(loginResponse.data.login.token);

    // When (generate schedule)
    const generateScheduleResponse = await client.mutate({
      mutation: gql`
        mutation {
          generateSchedule(
            input: {
              algorithm1: COMPANY3
              algorithm2: COMPANY3
              year: 2022
              fallCourses: []
              springCourses: []
              summerCourses: [{ subject: "CSC", code: "225", section: 0 }]
            }
          ) {
            message
            success
          }
        }
      `,
    });

    // Then (expect schedule is being generated)
    expect(generateScheduleResponse.data.generateSchedule.message).toEqual(
      "Generating Schedule for Year: 2022"
    );
    expect(generateScheduleResponse.data.generateSchedule.success).toBeTruthy();

    // Query for most recent schedule and validate that it looks. Wait to make sure output is generated.
    await setTimeout(10000);
    const getScheduleQueryResponse = await client.query({
      query: gql`
        query {
          schedule(year: 2022) {
            id
            year
            createdAt
            courses(term: SUMMER) {
              CourseID {
                subject
                code
                term
              }
              hoursPerWeek
              professors {
                displayName
              }
              capacity
              startDate
              endDate
              sectionNumber
              meetingTimes {
                day
                startTime
                endTime
              }
            }
          }
        }
      `,
    });

    // Validate that generated schedule is valid.
    expect(typeof getScheduleQueryResponse.data.schedule.id).toBe("string");
    expect(parseInt(getScheduleQueryResponse.data.schedule.id, 10)).toBeGreaterThan(0);
    expect(getScheduleQueryResponse.data.schedule.year).toEqual(2022);
    expect(getScheduleQueryResponse.data.schedule.createdAt).toBeDefined();

    // Validate that course is provided and in expected format
    expect(getScheduleQueryResponse.data.schedule.courses.length).toEqual(1);
    isCourseSectionArrayValid(getScheduleQueryResponse.data.schedule.courses);

    // Check that CSC 225 has 1 section
    const filterCSC225Courses = (element: any, index: any, array: any) => {
      return element.CourseID.code == "225" && element.CourseID.subject == "CSC";
    };
    expect(getScheduleQueryResponse.data.schedule.courses.filter(filterCSC225Courses).length).toEqual(1);
    

  }, 60000); // Set timeout to 60s to allow for genetic algorithm generation

  it("should allow schedule generation when logged in with normal set of courses (Fall 2021, Spring 2022, Summer 2022)", async () => {
    // Given
    const { client, setToken } = request.createApolloClient();

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
    expect(loginResponse.data.login.token).toBeDefined();
    expect(loginResponse.data.login.message).toEqual("Success");
    setToken(loginResponse.data.login.token);

    // When (generate schedule)
    const generateScheduleResponse = await client.mutate({
      mutation: gql`
        mutation {
          generateSchedule(
            input: {
              algorithm1: COMPANY3
              algorithm2: COMPANY3
              year: 2022
              fallCourses: [
                { subject: "CSC", code: "111", section: 2},
                { subject: "CSC", code: "116", section: 1},
                { subject: "CSC", code: "320", section: 1}
              ]
              springCourses: [
                { subject: "SENG", code: "401", section: 1}
              ]
              summerCourses: [
                { subject: "CSC", code: "225", section: 0 },
                { subject: "SENG", code: "275", section: 2},
                { subject: "ECE", code: "250", section: 1}
              ]
            }
          ) {
            message
            success
          }
        }
      `,
    });

    // Then (expect schedule is being generated)
    expect(generateScheduleResponse.data.generateSchedule.message).toEqual(
      "Generating Schedule for Year: 2022"
    );
    expect(generateScheduleResponse.data.generateSchedule.success).toBeTruthy();

    // Query for most recent schedule and validate that it looks correct. Wait to make sure output is generated.
    await setTimeout(10000);
    const getScheduleQueryResponse = await client.query({
      query: gql`
        query {
          schedule(year: 2022) {
            id
            year
            createdAt
            courses(term: SUMMER) {
              CourseID {
                subject
                code
                term
              }
              hoursPerWeek
              professors {
                displayName
              }
              capacity
              startDate
              endDate
              sectionNumber
              meetingTimes {
                day
                startTime
                endTime
              }
            }
          }
        }
      `,
    });

    // Validate that generated schedule is valid.
    expect(typeof getScheduleQueryResponse.data.schedule.id).toBe("string");
    expect(parseInt(getScheduleQueryResponse.data.schedule.id, 10)).toBeGreaterThan(0);
    expect(getScheduleQueryResponse.data.schedule.year).toEqual(2022);
    expect(getScheduleQueryResponse.data.schedule.createdAt).toBeDefined();

    // Validate that course sections are provided in expected format
    expect(getScheduleQueryResponse.data.schedule.courses.length).toEqual(9);
    isCourseSectionArrayValid(getScheduleQueryResponse.data.schedule.courses);

    // Validate expected number of each course returned.
    // Check that CSC 111 in fall has 2 sections
    const filterCSC111Courses = (element: any, index: any, array: any) => {
      return element.CourseID.code == "111" && element.CourseID.subject == "CSC" && element.CourseID.term == "FALL";
    };
    expect(getScheduleQueryResponse.data.schedule.courses.filter(filterCSC111Courses).length).toEqual(2);

    // Check that SENG 275 in summer has 2 sections
    const filterSENG275Courses = (element: any, index: any, array: any) => {
      return element.CourseID.code == "275" && element.CourseID.subject == "SENG" && element.CourseID.term == "SUMMER";
    };
    expect(getScheduleQueryResponse.data.schedule.courses.filter(filterSENG275Courses).length).toEqual(2);
  }, 60000); // Set timeout to 60s to allow for genetic algorithm generation

  it("should allow schedule generation when logged in with normal set of courses, 1 section each (Fall 2021, Spring 2022, Summer 2022)", async () => {
    // Given
    const { client, setToken } = request.createApolloClient();

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
    expect(loginResponse.data.login.token).toBeDefined();
    expect(loginResponse.data.login.message).toEqual("Success");
    setToken(loginResponse.data.login.token);

    // When (generate schedule)
    const generateScheduleResponse = await client.mutate({
      mutation: gql`
        mutation {
          generateSchedule(
            input: {
              algorithm1: COMPANY3
              algorithm2: COMPANY3
              year: 2022
              fallCourses: [
                { subject: "CSC", code: "111", section: 1},
                { subject: "CSC", code: "116", section: 1},
                { subject: "CSC", code: "320", section: 1}
              ]
              springCourses: [
                { subject: "SENG", code: "401", section: 1}
              ]
              summerCourses: [
                { subject: "CSC", code: "225", section: 1},
                { subject: "SENG", code: "275", section: 1},
                { subject: "ECE", code: "250", section: 1}
              ]
            }
          ) {
            message
            success
          }
        }
      `,
    });

    // Then (expect schedule is being generated)
    expect(generateScheduleResponse.data.generateSchedule.message).toEqual(
      "Generating Schedule for Year: 2022"
    );
    expect(generateScheduleResponse.data.generateSchedule.success).toBeTruthy();

    // Query for most recent schedule and validate that it looks correct. Wait to make sure output is generated.
    await setTimeout(10000);
    const getScheduleQueryResponse = await client.query({
      query: gql`
        query {
          schedule(year: 2022) {
            id
            year
            createdAt
            courses(term: SUMMER) {
              CourseID {
                subject
                code
                term
              }
              hoursPerWeek
              professors {
                displayName
              }
              capacity
              startDate
              endDate
              sectionNumber
              meetingTimes {
                day
                startTime
                endTime
              }
            }
          }
        }
      `,
    });

    // Validate that generated schedule is valid.
    expect(typeof getScheduleQueryResponse.data.schedule.id).toBe("string");
    expect(parseInt(getScheduleQueryResponse.data.schedule.id, 10)).toBeGreaterThan(0);
    expect(getScheduleQueryResponse.data.schedule.year).toEqual(2022);
    expect(getScheduleQueryResponse.data.schedule.createdAt).toBeDefined();

    // Validate that course sections are provided in expected format
    expect(getScheduleQueryResponse.data.schedule.courses.length).toEqual(7);
    isCourseSectionArrayValid(getScheduleQueryResponse.data.schedule.courses);
  }, 60000); // Set timeout to 60s to allow for genetic algorithm generation

  it("should allow schedule generation when logged in with 2 courses, 1 course split into 5 sections explicitly (Summer 2022)", async () => {
    // Given
    const { client, setToken } = request.createApolloClient();

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
    expect(loginResponse.data.login.token).toBeDefined();
    expect(loginResponse.data.login.message).toEqual("Success");
    setToken(loginResponse.data.login.token);

    // When (generate schedule)
    const generateScheduleResponse = await client.mutate({
      mutation: gql`
        mutation {
          generateSchedule(
            input: {
              algorithm1: COMPANY3
              algorithm2: COMPANY3
              year: 2022
              fallCourses: []
              springCourses: []
              summerCourses: [
                { subject: "CSC", code: "349A", section: 5 },
                { subject: "ECE", code: "255", section: 1}
              ]
            }
          ) {
            message
            success
          }
        }
      `,
    });

    // Then (expect schedule is being generated)
    expect(generateScheduleResponse.data.generateSchedule.message).toEqual(
      "Generating Schedule for Year: 2022"
    );
    expect(generateScheduleResponse.data.generateSchedule.success).toBeTruthy();

    // Query for most recent schedule and validate that it looks. Wait to make sure output is generated.
    await setTimeout(10000);
    const getScheduleQueryResponse = await client.query({
      query: gql`
        query {
          schedule(year: 2022) {
            id
            year
            createdAt
            courses(term: SUMMER) {
              CourseID {
                subject
                code
                term
              }
              hoursPerWeek
              professors {
                displayName
              }
              capacity
              startDate
              endDate
              sectionNumber
              meetingTimes {
                day
                startTime
                endTime
              }
            }
          }
        }
      `,
    });

    // Validate that generated schedule is valid.
    expect(typeof getScheduleQueryResponse.data.schedule.id).toBe("string");
    expect(parseInt(getScheduleQueryResponse.data.schedule.id, 10)).toBeGreaterThan(0);
    expect(getScheduleQueryResponse.data.schedule.year).toEqual(2022);
    expect(getScheduleQueryResponse.data.schedule.createdAt).toBeDefined();

    // Validate that course sections are provided in expected format
    expect(getScheduleQueryResponse.data.schedule.courses.length).toEqual(6);
    isCourseSectionArrayValid(getScheduleQueryResponse.data.schedule.courses);

    // Validate expected number of each course returned.
    // Check that CSC 349A has 5 sections
    const filterCSC349ACourses = (element: any, index: any, array: any) => {
      return element.CourseID.code == "349A" && element.CourseID.subject == "CSC" && element.CourseID.term == "SUMMER";
    };
    expect(getScheduleQueryResponse.data.schedule.courses.filter(filterCSC349ACourses).length).toEqual(5);

    // Check that ECE 255 has 1 section.
    const filterECE255Courses = (element: any, index: any, array: any) => {
      return element.CourseID.code == "255" && element.CourseID.subject == "ECE" && element.CourseID.term == "SUMMER";
    };
    expect(getScheduleQueryResponse.data.schedule.courses.filter(filterECE255Courses).length).toEqual(1);

  }, 60000); // Set timeout to 60s to allow for genetic algorithm generation


  it("should allow schedule generation when logged in with normal set of course (Summer 2022)", async () => {
    // Given
    const { client, setToken } = request.createApolloClient();

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
    expect(loginResponse.data.login.token).toBeDefined();
    expect(loginResponse.data.login.message).toEqual("Success");
    setToken(loginResponse.data.login.token);

    // When (generate schedule)
    const generateScheduleResponse = await client.mutate({
      mutation: gql`
        mutation {
          generateSchedule(
            input: {
              algorithm1: COMPANY3
              algorithm2: COMPANY3
              year: 2022
              fallCourses: []
              springCourses: []
              summerCourses: [
                { subject: "CSC", code: "225", section: 0 },
                { subject: "SENG", code: "275", section: 2},
                { subject: "ECE", code: "250", section: 1}                
              ]
            }
          ) {
            message
            success
          }
        }
      `,
    });

    // Then (expect schedule is being generated)
    expect(generateScheduleResponse.data.generateSchedule.message).toEqual(
      "Generating Schedule for Year: 2022"
    );
    expect(generateScheduleResponse.data.generateSchedule.success).toBeTruthy();

    // Query for most recent schedule and validate that it looks. Wait to make sure output is generated.
    await setTimeout(10000);
    const getScheduleQueryResponse = await client.query({
      query: gql`
        query {
          schedule(year: 2022) {
            id
            year
            createdAt
            courses(term: SUMMER) {
              CourseID {
                subject
                code
                term
              }
              hoursPerWeek
              professors {
                displayName
              }
              capacity
              startDate
              endDate
              sectionNumber
              meetingTimes {
                day
                startTime
                endTime
              }
            }
          }
        }
      `,
    });

    // Validate that generated schedule is valid.
    expect(typeof getScheduleQueryResponse.data.schedule.id).toBe("string");
    expect(parseInt(getScheduleQueryResponse.data.schedule.id, 10)).toBeGreaterThan(0);
    expect(getScheduleQueryResponse.data.schedule.year).toEqual(2022);
    expect(getScheduleQueryResponse.data.schedule.createdAt).toBeDefined();

    // Validate that course sections are provided in expected format
    expect(getScheduleQueryResponse.data.schedule.courses.length).toEqual(4);
    isCourseSectionArrayValid(getScheduleQueryResponse.data.schedule.courses);

    // Validate expected number of each course returned.
    // Check that CSC 225 has 1 section
    const filterCSC225Courses = (element: any, index: any, array: any) => {
      return element.CourseID.code == "225" && element.CourseID.subject == "CSC";
    };
    expect(getScheduleQueryResponse.data.schedule.courses.filter(filterCSC225Courses).length).toEqual(1);

    // Check that SENG 275 has 2 sections
    const filterSENG275Courses = (element: any, index: any, array: any) => {
      return element.CourseID.code == "275" && element.CourseID.subject == "SENG";
    };
    expect(getScheduleQueryResponse.data.schedule.courses.filter(filterSENG275Courses).length).toEqual(2);


    // Check that ECE 250 has 1 section
    const filterECE250Courses = (element: any, index: any, array: any) => {
      return element.CourseID.code == "250" && element.CourseID.subject == "ECE";
    };
    expect(getScheduleQueryResponse.data.schedule.courses.filter(filterECE250Courses).length).toEqual(1);
    

  }, 60000); // Set timeout to 60s to allow for genetic algorithm generation

  it("should allow schedule generation when logged in with 2 courses, 1 of which is not to be scheduled by department (Summer 2022)", async () => {
    // Given
    const { client, setToken } = request.createApolloClient();

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
    expect(loginResponse.data.login.token).toBeDefined();
    expect(loginResponse.data.login.message).toEqual("Success");
    setToken(loginResponse.data.login.token);

    // When (generate schedule)
    const generateScheduleResponse = await client.mutate({
      mutation: gql`
        mutation {
          generateSchedule(
            input: {
              algorithm1: COMPANY3
              algorithm2: COMPANY3
              year: 2022
              fallCourses: []
              springCourses: []
              summerCourses: [
                { subject: "SENG", code: "321", section: 1 },
                { subject: "ECON", code: "180", section: 1}             
              ]
            }
          ) {
            message
            success
          }
        }
      `,
    });

    // Then (expect schedule is being generated)
    expect(generateScheduleResponse.data.generateSchedule.message).toEqual(
      "Generating Schedule for Year: 2022"
    );
    expect(generateScheduleResponse.data.generateSchedule.success).toBeTruthy();

    // Query for most recent schedule and validate that it looks. Wait to make sure output is generated.
    await setTimeout(10000);
    const getScheduleQueryResponse = await client.query({
      query: gql`
        query {
          schedule(year: 2022) {
            id
            year
            createdAt
            courses(term: SUMMER) {
              CourseID {
                subject
                code
                term
              }
              hoursPerWeek
              professors {
                displayName
              }
              capacity
              startDate
              endDate
              sectionNumber
              meetingTimes {
                day
                startTime
                endTime
              }
            }
          }
        }
      `,
    });

    // Validate that generated schedule is valid.
    expect(typeof getScheduleQueryResponse.data.schedule.id).toBe("string");
    expect(parseInt(getScheduleQueryResponse.data.schedule.id, 10)).toBeGreaterThan(0);
    expect(getScheduleQueryResponse.data.schedule.year).toEqual(2022);
    expect(getScheduleQueryResponse.data.schedule.createdAt).toBeDefined();

    // Validate that course sections are provided in expected format
    expect(getScheduleQueryResponse.data.schedule.courses.length).toEqual(2);
    isCourseSectionArrayValid(getScheduleQueryResponse.data.schedule.courses);

    // Validate expected number of each course returned.
    // Check that ECON 180 has capacity of 0
    const filterECON180Course = (element: any, index: any, array: any) => {
      return element.CourseID.code == "180" && element.CourseID.subject == "ECON";
    };
    expect(getScheduleQueryResponse.data.schedule.courses.filter(filterECON180Course)[0].capacity).toEqual(0);

  }, 60000); // Set timeout to 60s to allow for genetic algorithm generation

  it("should perform expected behavior when not scheduling any courses (2022)", async () => {
    // Given
    const { client, setToken } = request.createApolloClient();

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
    expect(loginResponse.data.login.token).toBeDefined();
    expect(loginResponse.data.login.message).toEqual("Success");
    setToken(loginResponse.data.login.token);

    // When (generate schedule)
    const generateScheduleResponse = await client.mutate({
      mutation: gql`
        mutation {
          generateSchedule(
            input: {
              algorithm1: COMPANY3
              algorithm2: COMPANY3
              year: 2022
              fallCourses: []
              springCourses: []
              summerCourses: []
            }
          ) {
            message
            success
          }
        }
      `,
    });

    // Then (expect schedule is being generated)
    expect(generateScheduleResponse.data.generateSchedule.message).toEqual(
      "No courses selected"
    );
    expect(generateScheduleResponse.data.generateSchedule.success).toBeFalsy();
  }, 60000); // Set timeout to 60s to allow for genetic algorithm generation

  it("should split course in 5 sections when generating a schedule (Summer 2022)", async () => {
    // Given
    const { client, setToken } = request.createApolloClient();

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
    expect(loginResponse.data.login.token).toBeDefined();
    expect(loginResponse.data.login.message).toEqual("Success");
    setToken(loginResponse.data.login.token);

    // When (generate schedule)
    const generateScheduleResponse = await client.mutate({
      mutation: gql`
        mutation {
          generateSchedule(
            input: {
              algorithm1: COMPANY3
              algorithm2: COMPANY3
              year: 2022
              fallCourses: [
                { subject: "SENG", code: "350", section: 5}
              ]
              springCourses: []
              summerCourses: []
            }
          ) {
            message
            success
          }
        }
      `,
    });

    // Then (expect schedule is being generated)
    expect(generateScheduleResponse.data.generateSchedule.message).toEqual(
      "Generating Schedule for Year: 2022"
    );
    expect(generateScheduleResponse.data.generateSchedule.success).toBeTruthy();

    // Query for most recent schedule and validate that it looks. Wait to make sure output is generated.
    await setTimeout(10000);
    const getScheduleQueryResponse = await client.query({
      query: gql`
        query {
          schedule(year: 2022) {
            id
            year
            createdAt
            courses(term: SUMMER) {
              CourseID {
                subject
                code
                term
              }
              hoursPerWeek
              professors {
                displayName
              }
              capacity
              startDate
              endDate
              sectionNumber
              meetingTimes {
                day
                startTime
                endTime
              }
            }
          }
        }
      `,
    });

    // Validate that generated schedule is valid.
    expect(typeof getScheduleQueryResponse.data.schedule.id).toBe("string");
    expect(parseInt(getScheduleQueryResponse.data.schedule.id, 10)).toBeGreaterThan(0);
    expect(getScheduleQueryResponse.data.schedule.year).toEqual(2022);
    expect(getScheduleQueryResponse.data.schedule.createdAt).toBeDefined();

    // Validate that course sections are provided in expected format
    expect(getScheduleQueryResponse.data.schedule.courses.length).toEqual(5);
    isCourseSectionArrayValid(getScheduleQueryResponse.data.schedule.courses);

    // Validate expected number of each course returned.
    // Check that SENG 350 has 5 sections
    const filterSENG350Courses = (element: any, index: any, array: any) => {
      return element.CourseID.code == "350" && element.CourseID.subject == "SENG";
    };
    expect(getScheduleQueryResponse.data.schedule.courses.filter(filterSENG350Courses).length).toEqual(5);

  }, 60000); // Set timeout to 60s to allow for genetic algorithm generation
});
