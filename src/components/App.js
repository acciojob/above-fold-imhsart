
import React, { useState, useEffect, useRef } from "react";
import './../styles/App.css';


const App = () => {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [pageNum, setPageNum] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadingRef = useRef(false)

  useEffect(() => { //initial load
    loadMore(1, 5)
  }, [])

  useEffect(() => {

    const handleScroll = () => {
      if(loadingRef.current || !hasMore) return

      const reachedBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100
  
      if(reachedBottom){
        loadMore(pageNum, 5)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasMore, pageNum])

  async function loadMore(page = 1, limit = 5){
    if(loading.current || !hasMore) return
    loadingRef.current = true
    setLoading(true)

    try{
      const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${limit+1}`)
      if(!response.ok){
        throw new Error("Fetch failed. Try again.")
      }
      const data = await response.json()

      setHasMore(data.length > limit)
      setItems(prev => [...prev, ...data.slice(0, limit)])
      setPageNum(p => p+1)
    }
    catch(error){
      console.log("Error while fetching:", error)
    }finally{
      loadingRef.current = false
      setLoading(false)
    }
  }


  return (
    <div>
        {
          items.map(item => {
            return <div key={item.id}>
              <img src={item.thumbnailUrl} alt={item.title} />
              <h3>{item.title}</h3>
            </div>
          })
        }
        {
          loading && <div className="loadmore" style={{color: "red", fontSize: "16px"}}>Loading more items...</div>
        }
    </div>
  )
}

export default App
