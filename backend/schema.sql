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
    views INT DEFAULT 0,
    joiningP INT,
    totalP INT DEFAULT 50,
    PRIMARY KEY(studyId),
    FOREIGN KEY(writer) REFERENCES member(memId)
)

-- CREATE TABLE boot
-- (
--     bootId INT,
--     title VARCHAR(50),
--     writer VARCHAR(10),
--     curDate DATE,
--     content VARCHAR(500),
--     category VARCHAR(10),
--     views INT,
--     likes INT,
--     PRIMARY KEY(bootId),
--     FOREIGN KEY(writer) REFERENCES member(memId)
-- )

CREATE TABLE QNA
(
    QNAId INT,
    title VARCHAR(50),
    writer VARCHAR(10),
    curDate DATE,
    content VARCHAR(500),
    category VARCHAR(10),
    views INT,
    likes INT,
    reply VARCHAR(200),
    PRIMARY KEY(QNAId),
    FOREIGN KEY(writer) REFERENCES member(memId)
)


CREATE TABLE reply (
    replyId INT AUTO_INCREMENT,
    writer VARCHAR(10) NOT NULL,
    content VARCHAR(300) NOT NULL,
    curDate DATE NOT NULL,

    -- 1. post 테이블로 합치고 type 열 추가
    -- like 추가하고, joinP와 totalP는 studyroom으로 보내면 null값 방지 가능(추후 study는 studyroom과의 join으로 접근)
    category INT NOT NULL,
    postNum INT NOT NULL,
    FOREIGN KEY(category, postNum) REFERENCES post(type, postId) on delete cascade

    -- 2. nullable foreign key 또는 null 대신 0 저장
    category INT NOT NULL,
    studyId INT, -- can be null
    QNAId INT, -- can be null
    FOREIGN KEY(studyId) REFERENCES study(studyId) on delete cascade
    FOREIGN KEY(QNAId) REFERENCES QNA(QNAId) on delete cascade
)