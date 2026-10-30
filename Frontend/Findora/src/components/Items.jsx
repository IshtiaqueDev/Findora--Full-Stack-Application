import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Items(){
    const[items,setItems]=useState([]);

    const getItems=async()=>{
        try{
            let response=await axios.get("http://localhost:5000/item",{
                withCredentials:true
            });
            console.log(response.data);
           return setItems(response.data.Items);
        }catch(err){
            return toast.error(err.message);
        }
    }

    useEffect(()=>{
        getItems();
    },[]);

    return(
        <>
        {
        items.map((item)=>
        <div key={item._id} className="container" style={{border:"2px solid black" ,marginBottom:"10px"}}>
        <h3>Item</h3>
        <h4>{item.name}</h4>
        <p>{item.description}</p>
        <p>Category: {item.category}</p>
        
        <p>Status : {item.type}</p>
        <p>Posted By:{item.postedBy.username}</p>
        </div>
        )
        }
        </>
    )
}

export default Items;