import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaComment, FaEdit, FaTrash } from 'react-icons/fa';
// import { MdAddCircleOutline } from 'react-icons/md';
import { MdOutlineForum, MdSend } from "react-icons/md";
import { IoIosArrowForward, IoIosArrowRoundBack } from 'react-icons/io';
import {
  createThreadRoute,
  getThreadsRoute,
  getUserProfileRoute,
  createPostRoute,
  postByIdRoute,
  getPostsRoute,
  votePostRoute
} from '../../utils/APIRoutes';

const ForumManagement = ({userId}) => {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadDescription, setNewThreadDescription] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [showReplies, setShowReplies] = useState(false);


  const fetchThreads = useCallback( async () => {
    try {
      const response = await axios.get(getThreadsRoute(userId));
      setThreads(response.data.map(thread => ({
        id: thread._id,
        title: thread.title,
        content: thread.content,
        author: thread.author.username,
        createdAt: thread.createdAt
      })));
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const fetchBranch = async () => {
    try {
      const branch = await axios.get(`${getUserProfileRoute}/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const branchId = branch.data.universities[0].branch;

      return branchId;

    } catch (error) {
      console.error('Error fetching branch:', error);
    }
  }

  const fetchPosts = async (threadId, userId) => {
    try {
      const response = await axios.get(getPostsRoute(threadId, userId), {
        userId: userId
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreateThread = async () => {
    try {
      const branchId = await fetchBranch();
      await axios.post(createThreadRoute(userId), {
        title: newThreadTitle,
        content: newThreadDescription,
        branchId
      });
      fetchThreads()
      setNewThreadTitle('');
      setNewThreadDescription('');
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  const handleCreatePost = async () => {
    try {
      const response = await axios.post(createPostRoute(userId), {
        threadId: selectedThread.id,
        content: newPostContent
      });
      setPosts([...posts, response.data]);
      setNewPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      await axios.post(votePostRoute(postId), { vote: voteType });
      fetchPosts(selectedThread.id, userId);
    } catch (error) {
      console.error('Post id: ', postId)
      console.log('Upvoting')
      console.error('Error voting:', error);
    }
  };

  const handleEdit = async (postId, newContent) => {
    try {
      await axios.put(postByIdRoute(postId), { content: newContent });
      fetchPosts(selectedThread.id, userId);
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(postByIdRoute(postId));
      fetchPosts(selectedThread.id, userId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const ReplyForm = ({ postId }) => {
    const [replyContent, setReplyContent] = useState('');
  
    const handleReply = async () => {
      try {
        await axios.post(createPostRoute(userId), {
          threadId: selectedThread.id,
          content: replyContent,
          parentId: postId,
        });
        setReplyContent('');
        fetchPosts(selectedThread.id, userId);
        setActiveReplyPostId(null);
      } catch (error) {
        console.error('Error replying:', error);
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
    const isAuthor = post.author._id?.includes(userId);
    return (
      <div key={post._id} className={`pl-${level * 4} py-2 border-l-4 border-brown-light`}>
        <div className="flex items-start space-x-2">
          <div className="flex flex-col items-center text-brown-dark">
            <FaArrowUp
              className="cursor-pointer hover:text-brown"
              onClick={() => handleVote(post._id, 'upvote')}
            />
            <p className="text-sm font-bold">{post.upvotes - post.downvotes}</p>
            <FaArrowDown
              className="cursor-pointer hover:text-brown"
              onClick={() => handleVote(post._id, 'downvote')}
            />
          </div>
          <div className="bg-cream rounded-lg p-3 shadow-md flex-1">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-brown-dark">{post.author.username}</p>
              {isAuthor && (
                <div className="flex space-x-2 text-brown-dark">
                  <FaEdit
                    className="cursor-pointer hover:text-brown"
                    onClick={() => {
                      const newContent = prompt('Edit post:', post.content);
                      if (newContent) handleEdit(post._id, newContent);
                    }}
                  />
                  <FaTrash
                    className="cursor-pointer hover:text-brown"
                    onClick={() => handleDelete(post._id)}
                  />
                </div>
              )}
            </div>
            <p className="text-brown">{post.content}</p>
            <div className="flex items-center space-x-2 mt-2 text-sm text-brown-dark">
              <FaComment className="inline" />
              <span>{post.replies ? post.replies.length : 0} replies</span>
              {level < 9 && (
                <IoIosArrowForward
                  className="inline cursor-pointer hover:text-brown"
                  onClick={() => {
                    setActiveReplyPostId(
                      activeReplyPostId === post._id ? null : post._id
                    );
                  }}
                />
              )}
            </div>
            {activeReplyPostId === post._id && level < 9 && <ReplyForm postId={post._id} />}
          </div>
        </div>

        {post.replies && (
          <div className="pl-4">
            {/* Render first two levels of replies directly */}
            {post.replies.slice(0, 2).map((reply) => renderPost(reply, level + 3))}

            {/* Show "View Replies" button for additional replies */}
            {post.replies.length > 2 && !showReplies && (
              <button
                onClick={() => setShowReplies(true)}
                className="mt-2 text-brown hover:underline"
              >
                View {post.replies.length - 2} more replies
              </button>
            )}

            {/* Render remaining replies when "View Replies" is clicked */}
            {showReplies &&
              post.replies.slice(2).map((reply) => renderPost(reply, level + 3))}
          </div>
        )}
      </div>
    );
  }
  
  

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brown-dark">Forum Management</h1>
        {/* <MdAddCircleOutline className="text-3xl text-brown cursor-pointer hover:text-brown-light" /> */}
      </div>

      {!selectedThread ? (
        <>
          <div className="mb-4">
            <input
              type="text"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              placeholder="Post Title"
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              value={newThreadDescription}
              onChange={(e) => setNewThreadDescription(e.target.value)}
              placeholder="Post Content"
              className="w-full p-2 mb-2 border rounded"
            />
            <button
              onClick={handleCreateThread}
              className="bg-brown text-white px-4 py-2 rounded hover:bg-brown-light"
            >
              Create Thread
            </button>
          </div>
          <div className="space-y-6">
            {threads.map((thread) => (
              <div key={thread.id} className="bg-cream p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-brown-dark">{thread.title}</h2>
                <p className="text-brown-light">{thread.content}</p>
                <p className="text-sm text-brown-dark mt-1">
                  Posted by {thread.author} | {new Date(thread.createdAt).toLocaleString()}
                </p>
                <button
                  onClick={() => {
                    setSelectedThread(thread);
                    fetchPosts(thread.id, userId);
                  }}
                  className="mt-2 text-brown hover:text-brown-light"
                >
                  <MdOutlineForum size={20}/>
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            className="bg-brown text-white px-2 py-1 rounded-xl hover:bg-brown-light"
            onClick={() => setSelectedThread(null)}
          >
            <IoIosArrowRoundBack size={25} />
          </button>
          <h2 className="text-2xl font-bold text-brown-dark mb-4">{selectedThread.title}</h2>
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
          <div className="space-y-4">
            {posts.map((post) => renderPost(post))}
          </div>
        </>
      )}
    </div>
  );
};

export default ForumManagement;