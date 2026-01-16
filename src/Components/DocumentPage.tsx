import { Link } from "react-router";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
export const DocumentPage = () => {
    const [docContent, setdocContent] = useState("");
    const [searchParams] = useSearchParams()
    const [updTime, setupdTime] = useState("");
    const uID = searchParams.get('id');

  const updateDoc = async()=>{
    try {
        console.log(uID);
        const res = await fetch('http://localhost:4000/updateDoc', {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                content: docContent,
                id: uID,
            })
        })
    } catch (error) {
        return;
    }
  }

  //on reloads always show latest changes
  useEffect(()=>{
    const showContent = async()=>{
        try {
            const res = await fetch(`http://localhost:4000/loadContent/id?id=${uID}`)
            const data = await res.json();
            setdocContent(data.content);
        } catch (error) {
            return;
        }
    }
    showContent();
  }, [uID])

  //update times
  const updateTime = async()=>{
    try {   
        const res = await fetch('http://localhost:4000/updateTime',{
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                id: uID
            })
        })
        const data = await res.json();
        setupdTime(data.updated_at);
    } catch (error) {
        return;
    }
  }

  return (
    <div>
        <header className="flex justify-between items-center px-6 py-3 bg-white/90 shadow-sm border-b border-gray-100 backdrop-blur-md sticky top-0 z-10">
        <span className="text-xl lg:text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
          <i className="fa-solid fa-file-lines text-gray-500"></i>To:collab.
        </span>
        <ul className="flex items-center gap-4 relative">
          <li className="flex items-center gap-2 min-w-0">
            {/* Reserved for future icons or user info */}
          </li>
          <li className="text-lg text-gray-500 hover:text-gray-900 transition-colors duration-200 cursor-pointer flex items-center justify-center p-2 rounded-full">
            <Link to={"/HomePage"}>
            <span onClick={()=> {updateDoc(); updateTime();}} className="flex gap-1 items-center"><i className="fa-solid fa-chevron-left"></i>Save & Go back</span>
            </Link>
          </li>
        </ul>
      </header>

      {/* Tools bar under header */}
      <div className="flex items-center justify-between w-9/12 lg:w-6/12 mx-auto mt-2 mb-1 px-2 py-1 bg-white/80 border border-gray-200 rounded-lg shadow-sm text-gray-600 text-sm select-none">
        <div>Word count: {docContent.trim().length === 0 ? 0 : docContent.trim().split(/\s+/).length}</div>
        <button
          className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition text-gray-700 border border-gray-300 shadow-sm"
          onClick={() => {navigator.clipboard.writeText(docContent)}}
        >
          <i className="fa-regular fa-copy"></i> Copy
        </button>
      </div>

      <main className="h-screen flex flex-col ">
        <textarea value={docContent} onChange={e => setdocContent(e.target.value)} className="border border-gray-500 resize-none w-9/12 lg:w-6/12 outline-none pl-5 p-3 text-base ml-auto mr-auto h-full mt-3"></textarea>
      </main>
    </div>
  )
}
export default DocumentPage;