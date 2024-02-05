import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle, 
    description: existingDescription, 
    price: existingPrice,
    images: existingImages,
    category: existingCategory
}) {
     const [title, setTitle] = useState(existingTitle || '');
     const [description, setDescription] = useState(existingDescription || '');
     const [category, setCategory] = useState(existingCategory || '');
     const [price, setPrice] = useState(existingPrice || '');
     const [images, setImages] = useState(existingImages || []);
     const [goToProducts, setGoToProducts] = useState(false);
     const[isUploading, setIsUploading]= useState(false);
     const [categories, setCategories] = useState([]);
     const router = useRouter();
     useEffect(() => {
      axios.get('/api/categories').then(result => {
        setCategories(result.data);
      })
     }, []);
     async function saveProduct(e) {
       e.preventDefault();
        const data = {title,description,price,images, category};
       if (_id) {
      //update
      await axios.put("/api/products", { ...data,_id});
       } else {
        //create
      await axios.post("/api/products", data);
     }
       setGoToProducts(true);
      }

     if (goToProducts) {
       router.push("/products");
     }
     async function uploadImage(e) {
const files = e.target?.files;
if(files?.length > 0) {
  setIsUploading(true);
const data = new FormData();
for(const file of files) {
data.append('file', file)
}
const res = await axios.post('/api/upload', data);
setImages(oldImages => {
  return [...oldImages, ...res.data.links];
});
setIsUploading(false);
}
     }
     function updateImagesOrder(images){
setImages(images);
     }

     return (
       <form onSubmit={saveProduct}>
         <label>Product Name</label>
         <input
           type="text"
           placeholder="Product name"
           value={title}
           onChange={(e) => setTitle(e.target.value)}
         />
         <label>Category</label>
         <select
          value={category}
          onChange={e => setCategory(e.target.value)}
         >
          <option value="">Uncategorised</option>
          {categories.length > 0 && categories.map(c => (
           <option key={_id}value={c._id}>{c.name}</option>
          )) }
         </select>
         <label>Photos</label>
         <div className="flex flex-wrap gap-2  mb-2 ml-2">
           <ReactSortable className="flex flex-wrap gap-2" list={images} setList={updateImagesOrder}>
             {!!images?.length &&
               images.map((link) => (
                 <div key={link} className="h-24">
                   <img src={link} alt="image" className="rounded-lg" />
                 </div>
               ))}
           </ReactSortable>
           {isUploading && (
             <div className="h-24 flex items-center">
               <Spinner />
             </div>
           )}
           <label className="w-24 h-24 border cursor-pointer flex flex-col text-center items-center justify-center text-slate-500 rounded-lg bg-slate-200">
             <div>Upload</div>
             <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               strokeWidth={1.5}
               stroke="currentColor"
               className="w-6 h-6"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
               />
             </svg>
             <input type="file" onChange={uploadImage} className="hidden" />
           </label>
           {!images?.length && (
             <div className="ml-2">No photos in this product</div>
           )}
         </div>
         <label>Description</label>
         <textarea
           placeholder="Description"
           value={description}
           onChange={(e) => setDescription(e.target.value)}
         />
         <label>Price</label>
         <input
           type="number"
           placeholder="Price"
           value={price}
           onChange={(e) => setPrice(e.target.value)}
         />
         <button type="submit" className="btn-primary">
           Save
         </button>
       </form>
     );
}