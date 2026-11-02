import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserProvider";
import { Link } from "react-router-dom";

function Items() {
    const [items, setItems] = useState([]);
    const { user } = useContext(UserContext);

    const getItems = async () => {
        try {
            const response = await axios.get("http://localhost:5000/item", {
                withCredentials: true,
            });
            setItems(response.data.Items);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    // Assumes your backend has DELETE /item/:id. Change the URL if yours differs.
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return;
        try {
            const response = await axios.delete(`http://localhost:5000/item/${id}`, {
                withCredentials: true,
            });
            toast.success(response.data.message || "Item deleted");
            setItems((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    return (
        <div className="items-box">
            {items.length === 0 ? (
                <p className="items-empty">No items posted yet.</p>
            ) : (
                <div className="items-grid">
                    {items.map((item) => {
                        const isOwner = user && item.postedBy?._id === user._id;
                        const type = item.type?.toLowerCase();

                        return (
                            <div className={`item-card ${type}`} key={item._id}>
                                <div className="item-card-header">
                                    <span className={`item-status ${type}`}>{item.type}</span>
                                    <span className="item-category">{item.category}</span>
                                </div>

                                <div className="item-card-body">
                                    <h3>{item.name}</h3>
                                    <p className="item-description">{item.description}</p>

                                    <div className="item-meta">
                                        <p><strong>Location:</strong> {item.location}</p>
                                        <p><strong>Colour:</strong> {item.color}</p>
                                        <p><strong>Posted by:</strong> {item.postedBy?.username}</p>
                                    </div>
                                </div>

                                <div className="item-card-footer">
                                    <Link to={`/items/${item._id}`} className="view-btn">
                                        View Details
                                    </Link>
                                    {isOwner && (
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Items;