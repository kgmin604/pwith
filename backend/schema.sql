CREATE TABLE member
(
    memId VARCHAR(10),
    memPw VARCHAR(20) NOT NULL,
    memName VARCHAR(10) NOT NULL,
    memEmail VARCHAR(20) NOT NULL,
    isMento BOOLEAN DEFAULT 0,
    joinStudy JSON,
    PRIMARY KEY(memId)
);

CREATE TABLE post
(
    --
)

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
    type INT NOT NULL,
    postNum INT NOT NULL,
    FOREIGN KEY(type, postNum) REFERENCES post(type, postId) on delete cascade
)

CREATE TABLE mento (
    mentoId VARCHAR(10),
    mentiList JSON,
    subject JSON NOT NULL,
    mentoPic LONGBLOB, -- NOT NULL
    content VARCHAR(500) NOT NULL,
    PRIMARY KEY(mentoId),
    FOREIGN KEY(mentoId, mentiList) REFERENCES member(memId, memId) on delete cascade -- json도 가능?
);

CREATE TABLE review (
    reviewId INT,
    writer VARCHAR(10) NOT NULL,
    content VARCHAR(300) NOT NULL,
    mentoId VARCHAR(10) NOT NULL,
    PRIMARY KEY(reviewId),
    FOREIGN KEY(mentoId) REFERENCES mento(mentoId) on delete cascade
);