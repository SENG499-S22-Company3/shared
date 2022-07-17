/**
 * This file contains methods which validate the correctness of solutions generated
 * by Algorithm 1. In particular, functions below help determine if hard constraints
 * are satisfied.
 */

// Checks that actualCoursesArray is contained in expectedCoursesArray. If not, then
// fails. If those courses are contained in expectedCoursesArray, checks that they 
// have the same information.
const areCoursesContainedInCourseArrayEqual = (expectedCoursesArray: any[], actualCoursesArray: any[], compareAssignments: boolean = true) => {
    
};

// Checks that each course contains professors which are provided as input to the algorithm.
export const areProfessorAssignmentsValid = (expectedProfessors: any[], actualCourses: any[]) => {
    const expectedProfessorsNames = expectedProfessors.map(prof => prof.displayName);
    //console.log(expectedProfessorsNames);

    for (const course of actualCourses) {
        //console.log(course.prof);
        expect(expectedProfessorsNames.includes(course.prof.displayName)).toBeTruthy();
    }
};

// Checks that two array of course objects are equal. We use the definition of `Course`
// as defined in structs.go for algorithm 1. Array elements can be in any order.
export const areCoursesEqual = (expectedCoursesArray: any[], actualCoursesArray: any[], compareAssignments: boolean = true, compareProfs: boolean = true) => {
    // If arrays are of different length, then they are not equal.
    expect(actualCoursesArray.length).toEqual(expectedCoursesArray.length);

    // Sort arrays by the subject, then course number, then sequenceNumber.
    expectedCoursesArray.sort((a, b) => + (a.subject < b.subject) 
        || + (a.courseNumber < b.courseNumber)
        || + (a.sequenceNumber < b.sequenceNumber));
    
    actualCoursesArray.sort((a, b) => + (a.subject < b.subject) 
        || + (a.courseNumber < b.courseNumber)
        || + (a.sequenceNumber < b.sequenceNumber));

    // Loop through each course object and compare.
    let expectedCourse, actualCourse;
    for (let i=0; i<expectedCoursesArray.length; i++) {
        expectedCourse = expectedCoursesArray[i];
        actualCourse = actualCoursesArray[i];

        expect(actualCourse.courseNumber).toEqual(expectedCourse.courseNumber);
        expect(actualCourse.subject).toEqual(expectedCourse.subject);
        expect(actualCourse.sequenceNumber).toEqual(expectedCourse.sequenceNumber);
        expect(actualCourse.streamSequence).toEqual(expectedCourse.streamSequence);
        expect(actualCourse.courseTitle).toEqual(expectedCourse.courseTitle);

        // Make sure meeting assignments are equal
        if (compareAssignments) {
            areAssignmentsEqual(expectedCourse.assignment, actualCourse.assignment);
        }

        // Make sure professor assignments are equal
        if (compareProfs) {
            areProfessorsEqual(expectedCourse.prof, actualCourse.prof);
        }      
    }
};

// Checks that two assignments are equal. Corresponds to `Assignment` as defined in structs.go
export const areAssignmentsEqual = (expectedAssignment: any, actualAssignment: any) => {
    
    expect(actualAssignment.startDate).toEqual(expectedAssignment.startDate);
    expect(actualAssignment.endDate).toEqual(expectedAssignment.endDate);
    expect(actualAssignment.beginTime).toEqual(expectedAssignment.beginTime);
    expect(actualAssignment.endTime).toEqual(expectedAssignment.endTime);
    expect(actualAssignment.hoursWeek).toEqual(expectedAssignment.hoursWeek);

    expect(actualAssignment.sunday).toEqual(expectedAssignment.sunday);
    expect(actualAssignment.monday).toEqual(expectedAssignment.monday);
    expect(actualAssignment.tuesday).toEqual(expectedAssignment.tuesday);
    expect(actualAssignment.wednesday).toEqual(expectedAssignment.wednesday);
    expect(actualAssignment.thursday).toEqual(expectedAssignment.thursday);
    expect(actualAssignment.friday).toEqual(expectedAssignment.friday);
    expect(actualAssignment.saturday).toEqual(expectedAssignment.saturday);
};

// Checks that two professors are equal. Corresponds to `Professor` as defined in structs.go
export const areProfessorsEqual = (expectedProfessor: any, actualProfessor: any) => {
    expect(actualProfessor.displayName).toEqual(expectedProfessor.displayName);
};