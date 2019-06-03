//Todo: Default post
export const defaultPostData = `{
    postContent: "Seatech tuyển dụng",
    postImage: null,
    postTag: ["React Native, Nodejs"],
    isComment: true,
    isPublic: true
}`;
export const defaultPost = `{
      isAuthor
      userInfo{
        userID
        profileName
        avatar
      }
      postID
      postContent
      postImage
      postTag
      isComment
      isPublic
      postCreateTime
      interactive{
        liked
        likes
        comments
      }
}`;
//Todo: Comment
export const commentDefaultPostData = `{
    postID: "5cdd88532256a909200d7de5",
    comments:0,
    commentContent: "Automation test",
}`;
export const defaultPostComment = `{
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
export const getListCommentDefaultPostData = `{
  postID:"5cdd88532256a909200d7de5",
  skipNumber:0
}`;

