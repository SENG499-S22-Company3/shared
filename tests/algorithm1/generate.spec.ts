import { request } from "../../config";

describe("schedule generation", () => {
    describe("when an empty course list is passed", () => {
      it("a schedule is not generated", async () => {
        const response = await request.algorithm1
          .post("/schedule")
          .send([
            {
                hardScheduled: {
                    fallCourses: [],
                    springCourses: [],
                    summerCourses: []
                },
                coursesToSchedule: {
                    fallCourses: [],
                    springCourses: [],
                    summerCourses: []
                },
                professors: []
            },
          ]);
          expect(response.statusCode).toEqual(400);
      });
    });
  });