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
    curDate DATETIME NOT NULL,
    type INT NOT NULL,
    postNum INT NOT NULL,
    PRIMARY KEY(replyId),
    FOREIGN KEY(writer) REFERENCES member(memId), -- 삭제 시 (알 수 없음) 구현
    FOREIGN KEY(postNum) REFERENCES post(postId) on delete cascade
)

CREATE TABLE mento (
    mentoId VARCHAR(10),
    mentiList JSON,
    subject JSON NOT NULL,
    mentoPic LONGBLOB, -- NOT NULL
    content VARCHAR(500) NOT NULL,
    PRIMARY KEY(mentoId),
    FOREIGN KEY(mentoId) REFERENCES member(memId) on delete cascade
    -- FOREIGN KEY(mentoId, mentiList) REFERENCES member(memId, memId) on delete cascade -- json 안 됨. 일단 빼고 생성함.
);

CREATE TABLE review (
    reviewId INT,
    writer VARCHAR(10) NOT NULL,
    content VARCHAR(300) NOT NULL,
    mentoId VARCHAR(10) NOT NULL,
    PRIMARY KEY(reviewId),
    FOREIGN KEY(mentoId) REFERENCES mento(mentoId) on delete cascade
);