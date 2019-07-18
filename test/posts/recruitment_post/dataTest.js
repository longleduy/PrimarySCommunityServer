//Todo: Default post
export const recruitmentPostData = `{
    postContent: "Automation test",
    postImage: null,
    postTag: ["ReactJs", "Java"],
    role: ["BackEnd Dev", "DBA"],
    salary: "1000 - 2200 USD",
    number: "2",
    company: "Seatech IT",
    address: "98A, Ngụy Như - Kontum, Thanh Xuân, Hà Nội",
    emailAddress: "seatechithr@gmail.com",
    phoneNumber: "0363219295"
}`;
export const recruitmentPost = `{
    postID
    postContent
    postImage
    postTag
    role
    salary
    number
    company
    address
    emailAddress
    phoneNumber
    interactive{
      attended
      attends
      comments
    }
    postCreateTime
    userInfo{
      userID
      profileName
      avatar
    }
}`;
//Todo: Comment
export const commentRecruitmentPostData = `{
    postID: "5cfe21a3ad4c4d42e04a3043",
    commentContent: "Automation test",
}`;
export const recruitmentPostComment = `{
      commentID
      commentContent
      commentImage
      commentCreateTime
      userInfo{
        userID
        profileName
        avatar
      }
}`;
export const attendRecruitmentPostData = `{
  postID:"5cfe21a3ad4c4d42e04a3043",
  action:"ATTEND"
}`;
export const recruitmentPostAttend = `{
  postID
  count
  attended
}`

