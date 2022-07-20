/**
 * This file tests Algorithm 1's API directly with company 4 to make sure plug-and-play works.
 */
import algorithm1_company4_input_course_and_preferences_fall from './data/algorithm1-company4-input-course-and-preferences-fall.json';
import algorithm1_company4_input_course_and_preferences_full_year from './data/algorithm1-company4-input-course-and-preferences-full-year.json';

import { areCoursesEqual, areProfessorAssignmentsValid } from './utils/algorithm1-utils';
require('isomorphic-fetch'); 

const ALGORITHM1_URL = "https://seng499company4algorithm1.herokuapp.com";

describe("Company 4 - Generate schedule route generates valid schedules", () => {
    it("happy path: should generate a valid schedule with courses to schedule, and professor preferences (fall semester)", async () => {
        // Given
        const input = algorithm1_company4_input_course_and_preferences_fall;

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

        // Expect the total number of courses to be the sum of the original input courses 
        // + the extra sections split into smaller sections (in this test case, CSC 111 and CSC 115)

        // Expect that hardcoded schedules are still scheduled at the same time.
        const expectedSchedulesCoursesLength = input.coursesToSchedule.fallCourses.length + input.hardScheduled.fallCourses.length + 3;
        expect(responseJSON.fallCourses.length).toEqual(expectedSchedulesCoursesLength);

        // Check that CSC 111 has 2 sections
        const filterCSC111Courses = (element: any, index: any, array: any) => {
            return element.courseNumber == "111" && element.subject == "CSC";
        };
        expect(responseJSON.fallCourses.filter(filterCSC111Courses).length).toEqual(2);

        // Check that CSC 116 has 3 sections
        const filterCSC115Courses = (element: any, index: any, array: any) => {
            return element.courseNumber == "116" && element.subject == "CSC";
        };
        expect(responseJSON.fallCourses.filter(filterCSC115Courses).length).toEqual(3);

    }, 60000); // Timeout of 1 minute to allow algorithm to process

    it.skip("happy path: should generate a valid schedule with courses to schedule, and professor preferences for all 3 semesters", async () => {
        // Given
        const input = algorithm1_company4_input_course_and_preferences_full_year;

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
        
        return;

        // Expect the total number of courses to be the sum of the original input courses 
        // + the extra sections split into smaller sections (in this test case, CSC 111 and CSC 115)

        // Expect that hardcoded schedules are still scheduled at the same time.
        const expectedSchedulesCoursesLength = input.coursesToSchedule.fallCourses.length + input.hardScheduled.fallCourses.length + 3;
        expect(responseJSON.fallCourses.length).toEqual(expectedSchedulesCoursesLength);

        // Check that CSC 111 has 2 sections
        const filterCSC111Courses = (element: any, index: any, array: any) => {
            return element.courseNumber == "111" && element.subject == "CSC";
        };
        expect(responseJSON.fallCourses.filter(filterCSC111Courses).length).toEqual(2);

        // Check that CSC 116 has 3 sections
        const filterCSC115Courses = (element: any, index: any, array: any) => {
            return element.courseNumber == "116" && element.subject == "CSC";
        };
        expect(responseJSON.fallCourses.filter(filterCSC115Courses).length).toEqual(3);

    }, 60000); // Timeout of 1 minute to allow algorithm to process
});