CREATE DATABASE mirboard default CHARACTER SET UTF8;

USE mirboard;

-- 게시판
CREATE TABLE `tBoard` (
	`boardSeq`   INT          NOT NULL COMMENT '일련번호', -- 일련번호
	`masterSeq`  INT          NOT NULL COMMENT '마스터 일련번호', -- 마스터 일련번호
	`userId`     VARCHAR(100) NOT NULL COMMENT '아이디', -- 아이디
	`title`      VARCHAR(500) NOT NULL COMMENT '제목', -- 제목
	`content`    TEXT         NULL     COMMENT '내용', -- 내용
	`deleteYn`   BIT          NOT NULL COMMENT '삭제여부', -- 삭제여부
	`updateDate` DATETIME     NULL     COMMENT '수정일', -- 수정일
	`createDate` DATETIME     NOT NULL COMMENT '작성일' -- 작성일
)
COMMENT '게시판';



-- 게시판
ALTER TABLE `tBoard`
	ADD CONSTRAINT `PK_tBoard` -- 게시판 기본키
		PRIMARY KEY (
			`boardSeq` -- 일련번호
		);

ALTER TABLE `tBoard`
	MODIFY COLUMN `boardSeq` INT NOT NULL AUTO_INCREMENT COMMENT '일련번호';

-- 게시판 마스터
CREATE TABLE `tBoardMaster` (
	`masterSeq`     INT          NOT NULL COMMENT '마스터 일련번호', -- 마스터 일련번호
	`boardCategory` VARCHAR(100) NOT NULL COMMENT '게시판 종류', -- 게시판 종류
	`boardName`     VARCHAR(100) NOT NULL COMMENT '게시판 이름', -- 게시판 이름
	`createDate`    DATETIME     NOT NULL COMMENT '생성일' -- 생성일
)
COMMENT '게시판 마스터';

-- 게시판 마스터
ALTER TABLE `tBoardMaster`
	ADD CONSTRAINT `PK_tBoardMaster` -- 게시판 마스터 기본키
		PRIMARY KEY (
			`masterSeq` -- 마스터 일련번호
		);

ALTER TABLE `tBoardMaster`
	MODIFY COLUMN `masterSeq` INT NOT NULL AUTO_INCREMENT COMMENT '마스터 일련번호';

-- 유저
CREATE TABLE `tUser` (
	`userSeq`      INT          NOT NULL COMMENT '회원일련번호', -- 회원일련번호
	`userId`       VARCHAR(100) NOT NULL COMMENT '아이디', -- 아이디
	`userPassword` VARCHAR(200) NOT NULL COMMENT '비밀번호', -- 비밀번호
	`updateDate`   DATETIME     NULL     COMMENT '수정일', -- 수정일
	`createDate`   DATETIME     NOT NULL COMMENT '생성일' -- 생성일
)
COMMENT '유저';

-- 유저
ALTER TABLE `tUser`
	ADD CONSTRAINT `PK_tUser` -- 유저 기본키
		PRIMARY KEY (
			`userSeq` -- 회원일련번호
		);

-- 유저 인덱스
CREATE INDEX `IX_tUser`
	ON `tUser`( -- 유저
		`userId` ASC -- 아이디
	);

ALTER TABLE `tUser`
	MODIFY COLUMN `userSeq` INT NOT NULL AUTO_INCREMENT COMMENT '회원일련번호';

-- 게시판
ALTER TABLE `tBoard`
	ADD CONSTRAINT `FK_tBoardMaster_TO_tBoard` -- 게시판 마스터 -> 게시판
		FOREIGN KEY (
			`masterSeq` -- 마스터 일련번호
		)
		REFERENCES `tBoardMaster` ( -- 게시판 마스터
			`masterSeq` -- 마스터 일련번호
		);

insert tboardmaster (boardCategory, boardName, createDate) values ('notice','공지',now());
insert tboardmaster (boardCategory, boardName, createDate) values ('free','자유게시판',now());