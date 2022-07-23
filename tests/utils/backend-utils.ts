/**
 * This file contains methods which validate the correctness of solutions generated
 * by the backend. In particular, functions which help validate that the output is
 * expected as compared to the input.
 */

export const isCourseSectionArrayValid = (courseSectionArray: any[]) => {
    const validTerms = ['SUMMER', 'FALL', 'SPRING'];
    const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    const validSections = ['A01', 'A02', 'A03', 'A04', 'A05']; // Dont' think we expect more than 5 sections?

    for (const courseSection of courseSectionArray) {

        // Validate subject, i.e. 'SENG', 'CSC'...
        expect(courseSection.CourseID.subject).toBeDefined();
        expect(courseSection.CourseID.subject.length).toBeGreaterThan(0);

        // Validate course code, i.e. '225', '349A'...
        expect(courseSection.CourseID.code).toBeDefined();
        expect(courseSection.CourseID.code.length).toBeGreaterThan(0);

        // Validate semester course is provided
        expect(validTerms.includes(courseSection.CourseID.term)).toBeTruthy();

        // Validate hoursPerWeek is a number greter than 0
        expect(typeof courseSection.hoursPerWeek).toEqual('number');
        expect(courseSection.hoursPerWeek).toBeGreaterThanOrEqual(0);

        // Validate capacity is defined and greater than 0
        expect(typeof courseSection.capacity).toEqual('number');
        expect(courseSection.capacity).toBeGreaterThanOrEqual(0);

        // Validate start date & end date are defined
        expect(courseSection.startDate).toBeDefined();
        expect(typeof courseSection.startDate).toEqual('string');
        expect(courseSection.startDate.length).toBeGreaterThan(0);

        expect(courseSection.endDate).toBeDefined();
        expect(typeof courseSection.endDate).toEqual('string');
        expect(courseSection.endDate.length).toBeGreaterThan(0);

        // Validate section number is defined and expected
        expect(validSections.includes(courseSection.sectionNumber)).toBeTruthy();

        // Validate professors are provided as valid type
        expect(courseSection.professors.length).toBeGreaterThan(0);
        for (const professor of courseSection.professors) {
            expect(professor.displayName).toBeDefined();
            expect(typeof professor.displayName).toEqual('string');
            expect(professor.displayName.length).toBeGreaterThan(0);
        }

        // Validate meeting time are provided as valid type. We do not expect courses to be scheduled on weekends.
        expect(courseSection.meetingTimes.length).toBeGreaterThan(0);
        for (const meetingTime of courseSection.meetingTimes) {
            expect(validDays.includes(meetingTime.day)).toBeTruthy();
            
            expect(meetingTime.startTime).toBeDefined();
            expect(meetingTime.startTime.length).toBeGreaterThan(0);

            expect(meetingTime.endTime).toBeDefined();
            expect(meetingTime.endTime.length).toBeGreaterThan(0);
        }
    }
};