CREATE TABLE member
(
    memId VARCHAR(10),
    memPw VARCHAR(20) NOT NULL,
    memName VARCHAR(10) NOT NULL,
    memEmail VARCHAR(20) NOT NULL,
    isMento BOOLEAN,
    joinStudy JSON,
    feedback JSON,
    PRIMARY KEY(memId)
);

CREATE TABLE study
(
    studyId INT,
    title VARCHAR(50),
    writer VARCHAR(10),
    curDate DATE,
    content VARCHAR(500),
    category VARCHAR(10),
    views INT,
    joiningP INT,
    totalP INT,
    PRIMARY KEY(studyId),
    FOREIGN KEY(writer) REFERENCE member.memId
)

CREATE TABLE boot
(

)

CREATE TABLE QNA
(
    
)