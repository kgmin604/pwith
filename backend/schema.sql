CREATE TABLE member
(
    id BIGINT AUTO_INCREMENT,
    memId VARCHAR(10) NOT NULL UNIQUE,
    password VARBINARY(100) NOT NULL,
    nickname VARCHAR(10) NOT NULL UNIQUE,
    email VARCHAR(20) NOT NULL,
    image VARCHAR(2048) NOT NULL DEFAULT "https://cdn.discordapp.com/attachments/1119199513693933598/1130131200774779011/defalut_user.png",
    isAdmin BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY(id)
);

CREATE TABLE replyStudy
(
    id BIGINT AUTO_INCREMENT,
    writer BIGINT NOT NULL,
    content VARCHAR(300) NOT NULL,
    curDate DATETIME NOT NULL,
    studyId BIGINT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(writer) REFERENCES member(id) on delete set null on update cascade,
    FOREIGN KEY(studyId) REFERENCES study(id) on delete cascade on update cascade
)

CREATE TABLE replyQna
(
    id BIGINT AUTO_INCREMENT,
    writer BIGINT NOT NULL,
    content VARCHAR(300) NOT NULL,
    curDate DATETIME NOT NULL,
    qnaId BIGINT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(writer) REFERENCES member(id) on delete set null on update cascade,
    FOREIGN KEY(qnaId) REFERENCES qna(id) on delete cascade on update cascade
)

CREATE TABLE portfolio
(
    id BIGINT AUTO_INCREMENT,
    mento BIGINT NOT NULL,
    mentoPic VARCHAR(2048) NOT NULL,
    content VARCHAR(500) NOT NULL,
    curDate DATETIME NOT NULL,
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
    writer BIGINT NOT NULL,
    content VARCHAR(300) NOT NULL,
    mento BIGINT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(writer) REFERENCES member(id) on delete set null on update cascade,
    FOREIGN KEY(mento) REFERENCES member(id) on delete cascade on update cascade
)

CREATE TABLE studyRoom (
	id BIGINT AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
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
    mento BIGINT NOT NULL,
    menti BIGINT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(mento) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(menti) REFERENCES member(id) on delete cascade on update cascade
)

CREATE TABLE studyMember (
	id BIGINT AUTO_INCREMENT,
    member BIGINT NOT NULL,
    room BIGINT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(member) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(room) REFERENCES studyRoom(id) on delete cascade on update cascade
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


CREATE TABLE chat (
    chatId INT AUTO_INCREMENT,
    sender VARCHAR(10),
    receiver VARCHAR(10),
    content VARCHAR(500),
    curDate DATE,
    PRIMARY KEY(chatId),
    FOREIGN KEY(sender, receiver) REFERENCES member(memId) on delete cascade
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

create table like (
    likeId int auto_increment,
    memberId VARCHAR(10) not null,
    postId INT not null, 
    liked BOOLEAN DEFAULT FALSE,
    PRIMARY KEY(likeId),
    FOREIGN KEY(memberId) references member(memId),
    FOREIGN KEY(postId) references post(postId)
);