/**
 * This file tests Algorithm 1's API directly, validating the interoperability betwen
 * algorithm 1 between company 3 and company 4.
 */
import {
    ALGORITHM1_URL
} from "../config";

import algorithm1_input_with_hardcoded_courses_and_professors from './data/algorithm1-input-with-hardcoded-courses-and-professors.json';
import algorithm1_input_with_only_hardcoded_courses_and_professors_no_courses_to_schedule from './data/algorithm1-input-with-only-hardcoded-courses-and-professors-no-courses-to-schedule.json'
import algorithm1_input_with_courses_and_professors_no_hardcoded from './data/algorithm1-input-with-courses-and-professors-no-hardcoded.json';
import algorithm1_input_with_overflow_courses from './data/algorithm1-input-with-overflow-courses.json';
import algorithm1_input_with_courses_but_no_professors_or_hardcoded from './data/algorithm1-input-with-courses-but-no-professors-or-hardcoded.json';
import algorithm1_input_with_2_courses_per_semester_and_professors_preferences from './data/algorithm1-input-with-2-courses-per-semester-and-professors-preferences.json';
import algorithm1_input_with_split_cases_no_professors_no_hardcoded from './data/algorithm1-input-with-split-cases-no-professors-no-hardcoded.json';
import algorithm1_input_valid_check_schedule_tbd from './data/algorithm1-input-valid-check-schedule-tbd.json';
import algorithm1_input_invalid_check_schedule_no_preferences from "./data/algorithm1-input-invalid-check-schedule-no-preferences.json"
import algorithm1_input_invalid_check_schedule_max_term_violation from "./data/algorithm1-input-invalid-check-schedule-max-term-violation.json"
import algorithm1_input_invalid_check_schedule_double_assigned from "./data/algorithm1-input-invalid-check-schedule-double-assigned.json"

import { areCoursesEqual, areProfessorAssignmentsValid } from './utils/algorithm1-utils';
require('isomorphic-fetch'); 

