/**
 * This file contains methods which validate the correctness of solutions generated
 * by Algorithm 2.
 */

export const isSupportedCourseArrayValid = (courseArray: any[]) => {
    for (const course of courseArray) {
        // Class size is defined
        expect(course.class_size).toEqual(0);

        // Department is defined
        expect(course.department).toBeDefined();
        expect(typeof course.department).toEqual('string');
        expect(course.department.length).toBeGreaterThan(0);

        // Name is defined
        expect(course.name).toBeDefined();
        expect(typeof course.name).toEqual('string');
        expect(course.name.length).toBeGreaterThan(0);

        // Prereqs, semester, and year is defined
        expect(course.semester).toBeDefined();
        expect(course.semester).toEqual(null);
        expect(course.year).toBeDefined();
        expect(course.year).toEqual(null);
        expect(course.prereqs).toBeDefined();
    }
}

export const isCourseCapacityPredictionValid = (inputCourseArray: any[], actualCourseArray: any[]) => {
    expect(actualCourseArray.length).toEqual(inputCourseArray.length);
    
    let inputCourse, actualCourse;
    for (let i=0; i<inputCourseArray.length; i++) {
        inputCourse = inputCourseArray[i];
        actualCourse = inputCourseArray[i];

        // Ensure capacity is defined.
        expect(actualCourse.capacity).toBeDefined();
        expect(typeof actualCourse.capacity).toEqual('number');
        expect(actualCourse.capacity).toBeGreaterThanOrEqual(0);

        expect(actualCourse.code).toEqual(inputCourse.code);
        expect(actualCourse.semester).toEqual(inputCourse.semester);
        expect(actualCourse.seng_ratio).toEqual(inputCourse.seng_ratio);
        expect(actualCourse.subject).toEqual(inputCourse.subject);
    }
};