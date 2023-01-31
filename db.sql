/*
    -- Variables
    Unique identifier
    Full name
    Overall rating
    Spider graph stat values
        Easy
        Effective/Educational/Learned a lot
        Fair Grader
        Would retake/would recommend


    -- Needs more thought
    Schools - tightly coupled with courses
    Courses - it would be great to lookup professors by course and courses by professor
    Ratings - should definitely be its own table

*/
CREATE TABLE professors (
    id serial not null primary key,
    name text not null,
    rating numeric not null
);