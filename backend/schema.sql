CREATE TABLE member (
  id bigint NOT NULL AUTO_INCREMENT,
  memId varchar(10) DEFAULT NULL UNIQUE,
  password varchar(300) DEFAULT NULL,
  nickname varchar(10) NOT NULL,
  email varchar(50) NOT NULL UNIQUE,
  image varchar(300) NOT NULL DEFAULT 'https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/profile/default_user.jpg',
  sns_id varchar(300) DEFAULT NULL,
  sns_type varchar(10) DEFAULT NULL,
  isAdmin boolean NOT NULL DEFAULT false,
  PRIMARY KEY (id)
) -- (sns_id, sns_type) UNIQUE

CREATE TABLE refreshToken (
    id BIGINT AUTO_INCREMENT,
    member BIGINT NOT NULL UNIQUE,
    token VARCHAR(300) NOT NULL UNIQUE,
    create_at DATETIME NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(member) REFERENCES member(id) on delete cascade on update cascade
)

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
    mento BIGINT NOT NULL,
    brief VARCHAR(50) NOT NULL,
    mentoPic VARCHAR(2048) NOT NULL,
    content VARCHAR(500) NOT NULL,
    curDate DATETIME NOT NULL,
    tuition INT NOT NULL,
    duration INT NOT NULL,
    isOpen BOOLEAN NOT NULL DEFAULT true,
    isDeleted BOOLEAN NOT NULL DEFAULT false,
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
    room bigint,
    score int default 0,
    curDate datetime not null,
    PRIMARY KEY(id),
    FOREIGN KEY(writer) REFERENCES member(id) on delete set default on update cascade,
    FOREIGN KEY(mento) REFERENCES member(id) on delete cascade on update cascade
    foreign key(room) references mentoringRoom(id) on delete set null on update cascade
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
    name VARCHAR(50) NOT NULL,
    curDate DATETIME NOT NULL,
    mento BIGINT NOT NULL,
    menti BIGINT NOT NULL,
    notice VARCHAR(50),
    lesson_cnt INT NOT NULL DEFAULT 0,
    mento_cnt INT NOT NULL DEFAULT 0,
    menti_cnt INT NOT NULL DEFAULT 0,
    refund_cnt INT NOT NULL DEFAULT 0,
    portfolio BIGINT DEFAULT NULL,
    PRIMARY KEY(id),
    UNIQUE KEY (mento, menti),
    FOREIGN KEY(mento) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(menti) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(portfolio) REFERENCES portfolio(id) on delete set null on update cascade
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
    FOREIGN KEY(writer) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(roomId) REFERENCES studyRoom(id) on delete cascade on update cascade
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
    FOREIGN KEY(writer) REFERENCES member(id) on delete cascade on update cascade
);


CREATE TABLE chat (
    id BIGINT AUTO_INCREMENT,
    sender BIGINT,
    receiver BIGINT,
    content VARCHAR(500),
    curDate DATETIME,
    PRIMARY KEY(id),
    FOREIGN KEY(sender) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(receiver) REFERENCES member(id) on delete cascade on update cascade
);

CREATE TABLE studyRoomChat (
    id BIGINT AUTO_INCREMENT,
    memId BIGINT NOT NULL,
    roomId BIGINT NOT NULL,
    content VARCHAR(500) NOT NULL,
    curDate DATETIME NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(memId) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(roomId) REFERENCES studyRoom(id) on delete cascade on update cascade
);

CREATE TABLE mentoringRoomChat (
    id BIGINT AUTO_INCREMENT,
    memId BIGINT NOT NULL,
    roomId BIGINT NOT NULL,
    content VARCHAR(500) NOT NULL,
    curDate DATETIME NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(memId) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(roomId) REFERENCES mentoringRoom(id) on delete cascade on update cascade
);

create table mentoringRoom (
	roomId int auto_increment,
    roomName varchar(20) not null,
    mentoId varchar(10) not null,
    mentiId varchar(10) not null,
    primary key(roomId),
    foreign key(mentoId) references mento(mentoId) on delete cascade on update cascade,
    foreign key(mentiId) references member(memId) on delete cascade on update cascade
);

create table studyLike
(
    id BIGINT AUTO_INCREMENT,
    memberId BIGINT NOT NULL,
    studyId BIGINT NOT NULL,
    PRIMARY KEY(id), 
    FOREIGN KEY(memberId) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(studyId) REFERENCES study(id) ON DELETE CASCADE
);

create table qnaLike
(
    id BIGINT AUTO_INCREMENT,
    memberId BIGINT NOT NULL,
    qnaId BIGINT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(memberId) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(qnaId) REFERENCES qna(id) ON DELETE CASCADE
);


create table alarm
(
    id BIGINT AUTO_INCREMENT,
    memId BIGINT NOT NULL,
    oppId BIGINT NOT NULL,
    contentId BIGINT NOT NULL,
    contentType BIGINT NOT NULL,
    reading BOOLEAN DEFAULT FALSE,
    PRIMARY KEY(id),
    FOREIGN KEY(memId) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(oppId) REFERENCES member(id) on delete cascade on update cascade,
    FOREIGN KEY(contentId) REFERENCES studyRoom(id) on delete cascade on update cascade
);

create table refund
(
    id BIGINT AUTO_INCREMENT,
    memId BIGINT NOT NULL,
    bank VARCHAR(20) NOT NULL,
    account VARCHAR(20) NOT NULL,
    balance BIGINT NOT NULL,
    curDate DATETIME NOT NULL,
    checked BOOLEAN DEFAULT FALSE,
    PRIMARY KEY(id),
    FOREIGN KEY(memId) REFERENCES member(id) on delete cascade on update cascade
);