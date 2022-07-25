import { gql } from "@apollo/client/core";
import { login } from "../config";

jest.setTimeout(10000);

describe("edit schedule", () => {
  describe("changing a schedule", () => {
    it("updates the schedule", async () => {
      const client = await login("ADMIN");

      const scheduleInput = {
        algorithm1: "COMPANY3",
        algorithm2: "COMPANY3",
        year: 2020,
        summerCourses: [
          { subject: "CSC", code: "225", section: 0 },
          { subject: "SENG", code: "275", section: 2 },
          { subject: "ECE", code: "250", section: 1 },
        ],
      };

      // create schedule
      const originalScheduleResponse = await client.mutate({
        mutation: gql`
          mutation ($input: GenerateScheduleInput!) {
            generateSchedule(input: $input) {
              success
              message
            }
          }
        `,
        variables: { input: scheduleInput },
      });

      expect(
        originalScheduleResponse.data.generateSchedule.success
      ).toBeTruthy();
      const input = {
        skipValidation: true,
        validation: "COMPANY3",
        courses: [
          {
            id: {
              subject: "SENG",
              code: "275",
              term: "SUMMER",
              title: "SENG275",
            },
            startDate: "2023-05-01T17:00:00.000Z",
            endDate: "2023-08-01T18:20:00.000Z",
            capacity: 0,
            meetingTimes: [
              {
                day: "MONDAY",
                endTime: "2022-07-21T18:20:00.000Z",
                startTime: "2022-07-21T17:00:00.000Z",
              },
              {
                day: "THURSDAY",
                endTime: "2022-07-21T18:20:00.000Z",
                startTime: "2022-07-21T17:00:00.000Z",
              },
            ],
            hoursPerWeek: 3,
            professors: ["TBD"],
            sectionNumber: "A01",
          },
          {
            id: {
              subject: "CSC",
              code: "225",
              term: "SUMMER",
              title: "Algorithms and Data Structures I",
            },
            startDate: "2023-05-01T15:30:00.000Z",
            endDate: "2023-08-01T16:50:00.000Z",
            capacity: 0,
            meetingTimes: [
              {
                day: "MONDAY",
                endTime: "2022-07-21T16:50:00.000Z",
                startTime: "2022-07-21T15:30:00.000Z",
              },
              {
                day: "THURSDAY",
                endTime: "2022-07-21T16:50:00.000Z",
                startTime: "2022-07-21T15:30:00.000Z",
              },
            ],
            hoursPerWeek: 3,
            professors: ["TBD"],
            sectionNumber: "A01",
          },
          {
            id: {
              subject: "ECE",
              code: "250",
              term: "SUMMER",
              title: "Linear Circuits I",
            },
            startDate: "2023-05-01T17:00:00.000Z",
            endDate: "2023-08-01T18:20:00.000Z",
            capacity: 0,
            meetingTimes: [
              {
                day: "MONDAY",
                endTime: "2022-07-21T18:20:00.000Z",
                startTime: "2022-07-21T17:00:00.000Z",
              },
              {
                day: "THURSDAY",
                endTime: "2022-07-21T18:20:00.000Z",
                startTime: "2022-07-21T17:00:00.000Z",
              },
            ],
            hoursPerWeek: 3,
            professors: ["NikitasDimopoulos"],
            sectionNumber: "A01",
          },
          {
            id: {
              subject: "SENG",
              code: "275",
              term: "SUMMER",
              title: "SENG275",
            },
            startDate: "2023-05-01T15:30:00.000Z",
            endDate: "2023-08-01T16:20:00.000Z",
            capacity: 0,
            meetingTimes: [
              {
                day: "TUESDAY",
                endTime: "2022-07-21T16:20:00.000Z",
                startTime: "2022-07-21T15:30:00.000Z",
              },
              {
                day: "WEDNESDAY",
                endTime: "2022-07-21T16:20:00.000Z",
                startTime: "2022-07-21T15:30:00.000Z",
              },
              {
                day: "FRIDAY",
                endTime: "2022-07-21T16:20:00.000Z",
                startTime: "2022-07-21T15:30:00.000Z",
              },
            ],
            hoursPerWeek: 3,
            professors: ["TBD"],
            sectionNumber: "A02",
          },
        ],
      };

      const editSchedule = await client.mutate({
        mutation: gql`
          mutation ($input: UpdateScheduleInput!) {
            updateSchedule(input: $input) {
              message
              success
            }
          }
        `,
        variables: { input },
      });
      console.log(editSchedule.data);
      expect(editSchedule.data.updateSchedule.success).toBeTruthy();

      const editedSchedule = await client.query({
        query: gql`
          query ($year: Int) {
            schedule(year: $year) {
              createdAt
              id
              year
              courses {
                CourseID {
                  subject
                  code
                  term
                  title
                }
                startDate
                endDate
                capacity
                meetingTimes {
                  day
                  endTime
                  startTime
                }
                hoursPerWeek
                professors {
                  username
                }
                sectionNumber
              }
            }
          }
        `,
        variables: {
          year: 2020,
        },
      });
    });
  });

  describe("removing courses from a schedule", () => {
    it("removes all the courses", async () => {
      const client = await login("ADMIN");

      const scheduleInput = {
        algorithm1: "COMPANY3",
        algorithm2: "COMPANY3",
        year: 2020,
        summerCourses: [
          { subject: "CSC", code: "225", section: 0 },
          { subject: "SENG", code: "275", section: 2 },
          { subject: "ECE", code: "250", section: 1 },
        ],
      };

      // create schedule
      const originalScheduleResponse = await client.mutate({
        mutation: gql`
          mutation ($input: GenerateScheduleInput!) {
            generateSchedule(input: $input) {
              success
              message
            }
          }
        `,
        variables: { input: scheduleInput },
      });

      expect(
        originalScheduleResponse.data.generateSchedule.success
      ).toBeTruthy();
      const input = {
        skipValidation: true,
        validation: "COMPANY3",
        courses: [],
      };

      const editSchedule = await client.mutate({
        mutation: gql`
          mutation ($input: UpdateScheduleInput!) {
            updateSchedule(input: $input) {
              message
              success
            }
          }
        `,
        variables: { input },
      });
      console.log(editSchedule.data);
      expect(editSchedule.data.updateSchedule.success).toBeTruthy();

      const editedSchedule = await client.query({
        query: gql`
          query ($year: Int) {
            schedule(year: $year) {
              createdAt
              id
              year
              courses {
                CourseID {
                  subject
                  code
                  term
                  title
                }
                startDate
                endDate
                capacity
                meetingTimes {
                  day
                  endTime
                  startTime
                }
                hoursPerWeek
                professors {
                  username
                }
                sectionNumber
              }
            }
          }
        `,
        variables: {
          year: 2020,
        },
      });
    });
  });

  describe("adding courses to a schedule", () => {
    it("adds courses to the schedules", async () => {
      const client = await login("ADMIN");

      const scheduleInput = {
        algorithm1: "COMPANY3",
        algorithm2: "COMPANY3",
        year: 2020,
        summerCourses: [{ subject: "CSC", code: "225", section: 0 }],
      };

      // create schedule
      const originalScheduleResponse = await client.mutate({
        mutation: gql`
          mutation ($input: GenerateScheduleInput!) {
            generateSchedule(input: $input) {
              success
              message
            }
          }
        `,
        variables: { input: scheduleInput },
      });

      expect(
        originalScheduleResponse.data.generateSchedule.success
      ).toBeTruthy();
      const input = {
        skipValidation: true,
        validation: "COMPANY3",
        courses: [
          {
            id: {
              subject: "SENG",
              code: "275",
              term: "SUMMER",
              title: "SENG275",
            },
            startDate: "2023-05-01T17:00:00.000Z",
            endDate: "2023-08-01T18:20:00.000Z",
            capacity: 0,
            meetingTimes: [
              {
                day: "MONDAY",
                endTime: "2022-07-21T18:20:00.000Z",
                startTime: "2022-07-21T17:00:00.000Z",
              },
              {
                day: "THURSDAY",
                endTime: "2022-07-21T18:20:00.000Z",
                startTime: "2022-07-21T17:00:00.000Z",
              },
            ],
            hoursPerWeek: 3,
            professors: ["TBD"],
            sectionNumber: "A01",
          },
          {
            id: {
              subject: "CSC",
              code: "225",
              term: "SUMMER",
              title: "Algorithms and Data Structures I",
            },
            startDate: "2023-05-01T15:30:00.000Z",
            endDate: "2023-08-01T16:50:00.000Z",
            capacity: 0,
            meetingTimes: [
              {
                day: "MONDAY",
                endTime: "2022-07-21T16:50:00.000Z",
                startTime: "2022-07-21T15:30:00.000Z",
              },
              {
                day: "THURSDAY",
                endTime: "2022-07-21T16:50:00.000Z",
                startTime: "2022-07-21T15:30:00.000Z",
              },
            ],
            hoursPerWeek: 3,
            professors: ["TBD"],
            sectionNumber: "A01",
          },
          {
            id: {
              subject: "ECE",
              code: "250",
              term: "SUMMER",
              title: "Linear Circuits I",
            },
            startDate: "2023-05-01T17:00:00.000Z",
            endDate: "2023-08-01T18:20:00.000Z",
            capacity: 0,
            meetingTimes: [
              {
                day: "MONDAY",
                endTime: "2022-07-21T18:20:00.000Z",
                startTime: "2022-07-21T17:00:00.000Z",
              },
              {
                day: "THURSDAY",
                endTime: "2022-07-21T18:20:00.000Z",
                startTime: "2022-07-21T17:00:00.000Z",
              },
            ],
            hoursPerWeek: 3,
            professors: ["NikitasDimopoulos"],
            sectionNumber: "A01",
          },
          {
            id: {
              subject: "SENG",
              code: "275",
              term: "SUMMER",
              title: "SENG275",
            },
            startDate: "2023-05-01T15:30:00.000Z",
            endDate: "2023-08-01T16:20:00.000Z",
            capacity: 0,
            meetingTimes: [
              {
                day: "TUESDAY",
                endTime: "2022-07-21T16:20:00.000Z",
                startTime: "2022-07-21T15:30:00.000Z",
              },
              {
                day: "WEDNESDAY",
                endTime: "2022-07-21T16:20:00.000Z",
                startTime: "2022-07-21T15:30:00.000Z",
              },
              {
                day: "FRIDAY",
                endTime: "2022-07-21T16:20:00.000Z",
                startTime: "2022-07-21T15:30:00.000Z",
              },
            ],
            hoursPerWeek: 3,
            professors: ["TBD"],
            sectionNumber: "A02",
          },
        ],
      };

      const editSchedule = await client.mutate({
        mutation: gql`
          mutation ($input: UpdateScheduleInput!) {
            updateSchedule(input: $input) {
              message
              success
            }
          }
        `,
        variables: { input },
      });
      console.log(editSchedule.data);
      expect(editSchedule.data.updateSchedule.success).toBeTruthy();

      const editedSchedule = await client.query({
        query: gql`
          query ($year: Int) {
            schedule(year: $year) {
              createdAt
              id
              year
              courses {
                CourseID {
                  subject
                  code
                  term
                  title
                }
                startDate
                endDate
                capacity
                meetingTimes {
                  day
                  endTime
                  startTime
                }
                hoursPerWeek
                professors {
                  username
                }
                sectionNumber
              }
            }
          }
        `,
        variables: {
          year: 2020,
        },
      });
    });
  });
});
