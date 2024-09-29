import React, { useEffect, useCallback, useReducer, useState } from 'react';
import axios from 'axios';
import { IoIosArrowRoundBack } from 'react-icons/io';
import PostSection from './PostSection';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  createThreadRoute,
  getThreadsRoute,
  getUserProfileRoute,
  createPostRoute,
  postByIdRoute,
  getPostsRoute,
  votePostRoute
} from '../utils/APIRoutes';

// Reducer for managing forum state
const forumReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THREADS':
      return { ...state, threads: action.payload };
    case 'SET_SELECTED_THREAD':
      return { ...state, selectedThread: action.payload };
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'RESET_NEW_THREAD':
      return { ...state, newThreadTitle: '', newThreadDescription: '' };
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
};

const ForumPage = () => {
  const userId = localStorage.getItem('uid');
  const [state, dispatch] = useReducer(forumReducer, {
    threads: [],
    selectedThread: null,
    posts: [],
    newThreadTitle: '',
    newThreadDescription: ''
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchThreads = useCallback(async () => {
    try {
      const response = await axios.get(getThreadsRoute(userId));
      dispatch({
        type: 'SET_THREADS',
        payload: response.data.map(thread => ({
          id: thread._id,
          title: thread.title,
          content: thread.content,
          author: thread.author.username,
          createdAt: thread.createdAt
        }))
      });
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  }, [userId]);

  const roleCheck = useCallback(async () => {
    const role = await axios.get(`${getUserProfileRoute}/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    if (role.data.role === 'admin') {
      setIsAdmin(true);
    }
  }, [userId]);

  useEffect(() => {
    fetchThreads();
    roleCheck();
  }, [fetchThreads, roleCheck]);

  const fetchBranch = async () => {
    try {
      const branch = await axios.get(`${getUserProfileRoute}/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (branch.data.role === 'admin') {
        setIsAdmin(true);
      }
      return branch.data.universities[0].branch;
    } catch (error) {
      console.error('Error fetching branch:', error);
    }
  };

  const fetchPosts = async (threadId) => {
    try {
      const response = await axios.get(getPostsRoute(threadId, userId));
      dispatch({ type: 'SET_POSTS', payload: response.data });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreateThread = async () => {
    try {
      const branchId = await fetchBranch();
      await axios.post(createThreadRoute(userId), {
        title: state.newThreadTitle,
        content: state.newThreadDescription,
        branchId
      });
      fetchThreads();
      dispatch({ type: 'RESET_NEW_THREAD' });
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  const handleCreatePost = async (content) => {
    try {
      const response = await axios.post(createPostRoute(userId), {
        threadId: state.selectedThread.id,
        content
      });
      dispatch({ type: 'SET_POSTS', payload: [...state.posts, response.data] });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      await axios.post(votePostRoute(postId), { vote: voteType, userId: userId });
      fetchPosts(state.selectedThread.id);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleEdit = async (postId, newContent) => {
    try {
      await axios.put(postByIdRoute(postId), { content: newContent });
      fetchPosts(state.selectedThread.id);
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(postByIdRoute(postId));
      fetchPosts(state.selectedThread.id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleReply = async (postId, content) => {
    try {
      const response = await axios.post(createPostRoute(userId), {
        threadId: state.selectedThread.id,
        content,
        parentId: postId
      });
      const newReply = response.data;

      // Update posts state to place the reply below its parent
      const updatedPosts = state.posts.map((post) => {
        if (post._id === newReply.parentId) {
          return {
            ...post,
            replies: [...(post.replies || []), newReply],
          };
        }
        return post;
      });

      dispatch({ type: 'SET_POSTS', payload: updatedPosts });
    } catch (error) {
      console.error('Error replying:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-cream-light py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-brown-dark">VarsityVibe</h1>
          </div>

          {!state.selectedThread ? (
            <>
              {isAdmin && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <input
                    type="text"
                    value={state.newThreadTitle}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'newThreadTitle', value: e.target.value })}
                    placeholder="Post Title"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-brown-light"
                  />
                  <textarea
                    value={state.newThreadDescription}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'newThreadDescription', value: e.target.value })}
                    placeholder="Post Content"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-brown-light"
                  />
                  <button
                    onClick={handleCreateThread}
                    className="w-full bg-brown text-white py-2 rounded-lg hover:bg-brown-light transition-colors duration-200"
                  >
                    Create Thread
                  </button>
                </div>
              )}
              <div className="space-y-4">
                {state.threads.map((thread) => (
                  <div
                    key={thread.id}
                    className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  >
                    <h2 className="text-xl font-semibold text-brown-dark">{thread.title}</h2>
                    <p className="text-brown-light mt-2">{thread.content}</p>
                    <div className="flex justify-between items-center mt-4 text-sm text-brown-dark">
                      <span>Posted by {thread.author}</span>
                      <span>{new Date(thread.createdAt).toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => {
                        dispatch({ type: 'SET_SELECTED_THREAD', payload: thread });
                        fetchPosts(thread.id);
                      }}
                      className="text-brown hover:text-brown-light mt-4"
                    >
                      View Thread
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                className="flex items-center bg-brown text-white px-3 py-1 rounded-lg hover:bg-brown-light transition-colors duration-200 mb-4"
                onClick={() => dispatch({ type: 'SET_SELECTED_THREAD', payload: null })}
              >
                <IoIosArrowRoundBack size={25} />
                <span className="ml-2">Back</span>
              </button>
              <h2 className="text-xl font-bold text-brown-dark">{state.selectedThread.title}</h2>
              <PostSection
                posts={state.posts}
                userId={userId}
                onCreatePost={handleCreatePost}
                onVote={handleVote}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReply={handleReply}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForumPage;