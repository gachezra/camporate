import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaComment, FaEdit, FaTrash } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';

const PostSection = ({ posts, userId, onCreatePost, onVote, onEdit, onDelete, onReply }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [showReplies, setShowReplies] = useState({});

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      onCreatePost(newPostContent);
      setNewPostContent('');
    }
  };
    console.log(posts)

  const ReplyForm = ({ postId }) => {
    const [replyContent, setReplyContent] = useState('');

    const handleReply = () => {
      if (replyContent.trim()) {
        onReply(postId, replyContent);
        setReplyContent('');
        setActiveReplyPostId(null);
      }
    };

    return (
      <div className="mt-2">
        <div className="relative">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Reply to this post"
            className="w-full p-2 pr-10 mb-2 border-b focus:outline-none rounded"
          />
          <button
            onClick={handleReply}
            className="absolute right-2 top-2 bg-brown text-white p-1 rounded-full hover:bg-brown-light flex items-center justify-center"
          >
            <MdSend />
          </button>
        </div>
      </div>
    );
  };

  const renderPost = (post, level = 0) => {
    const isReplying = activeReplyPostId === post._id;
    const hasReplies = post.replies && post.replies.length > 0;
    const isShowingReplies = showReplies[post._id];
    const isAuthor = post.author._id?.includes(userId);

    return (
      <div key={post._id} className={`pl-${Math.min(level + 2)}`}>
        <div className="flex items-start space-x-2">
          <div className="flex flex-col items-center text-brown-dark mt-3">
            <FaArrowUp
              className="cursor-pointer hover:text-brown"
              onClick={() => onVote(post._id, 'upvote')}
            />
            <p className="text-sm font-bold">{post.upvotes - post.downvotes}</p>
            <FaArrowDown
              className="cursor-pointer hover:text-brown"
              onClick={() => onVote(post._id, 'downvote')}
            />
          </div>
          <div className="bg-cream rounded-bl-md mb-1 p-3 shadow-md flex-1">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-brown-dark">{post.author.username}</p>
              <div className="flex space-x-2 text-brown-dark">
                {isAuthor && (
                  <>
                    <FaEdit
                      className="cursor-pointer hover:text-brown"
                      onClick={() => {
                        const newContent = prompt('Edit post:', post.content);
                        if (newContent) onEdit(post._id, newContent);
                      }}
                    />
                    <FaTrash
                      className="cursor-pointer hover:text-brown"
                      onClick={() => onDelete(post._id)}
                    />
                  </>
                )}
              </div>
            </div> 
            <p className="text-brown">{post.content}</p>
            <div className="flex items-center text-sm text-brown-dark">
              <FaComment className="inline mr-1" />
              <span>{post.replies ? post.replies.length : 0}  replies</span>
              {hasReplies && (
                <button
                  onClick={() => setShowReplies(prev => ({ ...prev, [post._id]: !isShowingReplies }))}
                  className="text-brown hover:text-brown-light ml-2"
                >
                  {isShowingReplies ? 'Hide Replies' : 'Show Replies'}
                </button>
              )}
              <button
                onClick={() => setActiveReplyPostId(isReplying ? null : post._id)}
                className="ml-2 text-brown hover:text-brown-light"
              >
                Reply
              </button>
            </div>
            {isReplying && <ReplyForm postId={post._id} />}
          </div>
        </div>
        {hasReplies && isShowingReplies && (
          <div className="pl-4">
            {post.replies.map((reply) => renderPost(reply, level + 3))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4 relative">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="New Post Content"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleCreatePost}
          className="absolute right-2 top-2 bg-brown text-white p-1 rounded-full hover:bg-brown-light flex items-center justify-center"
        >
          <MdSend />
        </button>
      </div>
      <div className="">
        {posts.map((post) => renderPost(post))}
      </div>
    </div>
  );
};

export default PostSection;