describe("Generate schedule route generates valid schedules", () => {
    it("should generate a valid schedule with hard coded schedules, courses to schedule, and professor preferences", async () => {
        // Given
        const input = algorithm1_input_with_hardcoded_courses_and_professors;

        // When (call algorithm 1)
        const response = await fetch(ALGORITHM1_URL + "/schedule", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(input)
        });

        // Then
        const responseJSON = await response.json();

        // Expect the total number of courses to be the sum of the number of hardcoded schedules + 
        // courses to schedule + the extra sections split into smaller sections (in this test case, CSC 111 and CSC 115)

        // Expect that hardcoded schedules are still scheduled at the same time.
        const expectedSchedulesCoursesLength = input.coursesToSchedule.fallCourses.length + input.hardScheduled.fallCourses.length + 3;
        expect(responseJSON.fallCourses.length).toEqual(expectedSchedulesCoursesLength);

        // Check that CSC 111 has 3 sections
        const filterCSC111Courses = (element: any, index: any, array: any) => {
            return element.courseNumber == "111" && element.subject == "CSC";
        };
        expect(responseJSON.fallCourses.filter(filterCSC111Courses).length).toEqual(3);

        // Check that CSC 115 has 2 sections
        const filterCSC115Courses = (element: any, index: any, array: any) => {
            return element.courseNumber == "115" && element.subject == "CSC";
        };
        expect(responseJSON.fallCourses.filter(filterCSC115Courses).length).toEqual(2);


        // Check that all hardcoded courses are present.
        // Loop through courses, and if it is a hardcoded course, then add it to list.
        let actualHardcodedFallCourses = [];
        for (const course of responseJSON.fallCourses) {
            for (const hardcodedCourse of input.hardScheduled.fallCourses) {
                if ((course.courseNumber == hardcodedCourse.courseNumber) &&
                    (course.subject == hardcodedCourse.subject) &&
                    (course.sequenceNumber == hardcodedCourse.sequenceNumber)) {
                        actualHardcodedFallCourses.push(course);
                } 
            }
        }

        let actualHardcodedSpringCourses = [];
        for (const course of responseJSON.springCourses) {
            for (const hardcodedCourse of input.hardScheduled.springCourses) {
                if ((course.courseNumber == hardcodedCourse.courseNumber) &&
                    (course.subject == hardcodedCourse.subject) &&
                    (course.sequenceNumber == hardcodedCourse.sequenceNumber)) {
                        actualHardcodedSpringCourses.push(course);
                } 
            }
        }

        let actualHardcodedSummerCourses = [];
        for (const course of responseJSON.summerCourses) {
            for (const hardcodedCourse of input.hardScheduled.summerCourses) {
                if ((course.courseNumber == hardcodedCourse.courseNumber) &&
                    (course.subject == hardcodedCourse.subject) &&
                    (course.sequenceNumber == hardcodedCourse.sequenceNumber)) {
                        actualHardcodedSummerCourses.push(course);
                } 
            }
        }

        // Validate that hard coded courses have exactly the same assignment as the input provided for each semester.
        areCoursesEqual(input.hardScheduled.fallCourses, actualHardcodedFallCourses, true, true);
        areCoursesEqual(input.hardScheduled.springCourses, actualHardcodedSpringCourses, true, true);
        areCoursesEqual(input.hardScheduled.summerCourses, actualHardcodedSummerCourses, true, true);

        // Remove hardcoded courses from response to only leave original courses to schedule.
        for (const course of actualHardcodedFallCourses) {
            const index = responseJSON.fallCourses.indexOf(course);
            if (index !== -1) {
                responseJSON.fallCourses.splice(index, 1);
            }
        }

        for (const course of actualHardcodedSpringCourses) {
            const index = responseJSON.springCourses.indexOf(course);
            if (index !== -1) {
                responseJSON.springCourses.splice(index, 1);
            }
        }

        for (const course of actualHardcodedSummerCourses) {
            const index = responseJSON.summerCourses.indexOf(course);
            if (index !== -1) {
                responseJSON.summerCourses.splice(index, 1);
            }
        }

        // Validate that each course (not hardcoded) in the semester is present with correct details (without comparing assignments or professors)
        // TODO: Validate given that CSC 111 & CSC 115 have multiple sections
        //areCoursesEqual(input.coursesToSchedule.fallCourses, responseJSON.fallCourses, false, false);
        //areCoursesEqual(input.coursesToSchedule.springCourses, responseJSON.springCourses,false, false);
        //areCoursesEqual(input.coursesToSchedule.summerCourses, responseJSON.summerCourses, false, false);

        // Check that professors assigned to courses in each semester are all professors provided as input.
        areProfessorAssignmentsValid(input.professors, responseJSON.fallCourses);
        areProfessorAssignmentsValid(input.professors, responseJSON.springCourses);
        areProfessorAssignmentsValid(input.professors, responseJSON.summerCourses);        
    }, 60000); // Timeout of 1 minute to allow genetic algorithm to process

    it("should return a valid schedule with only hard coded schedules and professor preferences, no courses to schedule", async () => {
      // Given
      const input = algorithm1_input_with_only_hardcoded_courses_and_professors_no_courses_to_schedule;

      // When (call algorithm 1)
      const response = await fetch(ALGORITHM1_URL + "/schedule", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(input)
      });

      // Then
      const responseJSON = await response.json();

      // Validate that hard coded courses have exactly the same assignment as the input provided for each semester.
      areCoursesEqual(input.hardScheduled.fallCourses, responseJSON.fallCourses, true, true);
      expect(responseJSON.springCourses).toBeNull();
      expect(responseJSON.summerCourses).toBeNull();
    }, 60000); // Timeout of 1 minute to allow genetic algorithm to process

    it("should return a valid schedule with courses to schedule, professor preferences, but not hard scheduled courses", async () => {
        // Given
        const input = algorithm1_input_with_courses_and_professors_no_hardcoded;

        // When (call algorithm 1)
        const response = await fetch(ALGORITHM1_URL + "/schedule", {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(input)            
        });

        // Then
        const responseJSON = await response.json();

        // Validate that schedule generated has the same number of courses as test input. 
        // This test case forces all courses to have 1 section.
        expect(responseJSON.fallCourses.length).toEqual(input.coursesToSchedule.fallCourses.length);
        expect(responseJSON.springCourses.length).toEqual(input.coursesToSchedule.springCourses.length);
        expect(responseJSON.summerCourses.length).toEqual(input.coursesToSchedule.summerCourses.length);

        // Validate that each course in the semester is present with correct details (without comparing assignments or professors)
        areCoursesEqual(input.coursesToSchedule.fallCourses, responseJSON.fallCourses, false, false);
        areCoursesEqual(input.coursesToSchedule.springCourses, responseJSON.springCourses,false, false);
        areCoursesEqual(input.coursesToSchedule.summerCourses, responseJSON.summerCourses, false, false);

        // Check that professors assigned to courses in each semester are all professors provided as input.
        areProfessorAssignmentsValid(input.professors, responseJSON.fallCourses);
        areProfessorAssignmentsValid(input.professors, responseJSON.springCourses);
        areProfessorAssignmentsValid(input.professors, responseJSON.summerCourses);
    }, 60000); // Timeout of 1 minute to allow genetic algorithm to process

    it("should return as expected when overflow schedule", async () => {
        // Given
        const input = algorithm1_input_with_overflow_courses;

        // When (call algorithm 1)
        const response = await fetch(ALGORITHM1_URL + "/schedule", {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(input)            
        });

        // Then
        const responseText = await response.text();
        expect(responseText).toEqual('error: Ran out of slots to assign courses in stream 2B in the Fall term');
    }, 60000); // Timeout of 1 minute to allow genetic algorithm to process

    it("should return courses with professors TBD when no professors provided", async () => {
        // Given
        const input = algorithm1_input_with_courses_but_no_professors_or_hardcoded;

        // When (call algorithm 1)
        const response = await fetch(ALGORITHM1_URL + "/schedule", {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(input)            
        });

        // Then
        const responseJSON = await response.json();

        // Validate that each course in the semester is present with correct details (without comparing assignments or professors)
        areCoursesEqual(input.coursesToSchedule.fallCourses, responseJSON.fallCourses, false, false);
        areCoursesEqual(input.coursesToSchedule.springCourses, responseJSON.springCourses,false, false);
        areCoursesEqual(input.coursesToSchedule.summerCourses, responseJSON.summerCourses, false, false);

        // Assert that each scheduled courses has professor set as TBD
        for (const course of responseJSON.fallCourses.concat(responseJSON.springCourses).concat(responseJSON.summerCourses))
        {
            expect(course.prof.displayName).toEqual("TBD");
        }
    }, 60000); // Timeout of 1 minute to allow genetic algorithm to process

    it("should generate a valid schedule with 2 courses per semester provided and professor preferences, no preference for SENG 265 in SPRING", async () => {
        // Given
        const input = algorithm1_input_with_2_courses_per_semester_and_professors_preferences;

        // When (call algorithm 1)
        const response = await fetch(ALGORITHM1_URL + "/schedule", {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(input)            
        });

        // Then
        const responseJSON = await response.json();

        // Validate that each course in the semester is present with correct details (without comparing assignments or professors)
        areCoursesEqual(input.coursesToSchedule.fallCourses, responseJSON.fallCourses, false, false);
        areCoursesEqual(input.coursesToSchedule.springCourses, responseJSON.springCourses, false, false);
        expect(responseJSON.summerCourses).toBeNull();

        // Check that professors assigned to courses in each semester are all professors provided as input.
        areProfessorAssignmentsValid(input.professors, responseJSON.fallCourses);
        areProfessorAssignmentsValid(input.professors, responseJSON.springCourses);
    }, 60000); // Timeout of 1 minute to allow genetic algorithm to process

    it("should generate 1 course section in the fall, 2 sections in the spring, and 3 in the summer. All with profs as TBD.", async () => {
        // Given
        const input = algorithm1_input_with_split_cases_no_professors_no_hardcoded;

        // When (call algorithm 1)
        const response = await fetch(ALGORITHM1_URL + "/schedule", {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(input)            
        });

        // Then
        const responseJSON = await response.json();

        expect(responseJSON.fallCourses.length).toEqual(1);
        expect(responseJSON.springCourses.length).toEqual(2);
        expect(responseJSON.summerCourses.length).toEqual(3);

        for (const course of responseJSON.fallCourses.concat(responseJSON.springCourses).concat(responseJSON.summerCourses))
        {
            expect(course.prof.displayName).toEqual("TBD");
        }

    }, 60000); // Timeout of 1 minute to allow genetic algorithm to process

    it("should generate a valid schedule check. Schedule contains 1 course a term with profs as TBD.", async () => {
        // Given
        const input = algorithm1_input_valid_check_schedule_tbd;

        // When (call algorithm 1)
        const response = await fetch(ALGORITHM1_URL + "/check_schedule", {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(input)            
        });

        // Then
        expect(response.text).toEqual("Schedule given is valid");

    }, 60000); // Timeout of 1 minute to allow genetic algorithm to process

    it("should generate a invalid schedule check. Professor does not have the preferences for this course.", async () => {
        // Given
        const input = algorithm1_input_invalid_check_schedule_no_preferences;

        // When (call algorithm 1)
        const response = await fetch(ALGORITHM1_URL + "/check_schedule", {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(input)            
        });

        // Then
        expect(response.text).toEqual("Error: Sean Chester cannot teach Fall SENG499 since they have no (0) preference.\nSchedule given has some violations that should be resolved");

    }, 60000); // Timeout of 1 minute to allow genetic algorithm to process

    it("should generate a invalid schedule check. Professor teaching more than perferred amount of courses to teach a term.", async () => {
        // Given
        const input = algorithm1_input_invalid_check_schedule_max_term_violation;

        // When (call algorithm 1)
        const response = await fetch(ALGORITHM1_URL + "/check_schedule", {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(input)            
        });

        // Then
        expect(response.text).toEqual("Error: Sean Chester assigned 1 Fall courses which is more than their prefered maximum 0 courses to teach this term.\nSchedule given has some violations that should be resolved");

    }, 60000); // Timeout of 1 minute to allow genetic algorithm to process

    it("should generate a invalid schedule check. Professor teaching two courses at the same time.", async () => {
        // Given
        const input = algorithm1_input_invalid_check_schedule_double_assigned;

        // When (call algorithm 1)
        const response = await fetch(ALGORITHM1_URL + "/check_schedule", {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(input)            
        });

        // Then
        expect(response.text).toEqual("Error: Sean Chester teaching another Fall course at TWF1030. Prof cannot two classes at the same time.\nerror: SENG 499 is scheduled at same time as another required course SENG499 in Fall term,   Schedule given has some violations that should be resolved");

    }, 60000); // Timeout of 1 minute to allow genetic algorithm to process

});