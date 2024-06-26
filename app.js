import {useState, useEffect} from 'react'
import './App.css'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
import BlogForm from './components/BlogForm'

const mockAPI = {
  fetchPosts: () => JSON.parse(localStorage.getItem('posts')) || [],
  savePosts: posts => localStorage.setItem('posts', JSON.stringify(posts)),
}

const App = () => {
  const [posts, setPosts] = useState([])
  const [currentPost, setCurrentPost] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchedPosts = mockAPI.fetchPosts()
    setPosts(fetchedPosts)
  }, [])

  const handleViewPost = id => {
    const post = posts.find(p => p.id === id)
    setCurrentPost(post)
    setIsEditing(false)
  }

  const handleAddPost = post => {
    const newPosts = [...posts, {...post, id: Date.now()}]
    setPosts(newPosts)
    mockAPI.savePosts(newPosts)
  }

  const handleEditPost = updatedPost => {
    const updatedPosts = posts.map(p =>
      p.id === updatedPost.id ? updatedPost : p,
    )
    setPosts(updatedPosts)
    mockAPI.savePosts(updatedPosts)
  }

  const handleDeletePost = id => {
    const updatedPosts = posts.filter(p => p.id !== id)
    setPosts(updatedPosts)
    mockAPI.savePosts(updatedPosts)

    if (currentPost && currentPost.id === id) {
      setCurrentPost(null)
      setIsEditing(false)
    }
  }

  const handleBack = () => {
    setCurrentPost(null)
    setIsEditing(false)
  }

  return (
    <div className="app-container">
      <div className="brand-bg-container">
        <h1 className="main-heading-title">Vijay's Poditivity Blogger</h1>
        <div>
          <img
            src="https://media.licdn.com/dms/image/D560BAQHqP4wcT7d5-A/company-logo_200_200/0/1701101428517?e=1727308800&v=beta&t=GmeCUR03ckDzfPyrLj8c1_kvl7XU2uWv4r3rzc0Guhk"
            alt="brand icon"
            className="brand-icon"
          />
        </div>
      </div>
      <div className="container">
        {(isEditing || currentPost === null) && (
          <BlogForm
            initialData={currentPost}
            onSave={post => {
              if (currentPost) {
                handleEditPost(post)
              } else {
                handleAddPost(post)
              }
              setCurrentPost(null)
              setIsEditing(false)
            }}
          />
        )}
        {!currentPost && !isEditing && (
          <BlogList posts={posts} onView={handleViewPost} />
        )}

        {currentPost && !isEditing && (
          <BlogPost
            post={currentPost}
            onDelete={handleDeletePost}
            onEdit={post => {
              setCurrentPost(post)
              setIsEditing(true)
            }}
            onBack={handleBack}
          />
        )}
      </div>
      <a
        href="https://www.linkedin.com/in/vijay-venkat-kolatapu/"
        rel="noreferrer"
        target="_blank"
        className="developer"
      >
        Follow
      </a>
    </div>
  )
}

export default App
