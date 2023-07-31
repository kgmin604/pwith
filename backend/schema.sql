CREATE TABLE member
(
    id BIGINT AUTO_INCREMENT,
    memId VARCHAR(10) NOT NULL UNIQUE,
    password VARBINARY(100) NOT NULL,
    nickname VARCHAR(10) NOT NULL UNIQUE,
    email VARCHAR(20) NOT NULL,
    image VARCHAR(2048) NOT NULL DEFAULT "https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/default_user.jpg",
    isAdmin BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY(id)
);

CREATE TABLE replyStudy
(
    id BIGINT AUTO_INCREMENT,
    writer BIGINT NOT NULL DEFAULT 0,
    content VARCHAR(300) NOT NULL,
    curDate DATETIME NOT NULL,
    studyId BIGINT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(writer) REFERENCES member(id) on delete set default on update cascade,
    FOREIGN KEY(studyId) REFERENCES study(id) on delete cascade on update cascade
)

CREATE TABLE replyQna
(
    id BIGINT AUTO_INCREMENT,
    writer BIGINT NOT NULL DEFAULT 0,
    content VARCHAR(300) NOT NULL,
    curDate DATETIME NOT NULL,
    qnaId BIGINT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(writer) REFERENCES member(id) on delete set default on update cascade,
    FOREIGN KEY(qnaId) REFERENCES qna(id) on delete cascade on update cascade
)

CREATE TABLE portfolio
(
    id BIGINT AUTO_INCREMENT,
    mento BIGINT NOT NULL UNIQUE,
    brief VARCHAR(50) NOT NULL,
    mentoPic VARCHAR(2048) NOT NULL,
    content VARCHAR(500) NOT NULL,
    curDate DATETIME NOT NULL,
    tuition INT NOT NULL,
    duration INT NOT NULL,
    isOpen BOOLEAN NOT NULL DEFAULT true,
    score INT NOT NULL DEFAULT -1,
    PRIMARY KEY(id),
    FOREIGN KEY(mento) REFERENCES member(id) on delete cascade on update cascade
)

CREATE TABLE portfolioSubject
(
    id BIGINT AUTO_INCREMENT,
    portfolio BIGINT NOT NULL,
    subject INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(portfolio) REFERENCES portfolio(id) on delete cascade on update cascade
)

CREATE TABLE review
(
    id BIGINT AUTO_INCREMENT,
    writer BIGINT NOT NULL DEFAULT 0,
    content VARCHAR(300) NOT NULL,
    mento BIGINT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(writer) REFERENCES member(id) on delete set default on update cascade,
    FOREIGN KEY(mento) REFERENCES member(id) on delete cascade on update cascade
)

CREATE TABLE studyRoom (
	id BIGINT AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    curDate DATETIME NOT NULL,
    category INT NOT NULL,
    leader BIGINT NOT NULL,
    image VARCHAR(2048) NOT NULL DEFAULT "https://cdn.discordapp.com/attachments/1120631568311009360/1130188761989386412/image.png",
    joinP INT NOT NULL DEFAULT 0,
    totalP INT NOT NULL,
    notice VARCHAR(50),
    PRIMARY KEY(id),
    FOREIGN KEY(leader) REFERENCES member(id) on delete cascade on update cascade
    -- FOREIGN KEY(notice) REFERENCES studyRoomChat(id)
)

CREATE TABLE mentoringRoom (
    id BIGINT AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    curDate DATETIME NOT NULL,
    mento BIGINT NOT NULL,
    menti BIGINT NOT NULL,
    PRIMARY KEY(id),
    UNIQUE KEY (mento, menti),
    FOREIGN KEY(mento) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(menti) REFERENCES member(id) on delete cascade on update cascade
)

CREATE TABLE studyMember (
	id BIGINT AUTO_INCREMENT,
    member BIGINT NOT NULL,
    room BIGINT NOT NULL,
    PRIMARY KEY(id),
    UNIQUE KEY (member, room),
    FOREIGN KEY(member) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(room) REFERENCES studyRoom(id) on delete cascade on update cascade
)


CREATE TABLE study
(
    id BIGINT AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    writer BIGINT NOT NULL,
    curDate DATETIME NOT NULL,
    content VARCHAR(500) NOT NULL,
    category INT NOT NULL,
    likes INT DEFAULT 0, 
    views INT DEFAULT 0,
    roomId BIGINT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(writer) REFERENCES member(id),
    FOREIGN KEY(roomId) REFERENCES studyRoom(id)
);

CREATE TABLE qna
(
    id BIGINT AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    writer BIGINT NOT NULL,
    curDate DATETIME NOT NULL,
    content VARCHAR(500) NOT NULL,
    category INT NOT NULL,
    likes INT DEFAULT 0, 
    views INT DEFAULT 0,
    PRIMARY KEY(id),
    FOREIGN KEY(writer) REFERENCES member(id)
);


CREATE TABLE chat (
    id BIGINT AUTO_INCREMENT,
    sender BIGINT,
    receiver BIGINT,
    content VARCHAR(500),
    curDate DATETIME,
    PRIMARY KEY(id),
    FOREIGN KEY(sender) REFERENCES member(id),
    FOREIGN KEY(receiver) REFERENCES member(id)
);

CREATE TABLE studyRoomChat (
    id BIGINT AUTO_INCREMENT,
    memId BIGINT NOT NULL,
    roomId BIGINT NOT NULL,
    content VARCHAR(500) NOT NULL,
    curDate DATETIME NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(memId) REFERENCES member(id),
    FOREIGN KEY(roomId) REFERENCES studyRoom(id)
);

CREATE TABLE mentoringRoomChat (
    id BIGINT AUTO_INCREMENT,
    memId BIGINT NOT NULL,
    roomId BIGINT NOT NULL,
    content VARCHAR(500) NOT NULL,
    curDate DATETIME NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(memId) REFERENCES member(id),
    FOREIGN KEY(roomId) REFERENCES mentoringRoom(id)
);

create table mentoringRoom (
	roomId int auto_increment,
    roomName varchar(20) not null,
    mentoId varchar(10) not null,
    mentiId varchar(10) not null,
    primary key(roomId),
    foreign key(mentoId) references mento(mentoId),
    foreign key(mentiId) references member(memId)
);

create table studyLike
(
    id BIGINT AUTO_INCREMENT,
    memberId BIGINT NOT NULL,
    studyId BIGINT NOT NULL,
    PRIMARY KEY(id), 
    FOREIGN KEY(memberId) REFERENCES member(id),
    FOREIGN KEY(studyId) REFERENCES study(id) ON DELETE CASCADE
);

create table qnaLike
(
    id BIGINT AUTO_INCREMENT,
    memberId BIGINT NOT NULL,
    qnaId BIGINT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(memberId) REFERENCES member(id),
    FOREIGN KEY(qnaId) REFERENCES qna(id) ON DELETE CASCADE
);
