import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { useUser } from "./InfoContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

export const HomePage = () => {
  const [firstname, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const [out, setOut] = useState(false);
  const [docCreated, setdocCreated] = useState(false);
  const [ID, setID] = useState(0);
  const {eml} = useUser();
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const [showSession, setShowSession] = useState(false);
 

  //states for displaying all documents
  const [documents, setDocuments] = useState<{ id: number; title: string; created_at: string; updated_at?: string; content?: string }[]>([]);
  const [mainError, setmainError] = useState(false);
 
  useEffect(() => {
    const getData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/");
          return;
        }
        const res = await fetch("http://localhost:4000/users", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setFirstname(data.first);
        setLastname(data.last);
      } catch (error) {
        console.log("Error occured");
        navigate("/");
      }
    };
    getData();
  }, []);

  const redirect = () => {
    setTimeout(() => {
      setOut(false);
      navigate("/"), Cookies.remove("token");
    }, 2000);
  };


  //Creating Document request
  const createDoc = async()=>{
    try {
        const res = await fetch('http://localhost:4000/createDocument', {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
               first: firstname,
               last: lastName,
               title: "Untitled Document",
               content: " "
           })
        })
        const data = await res.json();
        setID(data.id);
        setdocCreated(true);
        navigate(`/DocumentPage?id=${data.id}`);
    } catch (error) {
        throw new Error("Failed to create document");
    }
  }

  //display all documents worked on
  useEffect(()=>{
  const workedOn = async()=>{
    if(firstname.length === 0 || lastName.length === 0){
        return;
    }
    try {
        const res = await fetch(`http://localhost:4000/allDocuments/first/last?first=${firstname}&last=${lastName}`);
        const data = await res.json();
        let docs = Array.isArray(data) ? data : (Array.isArray(data.documents) ? data.documents : []);
        setDocuments(docs);
    } catch (error) {
        setmainError(true);
        return;
    }
  }
    workedOn();
  }, [firstname, lastName])

  // Handle click outside for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(null);
        setRenamingId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Delete document handler
  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/deleteDocument`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      setMenuOpen(null);
    } catch (error) {
      throw new Error("Failed to delete document");
    }
  };


  // Rename document handler
  const handleRename = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/updateTitle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: renameValue })
      });
      // Refetch documents to persist new title
      const res = await fetch(`http://localhost:4000/allDocuments/first/last?first=${firstname}&last=${lastName}`);
      const data = await res.json();
      let docs = Array.isArray(data) ? data : (Array.isArray(data.documents) ? data.documents : []);
      setDocuments(docs);
      setRenamingId(null);
      setMenuOpen(null);
    } catch (error) {
      throw new Error("Failed to rename document");
    }
  };

  useEffect(() => {
    if (eml) {
      setShowSession(true);
      const timer = setTimeout(() => setShowSession(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [eml]);



  return (
    <div id="homepageAnchor" className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center px-4 py-3 bg-white shadow-sm border-b border-gray-100">
          <span className="text-lg lg:text-xl font-extrabold tracking-tight text-gray-900">To:collab.</span>
    
        <ul className="flex items-center gap-3">
          <li className="flex items-center gap-2 min-w-0">
            <span className="hidden sm:inline font-semibold font-bold text-xl text-base text-gray-700">Welcome,</span>
            <span className="text-base font-normal text-gray-700 truncate max-w-[100px] text-lg sm:max-w-xs md:max-w-sm">{firstname} {lastName}</span>
          </li>
          <li className="text-base text-gray-500 hover:text-gray-900 transition-colors duration-200 cursor-pointer flex items-center justify-center p-1 rounded-full">
            <i className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center fa-regular text-black fa-user text-lg"></i>
          </li>
          <li
            onClick={() => { redirect(); setOut(true); }}
            className="flex gap-2 items-center border border-gray-200 px-2 py-1 rounded-lg text-gray-700 font-medium hover:bg-gray-100 hover:cursor-pointer transition-colors duration-200 text-sm"
          >
            Logout
          </li>
        </ul>
      </header>
      <span
        className={`${out ? "opacity-100" : "opacity-0"} transition-opacity duration-300 fixed top-5 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-lg px-4 py-2 rounded-xl flex items-center gap-2 text-gray-700 font-semibold text-sm z-50`}
      >
        <i className="fa-solid fa-arrow-right-to-bracket text-gray-500 text-base"></i>
        Logging out... Redirecting to Login Page
      </span>
      <main className="w-10/12  mt-3 mx-auto flex flex-col gap-6 py-6 px-2">
        <div className="mb-2">
          <span className="block text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Welcome to <span className="text-blue-600">To:collab.</span></span>
          <span className="block text-sm sm:text-base text-gray-600 font-medium">Create, collaborate, and organize your documents with ease.</span>
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-start">
          <button
            onClick={createDoc}
            className="w-44 h-52 flex flex-col items-center justify-center border border-gray-200 rounded-xl shadow-sm bg-gradient-to-br from-white to-gray-50 hover:shadow-md hover:border-blue-500 transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <span className="flex flex-col items-center justify-center gap-2">
              <span className="flex items-center justify-center bg-gray-100 group-hover:bg-blue-50 rounded-full w-10 h-10 transition-colors duration-200 shadow-sm">
                <i className="fa-solid fa-plus text-xl text-gray-500 group-hover:text-blue-600 transition-colors duration-200"></i>
              </span>
              <span className="mt-2 text-base font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200 tracking-tight">Create New Doc</span>
            </span>
            <span className="mt-2 text-xs text-gray-400 group-hover:text-blue-400 transition-colors duration-200">Start fresh</span>
          </button>
          <span
            className={`${eml ? "opacity-100" : "opacity-0"} transition-opacity duration-300 fixed left-1/2 top-20 -translate-x-1/2 bg-blue-50 border border-blue-200 shadow px-3 py-1.5 rounded-lg flex items-center gap-2 text-blue-700 font-semibold text-xs sm:text-sm z-40`}
            style={{ minWidth: 'fit-content', maxWidth: '90vw', textAlign: 'center' }}
          >
            <i className="fa-regular fa-clock text-blue-400 text-base"></i>
            Session will expire in 7 hour
          </span>
        </div>
        <section className="mt-6 mb-2">
          <span className="block text-lg sm:text-xl font-bold text-gray-800 tracking-tight border-b border-gray-200 pb-1">Documents You've Worked On</span>
        </section>
        <div className="text-black">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {documents.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <i className="fa-regular fa-folder-open text-5xl text-gray-300 mb-3"></i>
                <span className="font-semibold text-lg text-gray-500">No Documents Yet</span>
                <span className="text-sm text-gray-400 mt-1">Start by creating your first document!</span>
              </div>
            )}
            {documents.map((doc, i) => {
              const formattedDate = new Date(doc.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              });
              // Only show updated_at if it exists, is different from created_at, and document has content
              const hasContent = doc.content && doc.content.trim().length > 0;
              const showUpdated = hasContent && doc.updated_at && doc.updated_at !== doc.created_at;
              const formattedUpdated = showUpdated && typeof doc.updated_at === 'string'
                ? new Date(doc.updated_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })
                : null;
              return (
                <Link
                  key={i}
                  to={renamingId === doc.id ? "#" : `/DocumentPage?id=${doc.id}`}
                  className="relative group block bg-white border border-gray-200 rounded-lg shadow-sm p-4 h-40 flex flex-col justify-between hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-600 rounded-lg p-1.5">
                      <i className="fa-regular fa-file-lines text-xl"></i>
                    </span>
                    <div className="flex justify-between items-center w-full relative">
                      {renamingId === doc.id ? (
                        <input
                          className="font-bold text-base text-gray-900 truncate max-w-[120px] group-hover:text-blue-600 border-b border-blue-400 outline-none bg-gray-50 px-1"
                          value={renameValue}
                          onChange={e => setRenameValue(e.target.value)}
                          onBlur={() => setRenamingId(null)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleRename(doc.id);
                            if (e.key === 'Escape') setRenamingId(null);
                          }}
                          autoFocus
                        />
                      ) : (
                        <span  className="font-bold text-base text-gray-900 truncate max-w-[120px] group-hover:text-blue-600">{doc.title}</span>
                      )}
                      <i
                        className="flex items-center justify-center hover:bg-gray-100 transition duration-100 p-1 rounded-3xl h-8 w-8 fa-solid fa-ellipsis-vertical"
                        onClick={e => { e.preventDefault(); e.stopPropagation(); setMenuOpen(menuOpen === doc.id ? null : doc.id); }}
                      ></i>
                      {menuOpen === doc.id && (
                        <div ref={menuRef} className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded shadow-md py-1 w-32 flex flex-col animate-fade-in">
                          <button
                            className="text-left px-4 py-2 hover:bg-gray-100 text-sm"
                            onClick={e => { e.preventDefault(); e.stopPropagation(); setRenamingId(doc.id); setRenameValue(doc.title); setMenuOpen(null); }}
                          >Rename</button>
                          <button
                            className="flex gap-1 items-center text-left px-4 py-2 hover:bg-red-100 text-sm text-red-600"
                            onClick={e => { e.preventDefault(); e.stopPropagation(); handleDelete(doc.id); }}
                          ><i className="fa-solid fa-trash"></i>Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-auto">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500 ">Created On: {formattedDate}</span>
                      {formattedUpdated && <span className="text-xs text-gray-500">Last Changes on: {formattedUpdated}</span>}
                    </div>
                    <span className="text-xs text-gray-400">ID: {doc.id}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
export default HomePage;
